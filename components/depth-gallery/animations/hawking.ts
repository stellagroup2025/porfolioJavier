import * as THREE from "three"
import type { AnimationFactoryOptions, AnimationHandle } from "./galaxy"

export function createHawking(
  width: number,
  height: number,
  _opts?: AnimationFactoryOptions,
): AnimationHandle {
  // demo6 no tenía mouse — el flag interactive se ignora.
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height, false)
  renderer.setClearColor(0x191919, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
  camera.position.set(0, 0, 280)

  const sphereGroup = new THREE.Group()
  scene.add(sphereGroup)

  // Dos materiales compartidos: ~80% líneas son gris #4a4a4a, ~20% indigo
  // #3F51B5 (selección con random > 0.2).
  const mat1 = new THREE.LineBasicMaterial({ color: 0x4a4a4a })
  const mat2 = new THREE.LineBasicMaterial({ color: 0x3f51b5 })

  const radius = 100
  const linesAmount = 50
  const dotsAmount = 50

  type LineData = {
    geom: THREE.BufferGeometry
    posAttr: THREE.BufferAttribute
    speed: number
    radius: number
    // Pre-computamos el ratio por dot para no recalcular |x| ni divisiones
    // dentro del bucle de render.
    ratios: Float32Array
  }
  const lineDatas: LineData[] = []

  for (let i = 0; i < linesAmount; i += 1) {
    // line.radius = floor(radius + (random-0.5) * (radius*0.2))
    // Resulta un entero en [90, 109] aprox.
    const lineRadius = Math.floor(
      radius + (Math.random() - 0.5) * (radius * 0.2),
    )

    const positions = new Float32Array(dotsAmount * 3)
    const ratios = new Float32Array(dotsAmount)
    for (let j = 0; j < dotsAmount; j += 1) {
      // x = (j/dots)*2r - r  →  de -r a (1 - 1/dots)*r
      const x = (j / dotsAmount) * lineRadius * 2 - lineRadius
      positions[j * 3] = x
      positions[j * 3 + 1] = 0
      positions[j * 3 + 2] = 0
      // ratio = 1 - (r - |x|)/r  →  0 en el centro (pinned), ~1 en los bordes.
      ratios[j] = 1 - (lineRadius - Math.abs(x)) / lineRadius
    }

    const geom = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(positions, 3)
    posAttr.usage = THREE.DynamicDrawUsage
    geom.setAttribute("position", posAttr)

    const material = Math.random() > 0.2 ? mat1 : mat2
    const line = new THREE.Line(geom, material)
    // Rotación inicial random en [0, π] en cada eje (NO [0, 2π] — fidedigno
    // al demo, que solo cubre el hemisferio superior de orientaciones).
    line.rotation.x = Math.random() * Math.PI
    line.rotation.y = Math.random() * Math.PI
    line.rotation.z = Math.random() * Math.PI
    sphereGroup.add(line)

    lineDatas.push({
      geom,
      posAttr,
      // line.speed = random*300 + 250 → [250, 550]
      speed: Math.random() * 300 + 250,
      radius: lineRadius,
      ratios,
    })
  }

  let isDisposed = false

  function render(time: number) {
    if (isDisposed) return

    // sphere.rotation del demo: a*0.0001 en Y, -a*0.0001 en X. Una vuelta
    // completa cada ~62 segundos en cada eje (sentidos opuestos = tumble
    // suave del grupo entero).
    sphereGroup.rotation.y = time * 0.0001
    sphereGroup.rotation.x = -time * 0.0001

    for (let i = 0; i < lineDatas.length; i += 1) {
      const ld = lineDatas[i]
      const pos = ld.posAttr.array as Float32Array
      const ratios = ld.ratios
      const speed = ld.speed
      for (let j = 0; j < dotsAmount; j += 1) {
        // y = sin(a/speed + j*0.15) * 12 * ratio
        // El offset j*0.15 hace que dots vecinos tengan fase distinta →
        // la onda viaja a lo largo de la línea. Solo se actualiza Y.
        pos[j * 3 + 1] = Math.sin(time / speed + j * 0.15) * 12 * ratios[j]
      }
      ld.posAttr.needsUpdate = true
    }

    renderer.render(scene, camera)
  }

  function dispose() {
    isDisposed = true
    for (const ld of lineDatas) ld.geom.dispose()
    mat1.dispose()
    mat2.dispose()
    renderer.dispose()
  }

  return { canvas, render, dispose }
}
