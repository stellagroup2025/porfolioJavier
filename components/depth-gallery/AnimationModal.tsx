"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { animationRegistry, type AnimationHandle } from "./animations"
import { galleryPlaneData } from "./galleryData"

type Props = {
  planeId: string | null
  onClose: () => void
}

export function AnimationModal({ planeId, onClose }: Props) {
  const { t } = useTranslation()
  const stageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!planeId) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [planeId, onClose])

  // Montaje / desmontaje del canvas WebGL en interactive=true cuando se abre
  // el modal sobre una card que tiene animationId.
  useEffect(() => {
    if (!planeId) return
    const stage = stageRef.current
    if (!stage) return

    const planeData = galleryPlaneData.find((p) => p.id === planeId)
    const animationId = planeData?.animationId
    if (!animationId) return // fade/path o cualquier card sin animación WebGL

    const factory = animationRegistry[animationId]
    if (!factory) return

    // Tamaño del stage en CSS px. El factory aplica setPixelRatio internamente,
    // así que NO multiplicamos nosotros por DPR (sería doble escalado).
    // Pero garantizamos un buffer mínimo de 1024 en la dimensión menor para
    // igualar la resolución que tiene la card en la gallery: si el stage es
    // pequeño, escalamos las dims que pasamos al factory manteniendo aspect.
    // Sin esto los puntos/líneas se ven más gruesos relativos al canvas.
    const rect = stage.getBoundingClientRect()
    const cssW = Math.max(1, Math.floor(rect.width))
    const cssH = Math.max(1, Math.floor(rect.height))
    const minStageDim = Math.min(cssW, cssH)
    const upscale = Math.max(1, 1024 / minStageDim)
    const bufW = Math.round(cssW * upscale)
    const bufH = Math.round(cssH * upscale)
    const handle: AnimationHandle = factory(bufW, bufH, {
      interactive: true,
    })

    // Canvas: pintamos en buffer de cssW*dpr × cssH*dpr y lo escalamos a
    // cssW × cssH vía CSS.
    handle.canvas.style.width = `${cssW}px`
    handle.canvas.style.height = `${cssH}px`
    handle.canvas.style.display = "block"
    handle.canvas.style.maxWidth = "100%"
    handle.canvas.style.maxHeight = "100%"
    stage.appendChild(handle.canvas)

    // Mouse → (x, y) normalizados [0, 1] relativos al canvas.
    const onPointerMove = (event: PointerEvent) => {
      if (!handle.setMouse) return
      const r = handle.canvas.getBoundingClientRect()
      const x = (event.clientX - r.left) / r.width
      const y = (event.clientY - r.top) / r.height
      handle.setMouse(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)))
    }
    handle.canvas.addEventListener("pointermove", onPointerMove)
    // Importante: NO inicializamos setMouse aquí — cada animación se encarga
    // de su propio default sensato (p.ej. icosphere arranca con un tilt para
    // no mostrar el patrón geodésico simétrico).

    let raf = 0
    let cancelled = false
    const loop = (time: number) => {
      if (cancelled) return
      handle.render(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      handle.canvas.removeEventListener("pointermove", onPointerMove)
      if (handle.canvas.parentElement === stage) {
        stage.removeChild(handle.canvas)
      }
      handle.dispose()
    }
  }, [planeId])

  const planeData = planeId ? galleryPlaneData.find((p) => p.id === planeId) : null
  const hasAnimation = !!planeData?.animationId

  return (
    <AnimatePresence>
      {planeId && (
        <motion.div
          className="dg-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="dg-modal"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t("animaciones.modal.close")}
              className="dg-modal__close"
            >
              <X size={18} />
            </button>
            <div
              ref={stageRef}
              className="dg-modal__stage"
              style={
                hasAnimation
                  ? {
                      // Cuando hay animación WebGL, dejamos que el canvas pinte
                      // el fondo (cada demo trae su clearColor). Quitamos el
                      // gradiente decorativo del stage para no enmascararlo.
                      background: "transparent",
                      padding: 0,
                      overflow: "hidden",
                    }
                  : undefined
              }
            />
            <div className="dg-modal__body">
              <p className="dg-modal__eyebrow">
                {t("animaciones.modal.demoLabel")} · {planeId}
              </p>
              <h2 className="dg-modal__title">{t(`animaciones.modal.${planeId}.title`)}</h2>
              <p className="dg-modal__description">
                {t(`animaciones.modal.${planeId}.description`)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
