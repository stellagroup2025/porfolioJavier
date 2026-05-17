"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Logo } from "@/components/logo"
import { useIsMobile } from "@/hooks/use-mobile"

export type RevealerPhase = "idle" | "covering" | "covered" | "uncovering"
export type RevealerDirection = "forward" | "backward"

// Duraciones (en segundos) que la implementación mobile usa internamente.
// Se exportan para que el orquestador (page.tsx) pueda esperar esos mismos
// tiempos en handleSectionChange y no se quede esperando de balde.
export const MOBILE_REVEALER_DURATIONS = {
  covering: 0.32,
  covered: 0.22,
  uncovering: 0.32,
} as const

const LEFT_PATHS = [
  "M 0,0 L 0,0 C 0,0 0,0 0,5 C 0,10 0,10 0,10 L 0,10 Z",
  "M 0,0 L 0,0 C 0,0 5,0 5,5 C 5,10 0,10 0,10 L 0,10 Z",
  "M 0,0 L 10,0 C 10,0 10,0 10,5 C 10,10 10,10 10,10 L 0,10 Z",
]

const RIGHT_PATHS = [
  "M 10,0 L 10,0 C 10,0 10,0 10,5 C 10,10 10,10 10,10 L 10,10 Z",
  "M 10,0 L 10,0 C 10,0 5,0 5,5 C 5,10 10,10 10,10 L 10,10 Z",
  "M 10,0 L 0,0 C 0,0 0,0 0,5 C 0,10 0,10 0,10 L 10,10 Z",
]

const EASE = [0.65, 0, 0.35, 1] as const

type Plan = {
  key: string
  initialPath: string
  animateTarget: string | string[]
  duration: number
  withTimes: boolean
}

function buildPlan(phase: RevealerPhase, direction: RevealerDirection): Plan {
  if (phase === "covering") {
    const set = direction === "forward" ? LEFT_PATHS : RIGHT_PATHS
    return {
      key: `${direction}-cover`,
      initialPath: set[0],
      animateTarget: set,
      duration: 1.2,
      withTimes: true,
    }
  }
  if (phase === "covered") {
    const set = direction === "forward" ? LEFT_PATHS : RIGHT_PATHS
    return {
      key: `${direction}-covered`,
      initialPath: set[2],
      animateTarget: set[2],
      duration: 0,
      withTimes: false,
    }
  }
  if (phase === "uncovering") {
    const baseSet = direction === "forward" ? RIGHT_PATHS : LEFT_PATHS
    const reversed = [baseSet[2], baseSet[1], baseSet[0]]
    return {
      key: `${direction}-uncover`,
      initialPath: baseSet[2],
      animateTarget: reversed,
      duration: 1.2,
      withTimes: true,
    }
  }
  return {
    key: "idle",
    initialPath: LEFT_PATHS[0],
    animateTarget: LEFT_PATHS[0],
    duration: 0,
    withTimes: false,
  }
}

/**
 * Tiempos coordinados de la firma central (durante phase=covered).
 * Total ~700ms: línea de entrada → logo aparece → línea de salida.
 */
const INBOUND_DURATION = 0.32
const LOGO_DELAY = 0.22
const LOGO_DURATION = 0.22
const OUTBOUND_DELAY = 0.36
const OUTBOUND_DURATION = 0.32

export function RevealerTransition({
  phase,
  direction = "forward",
}: {
  phase: RevealerPhase
  direction?: RevealerDirection
}) {
  const isMobile = useIsMobile()
  // En mobile usamos un componente diferente: panel sólido con transform,
  // 100% GPU compositor. El SVG path-morph del desktop es CPU-heavy.
  if (isMobile) return <MobileRevealer phase={phase} direction={direction} />

  const isVisible = phase !== "idle"
  const plan = buildPlan(phase, direction)

  // En forward la línea ENTRA por la izquierda y SALE por la derecha.
  // En backward la línea ENTRA por la derecha y SALE por la izquierda.
  // Como el layout JSX es [izquierda][logo][derecha], los delays se asignan
  // según qué lado del logo corresponde a la entrada en cada dirección.
  const transformOrigin = direction === "forward" ? "left center" : "right center"
  const leftIsInbound = direction === "forward"
  const leftDelay = leftIsInbound ? 0 : OUTBOUND_DELAY
  const leftDuration = leftIsInbound ? INBOUND_DURATION : OUTBOUND_DURATION
  const rightDelay = leftIsInbound ? OUTBOUND_DELAY : 0
  const rightDuration = leftIsInbound ? OUTBOUND_DURATION : INBOUND_DURATION

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[900] pointer-events-none"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 10 10"
        preserveAspectRatio="none"
      >
        <motion.path
          key={plan.key}
          fill="#0d0d0f"
          initial={{ d: plan.initialPath }}
          animate={{ d: plan.animateTarget }}
          transition={{
            duration: plan.duration,
            ease: EASE,
            times: plan.withTimes ? [0, 0.5, 1] : undefined,
          }}
        />
      </svg>

      <AnimatePresence>
        {phase === "covered" && (
          <motion.div
            key={`signature-${direction}`}
            className="absolute inset-0 flex items-center justify-center gap-5 sm:gap-7 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Línea izquierda del layout */}
            <motion.div
              className="flex-1 h-px bg-foreground/45"
              style={{ transformOrigin }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: leftDuration,
                delay: leftDelay,
                ease: [0.65, 0, 0.35, 1],
              }}
            />

            {/* Logo: aparece después de la línea de entrada y se va antes de la de salida */}
            <motion.div
              className="relative shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.9, 1, 1, 0.92],
              }}
              transition={{
                duration: 0.6,
                times: [0, 0.35, 0.7, 1],
                delay: LOGO_DELAY,
                ease: "easeInOut",
              }}
            >
              <Logo
                interactive={false}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
              />
            </motion.div>

            {/* Línea derecha del layout */}
            <motion.div
              className="flex-1 h-px bg-foreground/45"
              style={{ transformOrigin }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: rightDuration,
                delay: rightDelay,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Versión mobile: panel sólido con gradiente sutil que se desliza vertical
 * via `transform: translateY`. Todo el render es GPU (compositor), sin
 * SVG path-morph ni layout changes. Mantiene el "flash" de logo central
 * para conservar el lenguaje de marca pero más corto.
 *
 * - covering: panel entra (desde top en forward, desde bottom en backward)
 * - covered: hold + logo flash
 * - uncovering: panel sale por el lado opuesto (efecto "pasa de largo")
 */
function MobileRevealer({
  phase,
  direction,
}: {
  phase: RevealerPhase
  direction: RevealerDirection
}) {
  const isVisible = phase !== "idle"

  // Direction:
  //   forward  → entra desde TOP (-100%), sale por BOTTOM (+100%)
  //   backward → entra desde BOTTOM (+100%), sale por TOP (-100%)
  const enterFrom = direction === "forward" ? "-100%" : "100%"
  const exitTo = direction === "forward" ? "100%" : "-100%"

  let targetY: string
  let duration: number
  if (phase === "covering") {
    targetY = "0%"
    duration = MOBILE_REVEALER_DURATIONS.covering
  } else if (phase === "covered") {
    targetY = "0%"
    duration = 0
  } else if (phase === "uncovering") {
    targetY = exitTo
    duration = MOBILE_REVEALER_DURATIONS.uncovering
  } else {
    targetY = enterFrom
    duration = 0
  }

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[900] pointer-events-none"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ y: enterFrom }}
        animate={{ y: targetY }}
        transition={{ duration, ease: EASE }}
        style={{
          // Gradiente sutil para que el panel no sea un bloque plano y se
          // sienta "premium" en lugar de un fade genérico.
          background:
            "linear-gradient(180deg, #0a0a0c 0%, #14141a 50%, #0a0a0c 100%)",
          willChange: "transform",
        }}
      />

      <AnimatePresence>
        {phase === "covered" && (
          <motion.div
            key="mobile-flash"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.92, 1, 1, 0.95],
              }}
              transition={{
                duration: MOBILE_REVEALER_DURATIONS.covered,
                times: [0, 0.35, 0.7, 1],
                ease: "easeInOut",
              }}
            >
              <Logo interactive={false} className="w-16 h-16" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
