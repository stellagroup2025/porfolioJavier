import * as THREE from "three"

export type AnimationHandle = {
  canvas: HTMLCanvasElement
  render: (time: number) => void
  dispose: () => void
  /** Coordenadas normalizadas (0..1) origen top-left.
   *  Solo implementado por las animaciones que tenían mouse en el demo original
   *  (icosphere, quantum, physics). El resto omite el método. */
  setMouse?: (x: number, y: number) => void
}

export type AnimationFactoryOptions = {
  /** Si true, la animación lee mouse via setMouse en vez de usar las
   *  sustituciones procedurales (sin/cos, valores fijos, etc.). */
  interactive?: boolean
}

const VERTEX_SHADER = /* glsl */ `
attribute float size;
attribute vec3 color;
varying vec3 vColor;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (350.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

const FRAGMENT_SHADER = /* glsl */ `
varying vec3 vColor;
uniform sampler2D pointTexture;
void main() {
  vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
  if (textureColor.a < 0.3) discard;
  vec4 color = vec4(vColor.xyz, 1.0) * textureColor;
  gl_FragColor = color;
}
`

const POINT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
      <stop offset="60%" stop-color="#fff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="32" cy="32" r="28" fill="url(#g)"/>
</svg>`

function makePointTexture() {
  const url = `data:image/svg+xml;utf8,${encodeURIComponent(POINT_SVG)}`
  const img = new Image()
  img.src = url
  const texture = new THREE.Texture(img)
  img.onload = () => {
    texture.needsUpdate = true
  }
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

export function createGalaxy(
  width: number,
  height: number,
  _opts?: AnimationFactoryOptions,
): AnimationHandle {
  // galaxy no tenía mouse en el demo original — el flag se ignora.
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height, false)
  renderer.setClearColor(0x000000, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000)
  camera.position.set(0, 0, 350)

  const galaxyGroup = new THREE.Group()
  scene.add(galaxyGroup)

  // Paleta del demo original.
  const palette = [
    new THREE.Color(0xac1122),
    new THREE.Color(0x96789f),
    new THREE.Color(0x535353),
  ]

  const dotsAmount = 3000
  const basePositions = new Float32Array(dotsAmount * 3)
  const positions = new Float32Array(dotsAmount * 3)
  const sizes = new Float32Array(dotsAmount)
  const colors = new Float32Array(dotsAmount * 3)
  // Por punto: animado o no, fase, velocidad, factor de stretch
  const animated = new Uint8Array(dotsAmount)
  const phase = new Float32Array(dotsAmount)
  const speed = new Float32Array(dotsAmount)
  const stretch = new Float32Array(dotsAmount)
  // Para detectar líneas: positions tridimensionales
  const verticesForLines: THREE.Vector3[] = []

  for (let i = 0; i < dotsAmount; i += 1) {
    const theta = Math.random() * Math.PI * 2
    const phi =
      ((1 - Math.sqrt(Math.random())) * Math.PI) / 2 * (Math.random() > 0.5 ? 1 : -1)
    const radius = 120 + (Math.random() - 0.5) * 5
    const x = Math.cos(theta) * Math.cos(phi) * radius
    const y = Math.sin(phi) * radius
    const z = Math.sin(theta) * Math.cos(phi) * radius

    basePositions[i * 3] = x
    basePositions[i * 3 + 1] = y
    basePositions[i * 3 + 2] = z
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    sizes[i] = 5

    const colorIndex = Math.floor(Math.random() * palette.length)
    palette[colorIndex].toArray(colors, i * 3)

    animated[i] = Math.random() > 0.5 ? 1 : 0
    phase[i] = Math.random() * Math.PI * 2
    speed[i] = 0.25 + Math.random() * 0.4
    stretch[i] = (Math.random() - 0.5) * 0.18 + 1

    verticesForLines.push(new THREE.Vector3(x, y, z))
  }

  const dotsGeometry = new THREE.BufferGeometry()
  const positionAttr = new THREE.BufferAttribute(positions, 3)
  positionAttr.usage = THREE.DynamicDrawUsage
  dotsGeometry.setAttribute("position", positionAttr)
  const sizeAttr = new THREE.BufferAttribute(sizes, 1)
  dotsGeometry.setAttribute("size", sizeAttr)
  dotsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  const pointTexture = makePointTexture()

  const dotsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: pointTexture },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
  })

  const points = new THREE.Points(dotsGeometry, dotsMaterial)
  galaxyGroup.add(points)

  // Líneas blancas entre puntos cercanos (igual que el demo original).
  const lineVertices: number[] = []
  const lineColors: number[] = []
  for (let i = 0; i < verticesForLines.length; i += 1) {
    const a = verticesForLines[i]
    for (let j = i + 1; j < verticesForLines.length; j += 1) {
      const b = verticesForLines[j]
      if (a.distanceTo(b) < 12) {
        lineVertices.push(a.x, a.y, a.z, b.x, b.y, b.z)
        // Usamos color del punto i para el par.
        const ci = i * 3
        lineColors.push(
          colors[ci],
          colors[ci + 1],
          colors[ci + 2],
          colors[ci],
          colors[ci + 1],
          colors[ci + 2]
        )
      }
    }
  }
  const lineGeometry = new THREE.BufferGeometry()
  const lineVerticesArray = new Float32Array(lineVertices)
  const lineColorsArray = new Float32Array(lineColors)
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(lineVerticesArray, 3))
  lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColorsArray, 3))
  const lineMaterial = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: 0.3,
    vertexColors: true,
  })
  const segments = new THREE.LineSegments(lineGeometry, lineMaterial)
  galaxyGroup.add(segments)

  // Map original index → indices en lineVerticesArray que dependen de ese vertex.
  // No reconstruimos los segmentos por animación (estáticos), pero sí los puntos.

  let isDisposed = false

  function render(time: number) {
    if (isDisposed) return
    const t = time * 0.001
    // Rotación suave del cluster completo.
    galaxyGroup.rotation.y = t * 0.05
    galaxyGroup.rotation.x = Math.sin(t * 0.07) * 0.12

    // Animar las posiciones de los puntos marcados como "animated".
    const pos = positionAttr.array as Float32Array
    for (let i = 0; i < dotsAmount; i += 1) {
      if (!animated[i]) continue
      const factor = 1 + (stretch[i] - 1) * Math.sin(t * speed[i] + phase[i])
      const ix = i * 3
      pos[ix] = basePositions[ix] * factor
      pos[ix + 1] = basePositions[ix + 1] * factor
      pos[ix + 2] = basePositions[ix + 2] * factor
    }
    positionAttr.needsUpdate = true

    renderer.render(scene, camera)
  }

  function dispose() {
    isDisposed = true
    dotsGeometry.dispose()
    dotsMaterial.dispose()
    lineGeometry.dispose()
    lineMaterial.dispose()
    pointTexture.dispose()
    renderer.dispose()
  }

  return { canvas, render, dispose }
}
