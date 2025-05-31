"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Playfair_Display } from "next/font/google"

// Use Playfair Display as a stylish alternative
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
})

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
  isTransitioning: boolean
  isMobile: boolean
}

export function TypographicNavigation({ activeSection, setActiveSection, isTransitioning, isMobile }: NavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems = [
    { id: "work", label: "Work" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ]

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  }

  const mobileItemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  }

  // Si estamos en la página de inicio, mostramos la navegación con un estilo específico
  if (activeSection === "home") {
    if (isMobile) {
      // Layout móvil: navegación centrada en toda la pantalla para pantallas pequeñas
      return (
        <motion.div
          className="absolute top-0 right-0 w-full h-full flex items-start justify-center pointer-events-none pt-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col items-center justify-start space-y-8 px-8 w-full max-w-sm">
            {navItems.map((item, index) => (
              <motion.div key={item.id} variants={mobileItemVariants} className="w-full">
                <motion.button
                  onClick={() => !isTransitioning && setActiveSection(item.id)}
                  onTouchStart={() => setHoveredItem(item.id)}
                  onTouchEnd={() => setHoveredItem(null)}
                  className={cn(
                    "text-4xl xs:text-5xl sm:text-6xl font-black tracking-wide pointer-events-auto relative italic text-center w-full",
                    playfair.className,
                  )}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  disabled={isTransitioning}
                >
                  <motion.span
                    className="inline-block relative"
                    initial={{ color: "#000000" }}
                    animate={{
                      color: hoveredItem === item.id ? "#6b5b73" : "#000000",
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    {item.label}
                  </motion.span>
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-[#6b5b73]"
                    initial={{ width: 0 }}
                    animate={{ width: hoveredItem === item.id ? "80%" : 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    } else {
      // Layout escritorio: navegación en la derecha como antes
      return (
        <motion.div
          className="absolute top-0 right-0 w-full h-full flex items-center justify-center pointer-events-none"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="absolute"
                variants={itemVariants}
                style={{
                  right: "8%",
                  top: `${10 + index * 18}%`,
                }}
              >
                <motion.button
                  onClick={() => !isTransitioning && setActiveSection(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-wide pointer-events-auto relative italic",
                    playfair.className,
                  )}
                  whileHover={{ x: 20, scale: 1.02 }}
                  disabled={isTransitioning}
                >
                  <motion.span
                    className="inline-block relative"
                    initial={{ color: "#000000" }}
                    animate={{
                      color: hoveredItem === item.id ? "#6b5b73" : "#000000",
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    {item.label}
                  </motion.span>
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-[#6b5b73]"
                    initial={{ width: 0 }}
                    animate={{ width: hoveredItem === item.id ? "100%" : 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    }
  }

  // Para las demás secciones, no mostramos la navegación tipográfica
  return null
}
