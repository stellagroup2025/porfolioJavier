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
    <div className="fixed top-1/2 left-6 -translate-y-1/2 z-50 pointer-events-none">
      <motion.button
        onClick={() => !isTransitioning && onClick()}
        className="text-current transition-colors pointer-events-auto flex flex-col items-center hover:text-primary px-3 py-4 -mx-3 -my-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.18 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        disabled={isTransitioning}
      >
        <div className="flex flex-col items-center mb-6">
          {letters.map((letter, index) => (
            <span key={index} className="text-[10px] font-light tracking-widest -rotate-90 mb-5">
              {letter}
            </span>
          ))}
        </div>
        <div className="w-[0.5px] h-24 bg-current opacity-30" />
      </motion.button>
    </div>
  )
}
