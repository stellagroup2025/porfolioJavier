"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { SectionLink } from "@/components/section-link"
import { useTransition } from "@/components/page-transition/TransitionProvider"
import { AnimationModal } from "./AnimationModal"
import "./depth-gallery.css"

export function DepthGallery() {
  const router = useRouter()
  const { withTransition } = useTransition()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [activePlaneId, setActivePlaneId] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let engineInstance: { dispose: () => void } | null = null
    let isCancelled = false

    import("./Engine").then(({ Engine }) => {
      if (isCancelled || !canvas) return
      const engine = new Engine(canvas, container, {
        onPlaneClick: (planeId: string) => {
          setActivePlaneId(planeId)
        },
      })
      engineInstance = engine
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
      engineInstance?.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="dg-root">
      <canvas ref={canvasRef} className="dg-canvas" />
      <SectionLink
        onClick={() => withTransition(() => router.push("/?section=work"))}
        isTransitioning={false}
        section="work"
      />
      <p className="dg-hint" style={{ opacity: isReady ? 0.65 : 0 }}>
        Scroll para navegar · click en la card en foco para ver la animación
      </p>
      <AnimationModal planeId={activePlaneId} onClose={() => setActivePlaneId(null)} />
    </div>
  )
}
