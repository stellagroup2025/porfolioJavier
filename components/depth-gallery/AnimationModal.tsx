"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { X } from "lucide-react"

type AnimationDemo = {
  id: string
  title: string
  description: string
  render: () => JSX.Element
}

const demos: Record<string, AnimationDemo> = {
  fade: {
    id: "fade",
    title: "Fade In",
    description: "Transición suave de opacidad. El elemento aparece y desaparece de forma continua.",
    render: () => (
      <motion.div
        className="dg-demo-block"
        style={{ backgroundColor: "#1a1a1a" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse" }}
      />
    ),
  },
  scale: {
    id: "scale",
    title: "Scale Pulse",
    description: "Pulso de escala continuo. Útil para llamar la atención sin interrumpir el flujo.",
    render: () => (
      <motion.div
        className="dg-demo-block dg-demo-block--round"
        style={{ backgroundColor: "#1a1a1a" }}
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    ),
  },
  rotate: {
    id: "rotate",
    title: "Rotate Loop",
    description: "Rotación continua sobre el eje Z. Ideal para iconos de carga o estados activos.",
    render: () => (
      <motion.div
        className="dg-demo-block"
        style={{ backgroundColor: "#1a1a1a", borderRadius: "30%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    ),
  },
  slide: {
    id: "slide",
    title: "Slide X",
    description: "Desplazamiento horizontal de ida y vuelta. Base de transiciones entre vistas.",
    render: () => (
      <motion.div
        className="dg-demo-block dg-demo-block--sm"
        style={{ backgroundColor: "#1a1a1a", borderRadius: "1rem" }}
        animate={{ x: [-100, 100, -100] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    ),
  },
  morph: {
    id: "morph",
    title: "Morph Shape",
    description: "Transición entre formas variando border-radius. Cuadrado <-> círculo orgánico.",
    render: () => (
      <motion.div
        className="dg-demo-block"
        style={{ backgroundColor: "#1a1a1a" }}
        animate={{ borderRadius: ["20%", "50%", "20%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    ),
  },
  spring: {
    id: "spring",
    title: "Spring Hover",
    description: "Hover con física de muelle. Pasa el ratón sobre el cuadro para sentir el spring.",
    render: () => (
      <motion.div
        className="dg-demo-block"
        style={{ backgroundColor: "#1a1a1a", borderRadius: "1.25rem", cursor: "pointer" }}
        whileHover={{ scale: 1.25, rotate: 12 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
      />
    ),
  },
  stagger: {
    id: "stagger",
    title: "Stagger",
    description: "Aparición secuencial de varios elementos. Da ritmo y guía la lectura del usuario.",
    render: () => (
      <motion.div
        style={{ display: "flex", gap: "0.5rem" }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.15, repeat: Infinity, repeatDelay: 0.8 } },
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            style={{
              width: 18,
              height: 100,
              backgroundColor: "#1a1a1a",
              borderRadius: 999,
              display: "block",
            }}
            variants={{
              hidden: { scaleY: 0.2, opacity: 0.4 },
              visible: { scaleY: 1, opacity: 1 },
            }}
            transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </motion.div>
    ),
  },
  path: {
    id: "path",
    title: "Path Draw",
    description: "Animación de trazado de un SVG. La ruta se dibuja y se borra de forma continua.",
    render: () => (
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ overflow: "visible" }}>
        <motion.circle
          cx="80"
          cy="80"
          r="62"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </svg>
    ),
  },
}

type Props = {
  planeId: string | null
  onClose: () => void
}

export function AnimationModal({ planeId, onClose }: Props) {
  useEffect(() => {
    if (!planeId) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [planeId, onClose])

  const demo = planeId ? demos[planeId] : null

  return (
    <AnimatePresence>
      {demo && (
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
              aria-label="Cerrar"
              className="dg-modal__close"
            >
              <X size={18} />
            </button>
            <div className="dg-modal__stage">{demo.render()}</div>
            <div className="dg-modal__body">
              <p className="dg-modal__eyebrow">Demo · {demo.id}</p>
              <h2 className="dg-modal__title">{demo.title}</h2>
              <p className="dg-modal__description">{demo.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
