import * as THREE from "three"
import type { AnimationFactoryOptions, AnimationHandle } from "./galaxy"
import { simplex3 } from "./noise"

export function createPhysics(
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
  renderer.setClearColor(0x101010, 1)

  const scene = new THREE.Scene()
  // Sin fondo decorativo: clearColor del renderer ya da el #101010 sólido.

  // FOV 40 (lente algo telefoto) y cámara a z=350 para encuadre apretado.
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
  camera.position.set(0, 0, 350)

  const sphereGroup = new THREE.Group()
  scene.add(sphereGroup)

  const linesAmount = 18
  const radius = 100
  const verticesAmount = 50
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xfe0e55 })

  // Vértices base = círculo unitario en plano XZ con `verticesAmount + 1`
  // puntos (el último = el primero, para cerrar el bucle). Se comparte para
  // las 18 líneas — todas escalan estos mismos valores cada frame.
  const baseUnits = new Float32Array((verticesAmount + 1) * 3)
  for (let i = 0; i <= verticesAmount; i += 1) {
    const angle = (i / verticesAmount) * Math.PI * 2
    baseUnits[i * 3] = Math.cos(angle)
    baseUnits[i * 3 + 1] = 0
    baseUnits[i * 3 + 2] = Math.sin(angle)
  }

  type LineData = {
    geom: THREE.BufferGeometry
    posAttr: THREE.BufferAttribute
    y: number
  }
  const lineDatas: LineData[] = []

  for (let j = 0; j < linesAmount; j += 1) {
    const positions = new Float32Array(baseUnits) // copia inicial
    const geom = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(positions, 3)
    posAttr.usage = THREE.DynamicDrawUsage
    geom.setAttribute("position", posAttr)
    const line = new THREE.Line(geom, lineMaterial)
    sphereGroup.add(line)
    lineDatas.push({
      geom,
      posAttr,
      // Estado inicial: las 18 líneas se distribuyen uniformemente entre
      // y=0 y y=2r (no incluído), igual que el demo original.
      y: (j / linesAmount) * radius * 2,
    })
  }

  let isDisposed = false

  // Mouse state — solo se usa cuando interactive=true. El demo4 mueve
  // rotation.x con TweenMax(2s, Power1.easeOut) sobre mouse.y.
  let mouseTargetY = 0.5
  let mouseSmoothY = 0.5

  function render(time: number) {
    if (isDisposed) return

    if (interactive) {
      // k≈0.025 aproxima Power1.easeOut sobre 2s del demo (95% en ~120 frames).
      const k = 0.025
      mouseSmoothY += (mouseTargetY - mouseSmoothY) * k
      // Demo: rotation.x = mouse.y * 1 con mouse.y en [0, 1] → rad 0..1.
      sphereGroup.rotation.x = mouseSmoothY
      sphereGroup.rotation.y = 0
    } else {
      // Sin mouse, arranca como el demo en mouse=(0.8, 0.5) → 0.5 rad fijo.
      sphereGroup.rotation.x = 0.5
      sphereGroup.rotation.y = 0
    }

    for (let j = 0; j < lineDatas.length; j += 1) {
      const ld = lineDatas[j]
      // Línea sube 0.3 unidades/frame y wrap a 0 al pasar 2r — idéntico al demo.
      ld.y += 0.3
      if (ld.y > radius * 2) ld.y = 0

      // Radio de la sección esférica a altura y: sqrt(y * (2r - y)).
      const radiusHeight = Math.sqrt(ld.y * (2 * radius - ld.y))
      const pos = ld.posAttr.array as Float32Array

      for (let i = 0; i <= verticesAmount; i += 1) {
        const baseX = baseUnits[i * 3]
        const baseZ = baseUnits[i * 3 + 2]
        // Fórmula del demo, sin cambios:
        //   ratio = noise.simplex3(vx*0.009, vz*0.009 + a*0.0006, y*0.009) * 15
        //   vector.copy(_o); vector.multiplyScalar(radiusHeight + ratio)
        //   vector.y = line.geometry.y - radius
        const ratio = simplex3(
          baseX * 0.009,
          baseZ * 0.009 + time * 0.0006,
          ld.y * 0.009,
        ) * 15
        const scale = radiusHeight + ratio
        pos[i * 3] = baseX * scale
        pos[i * 3 + 1] = ld.y - radius
        pos[i * 3 + 2] = baseZ * scale
      }
      ld.posAttr.needsUpdate = true
    }

    renderer.render(scene, camera)
  }

  function dispose() {
    isDisposed = true
    for (const ld of lineDatas) ld.geom.dispose()
    lineMaterial.dispose()
    renderer.dispose()
  }

  function setMouse(_x: number, y: number) {
    // Demo solo usa mouse.y. Ignoramos x.
    mouseTargetY = y
  }

  return { canvas, render, dispose, setMouse }
}
