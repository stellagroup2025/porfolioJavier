"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { PageTransition } from "@/components/page-transition"
import { WorkBackground } from "@/components/work-background"
import { cn } from "@/lib/utils"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] })

interface WorkProps {
  activeProject: string | null
  setActiveProject: (id: string | null) => void
}

export function Work({ activeProject, setActiveProject }: WorkProps) {
  const isMobile = useIsMobile()

  const projects = [
    {
      id: "ecommerce",
      title: "E-commerce Platform",
      description:
        "Plataforma de comercio electrónico completa con gestión de inventario, carrito de compras, pasarela de pagos y panel de administración.",
      image: "/modern-ecommerce-website.png",
      tags: ["Next.js", "MongoDB", "Stripe", "Tailwind CSS", "Redux"],
      link: "#",
      github: "#",
      featured: true,
    },
    {
      id: "dashboard",
      title: "Dashboard Analytics",
      description: "Panel de control para visualización de datos y métricas empresariales en tiempo real.",
      image: "/data-analytics-dashboard.png",
      tags: ["React", "D3.js", "Firebase", "Material UI", "TypeScript"],
      link: "#",
      github: "#",
      featured: true,
    },
    {
      id: "mobileapp",
      title: "Mobile App",
      description: "Aplicación móvil para gestión de tareas y productividad personal.",
      image: "/mobile-app-interface.png",
      tags: ["React Native", "Redux", "Node.js", "Express", "MongoDB"],
      link: "#",
      github: "#",
      featured: false,
    },
    {
      id: "aigenerator",
      title: "AI Content Generator",
      description: "Herramienta de generación de contenido utilizando inteligencia artificial.",
      image: "/ai-content-generator.png",
      tags: ["Python", "TensorFlow", "OpenAI", "Flask", "React"],
      link: "#",
      github: "#",
      featured: false,
    },
  ]

  if (!activeProject) {
    return (
      <div className="w-full h-full flex flex-col relative">
        <WorkBackground />

        {/* Texto introductorio - Móvil: arriba, Desktop: izquierda */}
        <motion.div
          className={cn(
            "z-10",
            isMobile
              ? "px-6 pt-20 pb-8" // Móvil: parte superior con padding
              : "absolute left-8 sm:left-16 md:left-24 top-1/2 -translate-y-1/2 max-w-2xl", // Desktop: posición original
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className={cn(
              "font-bold font-playfair mb-6 text-black tracking-tight",
              isMobile ? "text-3xl text-center" : "text-4xl sm:text-5xl md:text-6xl text-left",
            )}
          >
            Proyectos
          </h1>

          <p className={cn("text-black/70 mb-4", isMobile ? "text-center text-sm" : "text-left")}>
            Una selección de mis trabajos más recientes y destacados.
          </p>
        </motion.div>

        {/* Navegación de proyectos */}
        <div className={cn("flex-1", isMobile ? "relative" : "absolute inset-0")}>
          <WorkNavigation projects={projects} setActiveProject={setActiveProject} isMobile={isMobile} />
        </div>
      </div>
    )
  }

  const project = projects.find((p) => p.id === activeProject)!

  return (
    <PageTransition>
      <div className="w-full h-full flex flex-col items-center justify-center py-12 px-6 overflow-y-auto">
        <WorkBackground />

        <div className="w-full max-w-6xl mx-auto z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className={cn(
                "text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-black",
                playfair.className,
              )}
            >
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed font-light">
              {project.description}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Button variant="default" className="gap-2 rounded-full bg-black text-white hover:bg-black/90 px-8 py-3">
              <ExternalLink size={16} />
              Ver proyecto en vivo
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-full border-black/20 text-black hover:bg-black/10 px-8 py-3"
            >
              <Github size={16} />
              Ver código fuente
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <button
              onClick={() => setActiveProject(null)}
              className="group flex items-center gap-3 text-black/60 hover:text-black transition-colors"
            >
              <div className="w-8 h-px bg-black/20 group-hover:bg-black/60 transition-colors" />
              <span className="text-sm uppercase tracking-widest">Volver a proyectos</span>
              <div className="w-8 h-px bg-black/20 group-hover:bg-black/60 transition-colors" />
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

interface WorkNavigationProps {
  projects: any[]
  setActiveProject: (id: string | null) => void
  isMobile: boolean
}

function WorkNavigation({ projects, setActiveProject, isMobile }: WorkNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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

  return (
    <motion.div
      className="absolute top-0 right-0 w-full h-full flex items-center justify-center pointer-events-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="absolute"
            variants={itemVariants}
            style={{
              right: isMobile ? "5%" : "10%",
              top: isMobile ? `${20 + index * 12}%` : `${30 + index * 15}%`, // Reduced top spacing for mobile
            }}
          >
            <motion.button
              onClick={() => setActiveProject(project.id)}
              onMouseEnter={() => setHoveredItem(project.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair tracking-tighter transition-colors pointer-events-auto relative ${
                hoveredItem === project.id ? "text-black" : "text-black/70"
              }`}
              whileHover={{ x: 20 }}
            >
              {project.title}
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-black"
                initial={{ width: 0 }}
                animate={{ width: hoveredItem === project.id ? "100%" : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
