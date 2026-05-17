"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

type Phase = "idle" | "closing" | "covered" | "opening"

const EASE = [0.83, 0, 0.17, 1] as const
const COLS = 9
const ROWS = 6

type Shard = {
  id: number
  left: number
  top: number
  width: number
  height: number
  clipPath: string
  shade: number
  delayClose: number
  delayOpen: number
  originX: number
  originY: number
}

function buildShards(): Shard[] {
  const shards: Shard[] = []
  const cellW = 100 / COLS
  const cellH = 100 / ROWS
  const totalCells = COLS * ROWS

  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const left = c * cellW
      const top = r * cellH

      const distanceFromCenter = Math.hypot(
        (c + 0.5) / COLS - 0.5,
        (r + 0.5) / ROWS - 0.5
      )
      const normalized = distanceFromCenter / Math.hypot(0.5, 0.5)
      const baseClose = normalized * 0.55
      const baseOpen = (1 - normalized) * 0.45

      const split = (c + r) % 2 === 0
      const triA = split
        ? "polygon(0 0, 100% 0, 0 100%)"
        : "polygon(0 0, 100% 0, 100% 100%)"
      const triB = split
        ? "polygon(100% 0, 100% 100%, 0 100%)"
        : "polygon(0 0, 100% 100%, 0 100%)"

      const cellId = r * COLS + c
      const shadeA = 0.85 + ((cellId * 37) % 30) / 100
      const shadeB = 0.85 + ((cellId * 91) % 30) / 100

      shards.push({
        id: cellId * 2,
        left,
        top,
        width: cellW,
        height: cellH,
        clipPath: triA,
        shade: shadeA,
        delayClose: baseClose + ((cellId * 23) % 17) / 200,
        delayOpen: baseOpen + ((cellId * 17) % 19) / 240,
        originX: 50,
        originY: 50,
      })
      shards.push({
        id: cellId * 2 + 1,
        left,
        top,
        width: cellW,
        height: cellH,
        clipPath: triB,
        shade: shadeB,
        delayClose: baseClose + ((cellId * 41) % 13) / 200 + 0.02,
        delayOpen: baseOpen + ((cellId * 29) % 23) / 240 + 0.02,
        originX: 50,
        originY: 50,
      })
    }
  }

  return shards
}

export function PolygonTransition({ phase }: { phase: Phase }) {
  const shards = useMemo(() => buildShards(), [])
  const isCovered = phase === "closing" || phase === "covered"
  const isVisible = phase !== "idle"

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[1000] pointer-events-none"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {shards.map((shard) => {
        const baseColor = `rgba(${Math.round(13 * shard.shade)}, ${Math.round(
          13 * shard.shade
        )}, ${Math.round(15 * shard.shade)}, 1)`
        return (
          <motion.div
            key={shard.id}
            className="absolute"
            style={{
              left: `${shard.left}%`,
              top: `${shard.top}%`,
              width: `${shard.width}%`,
              height: `${shard.height}%`,
              clipPath: shard.clipPath,
              backgroundColor: baseColor,
              transformOrigin: `${shard.originX}% ${shard.originY}%`,
              willChange: "transform, opacity",
            }}
            initial={false}
            animate={{
              scale: isCovered ? 1 : 0,
              opacity: isCovered ? 1 : 0,
            }}
            transition={{
              duration: phase === "closing" ? 0.6 : 0.55,
              ease: EASE,
              delay: phase === "closing" ? shard.delayClose : shard.delayOpen,
            }}
          />
        )
      })}
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-white/70 pointer-events-none"
        initial={false}
        animate={{ opacity: phase === "covered" ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <span className="text-[clamp(16px,1.6vw,24px)] tracking-[0.5em] uppercase font-light">
          loading
        </span>
      </motion.div>
    </div>
  )
}
