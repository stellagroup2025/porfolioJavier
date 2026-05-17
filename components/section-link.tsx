"use client"

import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

interface SectionLinkProps {
  onClick: () => void
  isTransitioning: boolean
  section: string
}

export function SectionLink({ onClick, isTransitioning, section }: SectionLinkProps) {
  const { t } = useTranslation()
  // El label viene del diccionario i18n para que se traduzca al cambiar idioma.
  // Cada letra se rota -90° individualmente y se apilan en columna, así que el
  // array hay que dárselo invertido: la última letra de la palabra debe
  // quedar arriba para que leyendo de abajo a arriba (orientación natural del
  // texto vertical girado a la izquierda) se lea la palabra en orden.
  const label = section === "work" ? t("nav.work") : t("nav.home")
  const letters = label.toUpperCase().split("").reverse()

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
        <div className="flex flex-col items-center mb-7">
          {letters.map((letter, index) => (
            <span key={index} className="text-[13px] font-light tracking-widest -rotate-90 mb-6">
              {letter}
            </span>
          ))}
        </div>
        <div className="w-[0.5px] h-28 bg-current opacity-30" />
      </motion.button>
    </div>
  )
}
