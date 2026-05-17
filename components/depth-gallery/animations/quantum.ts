import * as THREE from "three"
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import type { AnimationFactoryOptions, AnimationHandle } from "./galaxy"
import { simplex3 } from "./noise"

export function createQuantum(
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
  renderer.setClearColor(0xa9e7da, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
  camera.position.set(0, 0, 320)

  // Paleta de luces inspirada en la referencia del usuario: azul-lavanda
  // arriba (cielo), melocotón cálido en frente (sol bajo), teal-aqua desde
  // abajo (rebote del suelo de la card). El emisivo se elimina del material;
  // queremos que sea la luz la que pinte el blob.
  scene.add(new THREE.HemisphereLight(0xcbd8ff, 0x84e3cc, 1.0))

  // Sol frontal cálido: pinta los medios tonos en peach/rosa.
  const dirWarm = new THREE.DirectionalLight(0xffd4b8, 0.85)
  dirWarm.position.set(0, 180, 320)
  scene.add(dirWarm)

  // Luz lateral fría azul-lavanda: tinta el lado y rim superiores.
  const dirCool = new THREE.DirectionalLight(0xa9b6ff, 0.55)
  dirCool.position.set(-260, 200, 180)
  scene.add(dirCool)

  // Rim inferior teal: clava el verde-aqua de la base como en la referencia.
  const dirRim = new THREE.DirectionalLight(0x55ddc4, 0.55)
  dirRim.position.set(0, -260, 220)
  scene.add(dirRim)

  // detail 6 → tras merge ~40962 vértices únicos / ~81920 triángulos. A
  // resolución 1024px la silueta queda sub-píxel; lo que la hace ver fluida
  // ya no es la densidad sino las frecuencias del ruido y el recálculo de
  // normales cada frame. Detail 7 cuadruplicaría el coste sin ganancia
  // visible.
  const rawGeom = new THREE.IcosahedronGeometry(120, 6)
  const geometry = mergeVertices(rawGeom)
  rawGeom.dispose()
  const positionAttr = geometry.attributes.position as THREE.BufferAttribute
  positionAttr.usage = THREE.DynamicDrawUsage
  const basePositions = new Float32Array(positionAttr.array)
  const vertexCount = basePositions.length / 3

  const material = new THREE.MeshPhongMaterial({
    // Diffuse blanco-azul muy ligero: dejamos que las luces tinten la
    // superficie. Sin emisivo (el verde dominaba todo).
    color: 0xf2f5ff,
    shininess: 14,
    specular: new THREE.Color(0x303848),
  })
  const shape = new THREE.Mesh(geometry, material)
  scene.add(shape)

  let isDisposed = false

  // Estado de mouse en modo interactive. setMouse actualiza target, la
  // mY que entra en la fórmula del ratio es la lerpeada per-frame, imitando
  // el TweenMax(0.8s, Power1.easeOut) del demo3.
  let mouseTargetY = 0.5
  let mouseSmoothY = 0.5

  function render(time: number) {
    if (isDisposed) return
    const t = time * 0.001
    // mY: en modo card es sinusoidal procedural; en modo modal viene del
    // cursor del usuario (lerpeado).
    let mY: number
    if (interactive) {
      const k = 0.06 // ~0.8s para alcanzar 95% — matches demo3 TweenMax
      mouseSmoothY += (mouseTargetY - mouseSmoothY) * k
      mY = mouseSmoothY
    } else {
      mY = 0.5 + Math.sin(t * 0.5) * 0.5
    }

    // Rotación procedural muy lenta para que el blob "navegue" en su sitio
    // y se aprecie la fluidez de la silueta sin distracciones de spin.
    shape.rotation.y = t * 0.05
    shape.rotation.x = Math.sin(t * 0.09) * 0.14
    shape.rotation.z = Math.cos(t * 0.07) * 0.06

    const pos = positionAttr.array as Float32Array
    for (let i = 0; i < vertexCount; i += 1) {
      const ix = i * 3
      const bx = basePositions[ix]
      const by = basePositions[ix + 1]
      const bz = basePositions[ix + 2]
      // Frecuencia espacial baja (0.0035): la onda de ruido tiene una longitud
      // de ~1.8x el radio de la esfera. Eso da 1-2 ondulaciones grandes a lo
      // largo del blob en vez de la docena de bumps pequeños que se producen
      // con frecuencia alta. Tiempos lentos (0.10/0.15) para que la silueta
      // mute con suavidad de fluido en vez de bullir.
      const p = simplex3(
        bx * 0.0035 + t * 0.10,
        by * 0.0035 + t * 0.15,
        bz * 0.0035,
      )
      // Segunda octava muy sutil: frecuencia 3x y amplitud 0.25x. Suma una
      // micro-variación tipo "respiración de jabón" sin romper la continuidad
      // visual.
      const p2 = simplex3(
        bx * 0.011 - t * 0.07,
        by * 0.011 - t * 0.05,
        bz * 0.011 + t * 0.04,
      )
      const noise = p + p2 * 0.25
      const ratio = noise * 0.22 * (mY + 0.4) + 0.95
      pos[ix] = bx * ratio
      pos[ix + 1] = by * ratio
      pos[ix + 2] = bz * ratio
    }
    positionAttr.needsUpdate = true
    // Recalculamos normales cada frame: imprescindible para que la luz siga
    // la superficie deformada. Sin esto la iluminación queda "pegada" a la
    // esfera original y las aristas triangulares aparecen donde el shading
    // interpola normales que ya no corresponden a la geometría real.
    geometry.computeVertexNormals()

    renderer.render(scene, camera)
  }

  function dispose() {
    isDisposed = true
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }

  function setMouse(_x: number, y: number) {
    // El demo solo usa mouse.y para modular amplitud. Ignoramos x.
    mouseTargetY = y
  }

  return { canvas, render, dispose, setMouse }
}
