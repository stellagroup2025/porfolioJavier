"use client"

import { motion } from "framer-motion"
import { Linkedin, Instagram, Github } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function SocialLinks() {
  const isMobile = useIsMobile()

  const socialLinks = [
    { icon: <Linkedin size={isMobile ? 16 : 14} />, href: "#", label: "LinkedIn" },
    { icon: <Instagram size={isMobile ? 16 : 14} />, href: "#", label: "Instagram" },
    { icon: <Github size={isMobile ? 16 : 14} />, href: "#", label: "GitHub" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 },
    show: { opacity: 1, x: 0, y: 0 },
  }

  if (isMobile) {
    // Layout móvil: fila horizontal en la parte inferior
    return (
      <motion.div
        className="flex flex-row items-center justify-center space-x-6 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {socialLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.href}
            aria-label={link.label}
            className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
            variants={item}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            {link.icon}
          </motion.a>
        ))}
      </motion.div>
    )
  }

  // Layout escritorio: columna vertical en la izquierda (como antes)
  return (
    <motion.div
      className="flex flex-col items-start space-y-3 sm:space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {socialLinks.map((link, index) => (
        <motion.a
          key={index}
          href={link.href}
          aria-label={link.label}
          className="p-1.5 sm:p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          variants={item}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          {link.icon}
        </motion.a>
      ))}
    </motion.div>
  )
}
