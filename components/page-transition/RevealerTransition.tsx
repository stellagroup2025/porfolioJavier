"use client"

import { motion } from "framer-motion"

export type RevealerPhase = "idle" | "covering" | "covered" | "uncovering"
export type RevealerDirection = "forward" | "backward"

/**
 * LEFT_PATHS: M y last L anclados al lado izquierdo (M 0,0 / L 0,10).
 * La curva crece desde x=0 hasta x=10 cubriendo el viewport.
 * Cada keyframe comparte topología con los otros → interpolación limpia.
 */
const LEFT_PATHS = [
  "M 0,0 L 0,0 C 0,0 0,0 0,5 C 0,10 0,10 0,10 L 0,10 Z",
  "M 0,0 L 0,0 C 0,0 5,0 5,5 C 5,10 0,10 0,10 L 0,10 Z",
  "M 0,0 L 10,0 C 10,0 10,0 10,5 C 10,10 10,10 10,10 L 0,10 Z",
]

/**
 * RIGHT_PATHS: M y last L anclados al lado derecho (M 10,0 / L 10,10).
 * La curva crece desde x=10 hasta x=0.
 */
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
  // Forward: cover entra desde la izquierda y descubre por la derecha.
  // Backward: cover entra desde la derecha y descubre por la izquierda.
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
    // Igual al último keyframe del cover correspondiente. No anima.
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
    // Forward uncover usa RIGHT_PATHS revertido: arranca cubierto desde la derecha
    // y la curva se va por la derecha → el lado izquierdo queda libre primero.
    // Backward uncover usa LEFT_PATHS revertido: simétrico.
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
  // idle
  return {
    key: "idle",
    initialPath: LEFT_PATHS[0],
    animateTarget: LEFT_PATHS[0],
    duration: 0,
    withTimes: false,
  }
}

export function RevealerTransition({
  phase,
  direction = "forward",
}: {
  phase: RevealerPhase
  direction?: RevealerDirection
}) {
  const isVisible = phase !== "idle"
  const plan = buildPlan(phase, direction)

  return (
    <svg
      aria-hidden
      className="fixed inset-0 z-[900] pointer-events-none w-full h-full"
      viewBox="0 0 10 10"
      preserveAspectRatio="none"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
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
  )
}
