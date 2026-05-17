import * as THREE from "three"
import type { AnimationFactoryOptions, AnimationHandle } from "./galaxy"
import { simplex3 } from "./noise"

export function createHeuristics(
  width: number,
  height: number,
  _opts?: AnimationFactoryOptions,
): AnimationHandle {
  // demo5 no tenía mouse — el flag interactive se ignora.
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height, false)
  renderer.setClearColor(0x0f1617, 1)

  const scene = new THREE.Scene()
  // FOV 45, z=100 — cámara muy cerca. El cubo de 49u ocupa la mayor parte
  // del encuadre.
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 0, 100)

  // BoxGeometry(49, 49, 49, 7, 7, 7) — cubo con 7×7 subdivisiones por cara.
  // En Three r183 esto retorna BufferGeometry indexado, con groups por cara.
  // Reescribimos completamente el index y los groups según el patrón checker
  // del demo (que asigna materialIndex per-face en old Geometry).
  const geometry = new THREE.BoxGeometry(49, 49, 49, 7, 7, 7)
  const positions = geometry.attributes.position.array as Float32Array
  const oldIndex = geometry.index!.array
  const triangleCount = oldIndex.length / 3

  // Particionamos los triángulos en dos buckets siguiendo la lógica del demo:
  //   face.materialIndex = floor(center.y + 25) % 14 < 7 ? 0 : 1
  //   if (center.y === 24.5) face.materialIndex = 0
  //   if (face.materialIndex === 0) {
  //     face.materialIndex = floor(center.x + 25) % 14 < 7 ? 0 : 1
  //     if (center.x === 24.5) face.materialIndex = 0
  //   }
  // En el demo, material 0 = invisible (opacity 0) y material 1 = wireframe.
  const visibleIdx: number[] = []
  const hiddenIdx: number[] = []
  for (let t = 0; t < triangleCount; t += 1) {
    const i0 = oldIndex[t * 3]
    const i1 = oldIndex[t * 3 + 1]
    const i2 = oldIndex[t * 3 + 2]
    const cx = (positions[i0 * 3] + positions[i1 * 3] + positions[i2 * 3]) / 3
    const cy = (positions[i0 * 3 + 1] + positions[i1 * 3 + 1] + positions[i2 * 3 + 1]) / 3

    let materialIndex = Math.floor(cy + 25) % 14 < 7 ? 0 : 1
    if (cy === 24.5) materialIndex = 0
    if (materialIndex === 0) {
      materialIndex = Math.floor(cx + 25) % 14 < 7 ? 0 : 1
      if (cx === 24.5) materialIndex = 0
    }

    if (materialIndex === 1) {
      visibleIdx.push(i0, i1, i2)
    } else {
      hiddenIdx.push(i0, i1, i2)
    }
  }

  // Nuevo index: visibles primero, ocultos después. Dos groups apuntando a
  // los materiales correspondientes (orden array material: [hidden, visible]
  // igual que en el demo).
  const newIndices = new Uint16Array(visibleIdx.length + hiddenIdx.length)
  newIndices.set(visibleIdx, 0)
  newIndices.set(hiddenIdx, visibleIdx.length)
  geometry.setIndex(new THREE.BufferAttribute(newIndices, 1))
  geometry.clearGroups()
  geometry.addGroup(0, visibleIdx.length, 1) // material 1 (wireframe teal)
  geometry.addGroup(visibleIdx.length, hiddenIdx.length, 0) // material 0 (hidden)

  // Posiciones originales: _o del demo. Guardamos una copia inmutable para
  // recalcular cada frame.
  const basePositions = new Float32Array(positions)
  const positionAttr = geometry.attributes.position as THREE.BufferAttribute
  positionAttr.usage = THREE.DynamicDrawUsage
  const vertexCount = basePositions.length / 3

  const materials = [
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x13756a,
      side: THREE.DoubleSide,
      wireframe: true,
    }),
  ]
  const cube = new THREE.Mesh(geometry, materials)
  scene.add(cube)

  // El demo usa TweenMax para rotar 2π en X e Y a lo largo de 80 segundos
  // (linear, infinito). Equivale a velocidad angular = 2π/80 rad/s en ambos.
  const angularSpeed = (Math.PI * 2) / 80

  let isDisposed = false

  function render(time: number) {
    if (isDisposed) return
    const t = time * 0.001

    cube.rotation.x = t * angularSpeed
    cube.rotation.y = t * angularSpeed

    const pos = positionAttr.array as Float32Array
    for (let i = 0; i < vertexCount; i += 1) {
      const ix = i * 3
      const ox = basePositions[ix]
      const oy = basePositions[ix + 1]
      const oz = basePositions[ix + 2]
      // Fórmula EXACTA del demo:
      //   ratio = simplex3(_o.x*0.01, _o.y*0.01 + a*0.0005, _o.z*0.01)
      //   vector.copy(_o); vector.multiplyScalar(1 + ratio*0.1)
      const ratio = simplex3(
        ox * 0.01,
        oy * 0.01 + time * 0.0005,
        oz * 0.01,
      )
      const scale = 1 + ratio * 0.1
      pos[ix] = ox * scale
      pos[ix + 1] = oy * scale
      pos[ix + 2] = oz * scale
    }
    positionAttr.needsUpdate = true

    renderer.render(scene, camera)
  }

  function dispose() {
    isDisposed = true
    geometry.dispose()
    for (const m of materials) m.dispose()
    renderer.dispose()
  }

  return { canvas, render, dispose }
}
