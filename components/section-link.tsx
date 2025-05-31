"use client"

import { motion } from "framer-motion"

interface SectionLinkProps {
  onClick: () => void
  isTransitioning: boolean
  section: string
}

export function SectionLink({ onClick, isTransitioning, section }: SectionLinkProps) {
  // Determinar qué letras mostrar según la sección
  const letters = section === "work" ? ["K", "R", "O", "W"] : ["E", "M", "O", "H"]

  return (
    <motion.button
      onClick={() => !isTransitioning && onClick()}
      className="fixed top-1/2 left-6 -translate-y-1/2 text-foreground transition-colors pointer-events-auto z-50 flex flex-col items-center hover:text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      disabled={isTransitioning}
    >
      <div className="flex flex-col items-center mb-6">
        {letters.map((letter, index) => (
          <span key={index} className="text-[10px] font-light tracking-widest -rotate-90 mb-5">
            {letter}
          </span>
        ))}
      </div>
      <motion.div className="w-[0.5px] h-24 bg-foreground/30" />
    </motion.button>
  )
}
