import * as THREE from "three"
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import type { AnimationFactoryOptions, AnimationHandle } from "./galaxy"

const VERTEX_SHADER = /* glsl */ `
attribute float size;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (350.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

const FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D pointTexture;
uniform vec3 uColor;
void main() {
  vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
  if (textureColor.a < 0.35) discard;
  gl_FragColor = vec4(uColor, textureColor.a);
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

// Replica el easing Back.easeOut de TweenMax sobre t en 0..1.
function backOut(t: number, s = 1.70158): number {
  const u = t - 1
  return u * u * ((s + 1) * u + s) + 1
}

export function createIcosphere(
  width: number,
  height: number,
  opts?: AnimationFactoryOptions,
): AnimationHandle {
  const interactive = opts?.interactive === true
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height, false)
  renderer.setClearColor(0x59c384, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000)
  camera.position.set(0, 0, 115)

  const radius = 50
  // detail 8 → tras merge ~655362 vértices únicos. Densidad muy alta: ~4×
  // la del demo original de Codrops. mergeVertices tarda ~300ms en init pero
  // es one-shot. El loop per-frame itera 655k veces — pesa pero entra en 60fps.
  const rawSphere = new THREE.IcosahedronGeometry(radius, 8)
  const sphereGeom = mergeVertices(rawSphere)
  rawSphere.dispose()
  const sourcePositions = sphereGeom.attributes.position.array as Float32Array
  const count = sourcePositions.length / 3

  // Guardamos las posiciones base y por-vertice un delay segundo para la oscilación.
  const basePositions = new Float32Array(sourcePositions)
  const positions = new Float32Array(sourcePositions)
  const sizes = new Float32Array(count)
  const delays = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    // Puntos muy finos: con 160k vertices y cámara cerca, conviene ~1.6 px.
    sizes[i] = 1.6
    const y = basePositions[i * 3 + 1]
    delays[i] = Math.abs(y / radius) * 2 // 0..2 segundos según latitud
  }

  const dotsGeom = new THREE.BufferGeometry()
  const positionAttr = new THREE.BufferAttribute(positions, 3)
  positionAttr.usage = THREE.DynamicDrawUsage
  dotsGeom.setAttribute("position", positionAttr)
  dotsGeom.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

  const pointTexture = makePointTexture()

  const dotsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: pointTexture },
      uColor: { value: new THREE.Color(0x0a1929) }, // azul muy oscuro
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
  })

  const dots = new THREE.Points(dotsGeom, dotsMaterial)
  scene.add(dots)

  // Liberamos la geometry intermedia: ya copiamos los vértices.
  sphereGeom.dispose()

  let isDisposed = false

  // Ciclo simétrico ida/vuelta con easing back-out en cada mitad.
  // Periodo total = 8s (4s de colapso, 4s de expansión).
  const halfPeriod = 4
  const period = halfPeriod * 2

  // Estado de mouse en modo interactive. Default no-centrado (0.65, 0.4) para
  // que el primer frame tenga ya algo de tilt: el icosaedro a orientación
  // perfectamente simétrica (0,0,0) deja ver las líneas geodésicas de su
  // tessellation y parece que hay "clumps" de puntos. El demo original tampoco
  // arrancaba en (0,0,0) — `var mouse = new THREE.Vector2(0.8, 0.5)`.
  let mouseTargetX = 0.65
  let mouseTargetY = 0.4
  let mouseSmoothX = 0.65
  let mouseSmoothY = 0.4

  function render(time: number) {
    if (isDisposed) return
    const t = time * 0.001

    if (interactive) {
      // Lerp con k≈0.04 → llega a ~95% del target en ~75 frames ≈ 1.25s.
      // Aproxima el "fast-then-slow" de Power1.easeOut sobre 4s del demo.
      const k = 0.04
      mouseSmoothX += (mouseTargetX - mouseSmoothX) * k
      mouseSmoothY += (mouseTargetY - mouseSmoothY) * k
      // Demo original: rotation.x = mouse.y*π/2, rotation.z = mouse.x*π/5,
      // con mouse en rango [-0.5, 0.5]. Aquí mouseSmooth viene en [0, 1],
      // así que centramos restando 0.5.
      dots.rotation.x = (mouseSmoothY - 0.5) * Math.PI * 0.5
      dots.rotation.z = (mouseSmoothX - 0.5) * Math.PI * 0.2
      // Rotación Y procedural muy lenta (1 vuelta cada ~2 minutos): no estaba
      // en el demo original, pero sin ella las líneas geodésicas del icosaedro
      // quedan estáticas y crean falsos clumps cuando el cursor no se mueve.
      dots.rotation.y = t * 0.05
    } else {
      // Rotación procedural — para vista en la card sin cursor.
      dots.rotation.y = t * 0.18
      dots.rotation.x = Math.sin(t * 0.35) * 0.35
      dots.rotation.z = Math.cos(t * 0.27) * 0.18
    }

    const pos = positionAttr.array as Float32Array
    for (let i = 0; i < count; i += 1) {
      const local = ((t - delays[i]) % period + period) % period
      let k
      if (local < halfPeriod) {
        // Ida: posición original → centro (backOut acelera al final).
        k = backOut(local / halfPeriod)
      } else {
        // Vuelta: centro → posición original.
        k = backOut(1 - (local - halfPeriod) / halfPeriod)
      }
      const ix = i * 3
      pos[ix] = basePositions[ix] * (1 - k)
      pos[ix + 1] = basePositions[ix + 1]
      pos[ix + 2] = basePositions[ix + 2] * (1 - k)
    }
    positionAttr.needsUpdate = true

    renderer.render(scene, camera)
  }

  function dispose() {
    isDisposed = true
    dotsGeom.dispose()
    dotsMaterial.dispose()
    pointTexture.dispose()
    renderer.dispose()
  }

  function setMouse(x: number, y: number) {
    mouseTargetX = x
    mouseTargetY = y
  }

  return { canvas, render, dispose, setMouse }
}
