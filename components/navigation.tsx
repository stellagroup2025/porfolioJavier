"use client"

import { motion } from "framer-motion"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "ai", label: "AI" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          className={`relative px-4 py-2 rounded-full text-sm transition-colors ${
            activeSection === item.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {item.label}
          {activeSection === item.id && (
            <motion.div
              layoutId="activeSection"
              className="absolute inset-0 bg-primary/10 rounded-full -z-10"
              initial={false}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </nav>
  )
}
