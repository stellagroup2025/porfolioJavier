import * as THREE from "three"
import { galleryPlaneData } from "./galleryData"
import { animationRegistry } from "./animations"

function createTextTexture(title, bgColor, textColor) {
  const canvas = document.createElement("canvas")
  const size = 1024
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  const text = (title || "").toUpperCase()
  let fontSize = 220
  ctx.font = `900 ${fontSize}px "Playfair Display", Georgia, serif`
  while (ctx.measureText(text).width > size * 0.86 && fontSize > 60) {
    fontSize -= 10
    ctx.font = `900 ${fontSize}px "Playfair Display", Georgia, serif`
  }

  ctx.fillStyle = textColor
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, size / 2, size / 2)

  ctx.strokeStyle = textColor
  ctx.globalAlpha = 0.35
  ctx.lineWidth = 2
  ctx.strokeRect(size * 0.06, size * 0.06, size * 0.88, size * 0.88)
  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

class Gallery {
  constructor() {
    this.isInitialized = false

    this.planes = []
    this.texturesBySource = new Map()
    this.useTextures = true
    this.planeGap = 5
    this.desktopPlaneScale = 1
    this.mobilePlaneScale = 0.65
    this.mobileXSpreadFactor = 0.25
    this.mobileBreakpoint = 768
    this.planeConfig = galleryPlaneData
    this.moodSampleOffset = 1
    this.planeFadeSampleOffset = 1
    this.planeFadeSmoothing = 0.14

    this.parallaxEnabled = true
    this.parallaxAmountX = 0.16
    this.parallaxAmountY = 0.08
    this.parallaxSmoothing = 0.08
    this.pointerTarget = new THREE.Vector2(0, 0)
    this.pointerCurrent = new THREE.Vector2(0, 0)

    this.breathEnabled = true
    this.breathTiltAmount = 0.045
    this.breathScaleAmount = 0.03
    this.breathSmoothing = 0.14
    this.breathGain = 1.1
    this.breathIntensity = 0
    this.targetBreathIntensity = 0

    this.gestureParallaxEnabled = true
    this.gestureParallaxAmountY = 0.05
    this.gestureParallaxSmoothing = 0.05
    this.driftCurrent = 0
    this.driftTarget = 0

    this.onPointerMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      this.pointerTarget.set(x, -y)
    }
    this.onPointerLeave = () => {
      this.pointerTarget.set(0, 0)
    }
  }

  async init(scene) {
    if (this.isInitialized) return

    this.setPlanes(scene)
    this.updatePlaneMaterialMode()
    this.updatePlaneScale()
    this.layoutPlanes()
    this.bindPointerEvents()

    this.isInitialized = true
  }

  setPlanes(scene) {
    const planeGeometry = new THREE.PlaneGeometry(3, 3)

    this.planeConfig.forEach((plane, index) => {
      // Si la card tiene una animación registrada, la inyectamos como textura dinámica.
      const animationFactory = plane.animationId
        ? animationRegistry[plane.animationId]
        : null
      let texture
      let animationHandle = null
      if (animationFactory) {
        animationHandle = animationFactory(1024, 1024)
        texture = new THREE.CanvasTexture(animationHandle.canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
      } else {
        texture = createTextTexture(
          plane.title || plane.label?.word || `tone ${index + 1}`,
          plane.textBgColor || plane.fallbackColor || "#ffffff",
          plane.textColor || "#1a1a1a"
        )
      }
      const aspectRatio = 1
      const fallbackColor = plane.fallbackColor || "#ffffff"
      const accentColor = plane.accentColor || fallbackColor
      const backgroundColor = plane.backgroundColor || fallbackColor
      const blob1Color = plane.blob1Color || fallbackColor
      const blob2Color = plane.blob2Color || fallbackColor
      const labelData = this.getPlaneLabelData(plane, this.planes.length)
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: fallbackColor,
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        opacity: index === 0 ? 1 : 0,
      })
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
      planeMesh.userData.basePosition = plane.position
      planeMesh.userData.baseColor = fallbackColor
      planeMesh.userData.accentColor = accentColor
      planeMesh.userData.backgroundColor = backgroundColor
      planeMesh.userData.blob1Color = blob1Color
      planeMesh.userData.blob2Color = blob2Color
      planeMesh.userData.label = labelData
      planeMesh.userData.texture = texture
      planeMesh.userData.aspectRatio = aspectRatio
      planeMesh.userData.animationHandle = animationHandle
      scene.add(planeMesh)
      this.planes.push(planeMesh)
    })
  }

  /**
   * Llamar cada frame para tick a las animaciones dinámicas (canvas textures).
   */
  tickAnimations(time) {
    for (let i = 0; i < this.planes.length; i += 1) {
      const plane = this.planes[i]
      const handle = plane.userData.animationHandle
      if (!handle) continue
      // Solo renderiza si el plano tiene visibilidad apreciable, para ahorrar GPU.
      const opacity = plane.material.opacity || 0
      if (opacity < 0.02) continue
      handle.render(time)
      plane.userData.texture.needsUpdate = true
    }
  }

  getPlaneLabelData(planeDefinition, index) {
    const fallback = {
      word: `tone ${String(index + 1).padStart(2, "0")}`,
      pms: "N/A",
      color: "",
    }
    const label = planeDefinition.label || fallback

    return {
      word: label.word || fallback.word,
      pms: label.pms || fallback.pms,
      color: label.color || fallback.color,
    }
  }

  updatePlaneScale() {
    const isMobileViewport = window.innerWidth <= this.mobileBreakpoint
    const scale = isMobileViewport ? this.mobilePlaneScale : this.desktopPlaneScale

    this.planes.forEach((plane) => {
      const aspectRatio = plane.userData.aspectRatio || 1
      plane.scale.set(scale * aspectRatio, scale, 1)
    })
  }

  layoutPlanes() {
    const xSpreadFactor = this.getXSpreadFactor()

    this.planes.forEach((plane, index) => {
      const basePosition = plane.userData.basePosition || { x: 0, y: 0 }
      const xPosition = basePosition.x * xSpreadFactor
      plane.position.set(xPosition, basePosition.y, -index * this.planeGap)
    })
  }

  getXSpreadFactor() {
    const isMobileViewport = window.innerWidth <= this.mobileBreakpoint
    return isMobileViewport ? this.mobileXSpreadFactor : 1
  }

  getDepthRange() {
    if (!this.planes.length) {
      return { nearestZ: 0, deepestZ: 0 }
    }

    const zPositions = this.planes.map((plane) => plane.position.z)
    return {
      nearestZ: Math.max(...zPositions),
      deepestZ: Math.min(...zPositions),
    }
  }

  getDepthProgress(cameraZ) {
    const { nearestZ, deepestZ } = this.getDepthRange()
    const depthSpan = nearestZ - deepestZ
    if (depthSpan <= 0) return 0

    return THREE.MathUtils.clamp((nearestZ - cameraZ) / depthSpan, 0, 1)
  }

  getActivePlaneIndex(cameraZ) {
    if (!this.planes.length) return -1

    let closestPlaneIndex = 0
    let smallestDistance = Infinity

    this.planes.forEach((plane, index) => {
      const distanceToPlane = Math.abs(cameraZ - plane.position.z)
      if (distanceToPlane < smallestDistance) {
        smallestDistance = distanceToPlane
        closestPlaneIndex = index
      }
    })

    return closestPlaneIndex
  }

  getMoodColorsByIndex(index) {
    if (index < 0 || index >= this.planes.length) return null

    const { backgroundColor, blob1Color, blob2Color } = this.planes[index].userData
    if (!backgroundColor) return null

    return { background: backgroundColor, blob1: blob1Color, blob2: blob2Color }
  }

  getMoodBlendData(cameraZ) {
    if (!this.planes.length) return null

    const safeCameraZ = Number.isFinite(cameraZ) ? cameraZ : this.planes[0].position.z
    const moodSampleZ = safeCameraZ - this.planeGap * this.moodSampleOffset
    const lastPlaneIndex = this.planes.length - 1

    if (lastPlaneIndex === 0 || this.planeGap <= 0) {
      const singleMood = this.getMoodColorsByIndex(0)
      if (!singleMood) return null

      return {
        currentMood: singleMood,
        nextMood: singleMood,
        blend: 0,
      }
    }

    const firstPlaneZ = this.planes[0].position.z
    const normalizedDepth = THREE.MathUtils.clamp(
      (firstPlaneZ - moodSampleZ) / this.planeGap,
      0,
      lastPlaneIndex
    )
    const currentPlaneIndex = Math.floor(normalizedDepth)
    const nextPlaneIndex = Math.min(currentPlaneIndex + 1, lastPlaneIndex)
    const blend = normalizedDepth - currentPlaneIndex

    const currentMood = this.getMoodColorsByIndex(currentPlaneIndex)
    const nextMood = this.getMoodColorsByIndex(nextPlaneIndex) || currentMood
    if (!currentMood || !nextMood) return null

    return {
      currentMood,
      nextMood,
      blend,
    }
  }

  getPlaneBlendData(cameraZ) {
    if (!this.planes.length) return null

    const planeGap = Math.max(this.planeGap, 0.0001)
    const firstPlaneZ = this.planes[0].position.z
    const lastPlaneIndex = this.planes.length - 1
    const sampledCameraZ = cameraZ - planeGap * this.planeFadeSampleOffset
    const normalizedDepth = THREE.MathUtils.clamp(
      (firstPlaneZ - sampledCameraZ) / planeGap,
      0,
      lastPlaneIndex
    )
    const currentPlaneIndex = Math.floor(normalizedDepth)
    const nextPlaneIndex = Math.min(currentPlaneIndex + 1, lastPlaneIndex)
    const blend = normalizedDepth - currentPlaneIndex

    return {
      currentPlaneIndex,
      nextPlaneIndex,
      blend,
    }
  }

  getActiveMoodColors(cameraZ) {
    const moodBlendData = this.getMoodBlendData(cameraZ)
    return moodBlendData?.currentMood || null
  }

  getTextureSources() {
    return []
  }

  setPreloadedTextures(texturesBySource) {
    this.texturesBySource = texturesBySource instanceof Map ? texturesBySource : new Map()
  }

  getPlaneIdByIndex(index) {
    return this.planeConfig[index]?.id || null
  }

  /**
   * Devuelve el bounding box (en pixels del viewport) del plano dado proyectado
   * por la cámara. Útil para superponer elementos HTML que deben coincidir con la card.
   */
  getPlaneScreenRect(index, camera, viewportWidth, viewportHeight) {
    const plane = this.planes[index]
    if (!plane) return null
    plane.updateMatrixWorld()
    // 4 esquinas del PlaneGeometry(3,3) en local space.
    const corners = [
      new THREE.Vector3(-1.5, 1.5, 0),
      new THREE.Vector3(1.5, 1.5, 0),
      new THREE.Vector3(1.5, -1.5, 0),
      new THREE.Vector3(-1.5, -1.5, 0),
    ]
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    for (const corner of corners) {
      corner.applyMatrix4(plane.matrixWorld).project(camera)
      const sx = ((corner.x + 1) / 2) * viewportWidth
      const sy = ((1 - corner.y) / 2) * viewportHeight
      if (sx < minX) minX = sx
      if (sy < minY) minY = sy
      if (sx > maxX) maxX = sx
      if (sy > maxY) maxY = sy
    }
    return {
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  updatePlaneMaterialMode() {
    this.planes.forEach((plane) => {
      const planeMaterial = plane.material
      const texture = plane.userData.texture || null
      const hasTexture = Boolean(texture)

      planeMaterial.map = this.useTextures && hasTexture ? texture : null
      planeMaterial.color.set(this.useTextures && hasTexture ? "#ffffff" : plane.userData.baseColor)
      planeMaterial.needsUpdate = true
    })
  }

  updatePlaneVisibility(cameraZ) {
    const blendData = this.getPlaneBlendData(cameraZ)
    if (!blendData) return

    const { currentPlaneIndex, nextPlaneIndex, blend } = blendData

    this.planes.forEach((plane, index) => {
      let targetOpacity = 0

      if (index === currentPlaneIndex) {
        targetOpacity = 1 - blend
      }
      if (index === nextPlaneIndex) {
        targetOpacity = Math.max(targetOpacity, blend)
      }

      const currentOpacity = Number.isFinite(plane.material.opacity) ? plane.material.opacity : 0
      plane.material.opacity = THREE.MathUtils.lerp(
        currentOpacity,
        targetOpacity,
        this.planeFadeSmoothing
      )
      plane.material.needsUpdate = true
    })
  }

  bindPointerEvents() {
    window.addEventListener("pointermove", this.onPointerMove, { passive: true })
    window.addEventListener("pointerleave", this.onPointerLeave, { passive: true })
  }

  updatePlaneMotion(scroll = null) {
    this.pointerCurrent.lerp(this.pointerTarget, this.parallaxSmoothing)

    const velocityMax = Math.max(scroll?.velocityMax || 1, 0.0001)
    const velocityNormalized = THREE.MathUtils.clamp(
      Math.abs(scroll?.velocity || 0) / velocityMax,
      0,
      1
    )
    const scrollDrift = THREE.MathUtils.clamp((scroll?.velocity || 0) / velocityMax, -1, 1)
    this.targetBreathIntensity = this.breathEnabled
      ? THREE.MathUtils.clamp(velocityNormalized * this.breathGain, 0, 1)
      : 0
    this.breathIntensity = THREE.MathUtils.lerp(
      this.breathIntensity,
      this.targetBreathIntensity,
      this.breathSmoothing
    )
    this.driftTarget = this.gestureParallaxEnabled ? scrollDrift : 0
    this.driftCurrent = THREE.MathUtils.lerp(
      this.driftCurrent,
      this.driftTarget,
      this.gestureParallaxSmoothing
    )

    const xSpreadFactor = this.getXSpreadFactor()

    this.planes.forEach((plane, index) => {
      const basePosition = plane.userData.basePosition || { x: 0, y: 0 }
      const xPosition = basePosition.x * xSpreadFactor
      const yPosition = basePosition.y
      const zPosition = -index * this.planeGap
      const opacity = Number.isFinite(plane.material.opacity) ? plane.material.opacity : 0
      const depthInfluence = 1 + index * 0.05
      const parallaxInfluence = this.parallaxEnabled ? opacity * depthInfluence : 0

      const parallaxOffsetX = this.pointerCurrent.x * this.parallaxAmountX * parallaxInfluence
      const parallaxOffsetY = this.pointerCurrent.y * this.parallaxAmountY * parallaxInfluence
      const gestureOffsetY = this.driftCurrent * this.gestureParallaxAmountY

      plane.position.x = xPosition + parallaxOffsetX
      plane.position.y = yPosition + parallaxOffsetY + gestureOffsetY
      plane.position.z = zPosition

      const breathInfluence = this.breathEnabled ? this.breathIntensity * opacity : 0
      const tiltX = -this.pointerCurrent.y * this.breathTiltAmount * breathInfluence
      const tiltY = this.pointerCurrent.x * this.breathTiltAmount * breathInfluence
      plane.rotation.x = tiltX
      plane.rotation.y = tiltY
      plane.rotation.z = 0

      const aspectRatio = plane.userData.aspectRatio || 1
      const baseScale =
        window.innerWidth <= this.mobileBreakpoint ? this.mobilePlaneScale : this.desktopPlaneScale
      const scalePulse = 1 + this.breathScaleAmount * breathInfluence
      plane.scale.x = baseScale * aspectRatio * scalePulse
      plane.scale.y = baseScale * scalePulse
      plane.scale.z = 1
    })
  }

  update(camera = null, scroll = null) {
    if (!camera) return
    this.updatePlaneVisibility(camera.position.z)
    this.updatePlaneMotion(scroll)
  }

  dispose() {
    window.removeEventListener("pointermove", this.onPointerMove)
    window.removeEventListener("pointerleave", this.onPointerLeave)

    this.planes.forEach((plane) => {
      plane.userData.animationHandle?.dispose()
      plane.userData.texture?.dispose()
      plane.material.dispose()
      plane.geometry?.dispose()
    })
    this.planes = []
  }
}

export { Gallery }
