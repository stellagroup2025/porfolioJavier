"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { SectionLink } from "@/components/section-link"
import { useTransition } from "@/components/page-transition/TransitionProvider"
import { useTranslation } from "@/lib/i18n"
import { AnimationModal } from "./AnimationModal"
import { galleryPlaneData } from "./galleryData"
import "./depth-gallery.css"

// Engine expone setAnimationsPaused — lo tipamos local para no importar el
// .js entero como type.
type EngineInstance = {
  dispose: () => void
  setAnimationsPaused: (paused: boolean) => void
}

export function DepthGallery() {
  const router = useRouter()
  const { withTransition } = useTransition()
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const engineRef = useRef<EngineInstance | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [activePlaneId, setActivePlaneId] = useState<string | null>(null)
  const [focusedPlaneId, setFocusedPlaneId] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let isCancelled = false

    import("./Engine").then(({ Engine }) => {
      if (isCancelled || !canvas) return
      const engine = new Engine(canvas, container, {
        onPlaneClick: (planeId: string) => {
          // Solo cards con animationId tienen modal — las de intro/outro
          // (scroll, scroll back) no son demos, ignoramos el click.
          const planeData = galleryPlaneData.find((p) => p.id === planeId)
          if (!planeData?.animationId) return
          setActivePlaneId(planeId)
        },
        onPlaneFocusChange: (planeId: string | null) => {
          setFocusedPlaneId(planeId)
        },
      })
      engineRef.current = engine
      engine
        .init()
        .then(() => {
          if (!isCancelled) setIsReady(true)
        })
        .catch((error: unknown) => {
          console.error("DepthGallery init failed", error)
        })
    })

    return () => {
      isCancelled = true
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [])

  // Pausa las animaciones del gallery cuando hay modal abierto. El modal
  // tiene su propio render loop con instancia interactive.
  useEffect(() => {
    engineRef.current?.setAnimationsPaused(!!activePlaneId)
  }, [activePlaneId])

  return (
    <div ref={containerRef} className="dg-root">
      <canvas ref={canvasRef} className="dg-canvas" />
      <SectionLink
        onClick={() => withTransition(() => router.push("/?section=work"))}
        isTransitioning={false}
        section="work"
      />
      <p className="dg-hint" style={{ opacity: isReady ? 0.65 : 0 }}>
        {t(
          focusedPlaneId &&
            galleryPlaneData.find((p) => p.id === focusedPlaneId)?.animationId
            ? "animaciones.hint"
            : "animaciones.hintScroll",
        )}
      </p>
      <AnimationModal planeId={activePlaneId} onClose={() => setActivePlaneId(null)} />
    </div>
  )
}
