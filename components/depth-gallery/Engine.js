import * as THREE from "three"
import { Experience } from "./Experience"
import { Scroll } from "./Scroll"

class Engine {
  constructor(canvas, container, options = {}) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Engine requires a valid canvas element")
    }

    this.canvas = canvas
    this.container = container || canvas.parentElement || document.body
    this.onPlaneClick = typeof options.onPlaneClick === "function" ? options.onPlaneClick : null
    this.onPlaneFocusChange =
      typeof options.onPlaneFocusChange === "function" ? options.onPlaneFocusChange : null
    this._lastFocusedPlaneIndex = -1
    // Overlay HTML que debe seguir al plano en foco (lo asigna React).
    this._overlayElement = null
    this._overlayPlaneIndex = -1
    this.experience = new Experience(this.container)
    this.isInitialized = false
    this.isRunning = false
    this.animationFrameRequestId = null
    this.preloadedTextures = new Map()
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.set(0, 0, 6)

    this.scroll = new Scroll(this.camera, this.experience.gallery, this.canvas)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.autoClear = false

    this.pointerDownPosition = null
    this.pointerDownTime = 0
    this.clickMoveThresholdPx = 6
    this.clickTimeThresholdMs = 400

    this.onResize = () => {
      this.resize()
    }
    this.onPointerDown = (event) => {
      this.pointerDownPosition = { x: event.clientX, y: event.clientY }
      this.pointerDownTime = performance.now()
    }
    this.onPointerUp = (event) => {
      if (!this.pointerDownPosition) return
      const dx = event.clientX - this.pointerDownPosition.x
      const dy = event.clientY - this.pointerDownPosition.y
      const distance = Math.hypot(dx, dy)
      const elapsedMs = performance.now() - this.pointerDownTime
      this.pointerDownPosition = null

      if (distance > this.clickMoveThresholdPx) return
      if (elapsedMs > this.clickTimeThresholdMs) return

      const blendData = this.experience.gallery.getPlaneBlendData(this.camera.position.z)
      if (!blendData) return
      const focusedPlaneIndex =
        blendData.blend >= 0.5 ? blendData.nextPlaneIndex : blendData.currentPlaneIndex
      const planeId = this.experience.gallery.getPlaneIdByIndex(focusedPlaneIndex)
      if (!planeId) return

      this.onPlaneClick?.(planeId, focusedPlaneIndex)
    }

    this.animate = this.update.bind(this)
  }

  async init() {
    if (this.isInitialized) return

    await this.experience.init(this.scene, this.camera)
    this.scroll.init()

    this.resize()
    window.addEventListener("resize", this.onResize)
    this.canvas.addEventListener("pointerdown", this.onPointerDown)
    this.canvas.addEventListener("pointerup", this.onPointerUp)
    this.scroll.bindEvents()

    this.isInitialized = true
    this.start()
  }

  start() {
    if (!this.isInitialized || this.isRunning) return

    this.isRunning = true
    this.update()
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth || 1
    const height = this.canvas.clientHeight || window.innerHeight || 1
    if (width <= 0 || height <= 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.experience.gallery.updatePlaneScale()
    this.experience.gallery.layoutPlanes()
    this.experience.label.resize(width, height)
  }

  async preloadTextures() {
    const textureSources = this.experience.gallery.getTextureSources()
    if (!textureSources.length) return new Map()

    const textureLoader = new THREE.TextureLoader()
    const loadedTextures = new Map()

    await Promise.all(
      textureSources.map(async (textureSource) => {
        try {
          const texture = await textureLoader.loadAsync(textureSource)
          texture.colorSpace = THREE.SRGBColorSpace
          loadedTextures.set(textureSource, texture)
        } catch (error) {
          console.warn(`Texture failed to load: ${textureSource}`, error)
        }
      })
    )

    return loadedTextures
  }

  update() {
    if (!this.isRunning) return

    this.animationFrameRequestId = requestAnimationFrame(this.animate)

    const time = performance.now()

    this.scroll.update()
    this.experience.update(time, this.camera, this.scroll)
    // Tick a las animaciones dinámicas inyectadas como textura de los planos.
    this.experience.gallery.tickAnimations(time)

    // Notificar al React qué plano está en foco para sincronizar overlays externos.
    const blend = this.experience.gallery.getPlaneBlendData(this.camera.position.z)
    if (blend) {
      const focusedIndex = blend.blend >= 0.5 ? blend.nextPlaneIndex : blend.currentPlaneIndex
      if (focusedIndex !== this._lastFocusedPlaneIndex) {
        this._lastFocusedPlaneIndex = focusedIndex
        if (this.onPlaneFocusChange) {
          const planeId = this.experience.gallery.getPlaneIdByIndex(focusedIndex)
          this.onPlaneFocusChange(planeId, focusedIndex)
        }
      }
    }

    // Posicionar el overlay HTML para que coincida con el plano objetivo.
    if (this._overlayElement && this._overlayPlaneIndex >= 0) {
      const rect = this.experience.gallery.getPlaneScreenRect(
        this._overlayPlaneIndex,
        this.camera,
        this.canvas.clientWidth,
        this.canvas.clientHeight
      )
      if (rect) {
        const style = this._overlayElement.style
        style.left = `${rect.left}px`
        style.top = `${rect.top}px`
        style.width = `${rect.width}px`
        style.height = `${rect.height}px`
        // El plano del depth gallery tiene la misma opacity que su material
        const plane = this.experience.gallery.planes[this._overlayPlaneIndex]
        const opacity = plane?.material?.opacity ?? 0
        style.opacity = String(opacity)
      }
    }

    this.renderer.clear(true, true, true)
    this.experience.background.render(this.renderer)
    this.renderer.clearDepth()
    this.renderer.render(this.scene, this.camera)
    this.experience.label.render()
  }

  /**
   * Asigna un elemento HTML que el Engine ajustará en cada frame para que
   * coincida con el rect en pantalla del plano cuyo id se pasa.
   */
  setTrackingOverlay(element, planeId) {
    this._overlayElement = element ?? null
    if (!element || !planeId) {
      this._overlayPlaneIndex = -1
      return
    }
    const idx = this.experience.gallery.planeConfig.findIndex((p) => p.id === planeId)
    this._overlayPlaneIndex = idx
  }

  /**
   * Pausa el render loop de las animaciones inyectadas como textura. Cuando
   * el modal está abierto y tiene su propio render, esto evita renderizar dos
   * veces lo mismo y libera GPU.
   */
  setAnimationsPaused(paused) {
    this.experience.gallery.setAnimationsPaused(paused)
  }

  dispose() {
    this.isRunning = false

    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId)
      this.animationFrameRequestId = null
    }

    window.removeEventListener("resize", this.onResize)
    this.canvas.removeEventListener("pointerdown", this.onPointerDown)
    this.canvas.removeEventListener("pointerup", this.onPointerUp)
    this.scroll.dispose()

    this.experience.dispose?.()
    this.renderer.dispose()
  }
}

export { Engine }
