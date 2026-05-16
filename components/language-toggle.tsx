"use client"

import { motion } from "framer-motion"
import { useTranslation, type Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation()

  const options: { code: Language; label: string }[] = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
  ]

  return (
    <div className="relative flex items-center gap-1 px-1 py-1 rounded-full border border-foreground/15 bg-foreground/[0.02]">
      {options.map((option) => {
        const isActive = language === option.code
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            className={cn(
              "relative px-2.5 py-1 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-colors duration-300 z-10",
              isActive
                ? "text-background"
                : "text-foreground/60 hover:text-foreground"
            )}
            aria-pressed={isActive}
            aria-label={`Switch language to ${option.label}`}
          >
            {isActive && (
              <motion.span
                layoutId="language-toggle-active"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
