"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { PolygonTransition } from "./PolygonTransition"

type Phase = "idle" | "closing" | "covered" | "opening"

type TransitionContextValue = {
  phase: Phase
  withTransition: (action: () => void | Promise<void>) => Promise<void>
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

const CLOSE_MS = 950
const COVERED_HOLD_MS = 220
const OPEN_MS = 850

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const busyRef = useRef(false)

  const withTransition = useCallback(async (action: () => void | Promise<void>) => {
    if (busyRef.current) return
    busyRef.current = true

    setPhase("closing")
    await wait(CLOSE_MS)
    setPhase("covered")

    try {
      await action()
    } catch (error) {
      console.error("Transition action failed", error)
    }

    await wait(COVERED_HOLD_MS)
    setPhase("opening")
    await wait(OPEN_MS)
    setPhase("idle")
    busyRef.current = false
  }, [])

  const value = useMemo(() => ({ phase, withTransition }), [phase, withTransition])

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <PolygonTransition phase={phase} />
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (!context) {
    return {
      phase: "idle" as Phase,
      withTransition: async (action: () => void | Promise<void>) => {
        await action()
      },
    }
  }
  return context
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}
