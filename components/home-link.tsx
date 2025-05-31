"use client"

import { motion } from "framer-motion"

interface HomeLinkProps {
  onClick: () => void
  isTransitioning: boolean
}

export function HomeLink({ onClick, isTransitioning }: HomeLinkProps) {
  return (
    <motion.button
      onClick={() => !isTransitioning && onClick()}
      className="fixed top-1/2 left-8 -translate-y-1/2 text-foreground transition-colors pointer-events-auto z-50 flex flex-col items-center gap-2 hover:text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      whileHover={{ y: -5 }}
      disabled={isTransitioning}
    >
      <div className="flex flex-col items-center">
        <span className="text-xs tracking-widest rotate-90 mb-4">E</span>
        <span className="text-xs tracking-widest rotate-90 mb-4">M</span>
        <span className="text-xs tracking-widest rotate-90 mb-4">O</span>
        <span className="text-xs tracking-widest rotate-90 mb-4">H</span>
      </div>
      <motion.div className="w-px h-16 bg-foreground/50" />
    </motion.button>
  )
}
