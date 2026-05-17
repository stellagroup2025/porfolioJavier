"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, ArrowRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { AboutBackground } from "@/components/about-background"
import { cn } from "@/lib/utils"
import { Playfair_Display } from "next/font/google"

// Importamos una fuente serif elegante para detalles
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] })

export function About() {
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("biography")

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "Framer Motion",
    "MongoDB",
    "PostgreSQL",
    "GraphQL",
    "AWS",
    "Docker",
  ]

  // Variantes para animaciones
  const titleVariants = {
    hidden: { opacity: 0, x: 500 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 45,
        damping: 12,
        mass: 1.2,
        duration: 3.8,
        delay: 1.2,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2 + 0.15 * i,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const lineAnimation = {
    hidden: { width: "0%" },
    visible: {
      width: "100%",
      transition: {
        duration: 1.5,
        ease: [0.25, 0.4, 0.25, 1],
        delay: 0.5,
      },
    },
  }

  // Variantes para la animación de contenido
  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  }

  // Variantes para elementos individuales dentro del contenido
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-start px-5 pt-24 pb-32 sm:px-6 sm:py-10 md:px-16 lg:px-24 overflow-y-auto">
      <AboutBackground />

      <div className="w-full max-w-7xl mx-auto z-10" ref={containerRef}>
        {/* Título principal. En mobile bajamos el tamaño y reservamos top
            padding desde el contenedor (pt-24) para no quedar bajo el
            header fixed. */}
        <div className="mb-6 sm:mb-8 md:mb-12 overflow-hidden">
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            Sobre mí
          </motion.h1>
          <motion.div className="h-px bg-foreground/20 mt-3 sm:mt-4" variants={lineAnimation} initial="hidden" animate="visible" />
        </div>

        {/* Contenido principal con diseño arquitectónico */}
        <motion.div className="relative" variants={staggerContainer} initial="hidden" animate="visible">
          {/* Contenido principal - Ocupa más espacio */}
          <motion.div className="pr-0 lg:pr-72" variants={fadeInUp} custom={0}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                {/* En mobile la imagen es más recortada (4:5) para no
                    dominar el viewport y dejar espacio al texto. Desktop
                    mantiene 3:4 original. */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden mb-6">
                  <img src="/images/javier-profile.png" alt="Javier Reyes" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Nombre superpuesto en la imagen — padding menor en
                      mobile, texto un grado más chico para no apretarse. */}
                  <div className="absolute bottom-0 left-0 p-5 sm:p-8 w-full">
                    <h2 className={cn("text-2xl sm:text-4xl font-light mb-1 tracking-wide", playfair.className)}>Javier Reyes</h2>
                    <p className="text-foreground/70 text-sm sm:text-lg font-light tracking-widest uppercase">Full Stack Developer</p>
                  </div>
                </div>

              </div>

              {/* Contenido dinámico. min-h solo en desktop para que el
                  contenido más corto no colapse la columna; en mobile no
                  hace falta y solo añadía aire muerto. */}
              <div className="lg:col-span-7 lg:min-h-[500px]">
                <AnimatePresence mode="wait">
                  {/* Sección de biografía */}
                  {activeSection === "biography" && (
                    <motion.div
                      key="biography"
                      className="space-y-6"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div className="flex items-center gap-4 mb-6" variants={itemVariants}>
                        <h2 className={cn("text-3xl font-light", playfair.className)}>Biografía</h2>
                        <div className="h-px bg-foreground/20 flex-grow"></div>
                      </motion.div>

                      <motion.div
                        className="space-y-4 text-foreground/80 leading-relaxed text-lg font-light"
                        variants={itemVariants}
                      >
                        <motion.p variants={itemVariants}>
                          Con más de 5 años de experiencia en el desarrollo web, me especializo en crear soluciones
                          digitales que combinan funcionalidad y diseño. Mi pasión es construir productos que no solo
                          sean técnicamente sólidos, sino también intuitivos y agradables de usar.
                        </motion.p>
                        <motion.p variants={itemVariants}>
                          Mi enfoque se centra en la creación de código limpio y mantenible, con especial atención a la
                          experiencia del usuario y el rendimiento. Creo firmemente que la mejor tecnología es aquella
                          que resuelve problemas reales de manera eficiente.
                        </motion.p>
                        <motion.p variants={itemVariants}>
                          Trabajo con tecnologías modernas como React, Next.js, Node.js y bases de datos SQL/NoSQL,
                          adaptándome a las necesidades específicas de cada proyecto. Me mantengo constantemente
                          actualizado con las últimas tendencias y mejores prácticas del sector.
                        </motion.p>
                      </motion.div>

                      <motion.div className="pt-4" variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/10 bg-foreground/5">
                          <span className="text-sm text-foreground/60">Disponible para nuevos proyectos</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Sección de habilidades */}
                  {activeSection === "skills" && (
                    <motion.div
                      key="skills"
                      className="space-y-6"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div className="flex items-center gap-4 mb-6" variants={itemVariants}>
                        <h2 className={cn("text-3xl font-light", playfair.className)}>Habilidades</h2>
                        <div className="h-px bg-foreground/20 flex-grow"></div>
                      </motion.div>

                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6" variants={itemVariants}>
                        <motion.div className="space-y-4" variants={itemVariants}>
                          <h3 className="text-xl font-light text-foreground/90">Desarrollo Frontend</h3>
                          <div className="space-y-3">
                            {["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"].map(
                              (skill, index) => (
                                <motion.div
                                  key={index}
                                  className="flex items-center justify-between"
                                  variants={itemVariants}
                                  custom={index}
                                >
                                  <span className="text-foreground/70">{skill}</span>
                                  <div className="w-24 h-px bg-foreground/10">
                                    <motion.div
                                      className="h-full bg-foreground/40"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.random() * 40 + 60}%` }}
                                      transition={{ duration: 0.6, delay: 0.1 * index }}
                                    ></motion.div>
                                  </div>
                                </motion.div>
                              ),
                            )}
                          </div>
                        </motion.div>

                        <motion.div className="space-y-4" variants={itemVariants}>
                          <h3 className="text-xl font-light text-foreground/90">Desarrollo Backend</h3>
                          <div className="space-y-3">
                            {["Node.js", "Express", "MongoDB", "PostgreSQL", "GraphQL", "AWS"].map((skill, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center justify-between"
                                variants={itemVariants}
                                custom={index}
                              >
                                <span className="text-foreground/70">{skill}</span>
                                <div className="w-24 h-px bg-foreground/10">
                                  <motion.div
                                    className="h-full bg-foreground/40"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.random() * 40 + 60}%` }}
                                    transition={{ duration: 0.6, delay: 0.1 * index }}
                                  ></motion.div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>

                      <motion.div className="pt-4" variants={itemVariants}>
                        <h3 className="text-xl font-light text-foreground/90 mb-3">Otras tecnologías</h3>
                        <div className="flex flex-wrap gap-2">
                          {["Docker", "Git", "CI/CD", "Jest", "Cypress", "Figma", "Adobe XD", "Photoshop"].map(
                            (skill, index) => (
                              <motion.div
                                key={index}
                                variants={itemVariants}
                                custom={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.05 * index }}
                              >
                                <Badge
                                  variant="outline"
                                  className="bg-transparent border-foreground/10 text-foreground/70 py-1.5 px-3 text-sm rounded-none"
                                >
                                  {skill}
                                </Badge>
                              </motion.div>
                            ),
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Sección de experiencia */}
                  {activeSection === "experience" && (
                    <motion.div
                      key="experience"
                      className="space-y-6"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div className="flex items-center gap-4 mb-6" variants={itemVariants}>
                        <h2 className={cn("text-3xl font-light", playfair.className)}>Experiencia</h2>
                        <div className="h-px bg-foreground/20 flex-grow"></div>
                      </motion.div>

                      <motion.div className="space-y-8" variants={itemVariants}>
                        <motion.div className="relative grid grid-cols-12 gap-4" variants={itemVariants}>
                          <div className="col-span-3 text-foreground/50 text-sm">2021 - Presente</div>
                          <div className="col-span-9 space-y-2">
                            <h3 className="text-xl font-medium">Senior Full Stack Developer</h3>
                            <p className="text-foreground/60 italic">Tech Innovations Inc.</p>
                            <p className="text-foreground/80 mt-3">
                              Lideré el desarrollo de aplicaciones web y móviles para clientes de diversos sectores,
                              implementando arquitecturas escalables y soluciones innovadoras.
                            </p>
                            <motion.div className="flex flex-wrap gap-2 mt-3">
                              {["React", "Node.js", "AWS", "MongoDB"].map((tech, i) => (
                                <motion.span
                                  key={i}
                                  className="text-xs text-foreground/40 px-2 py-1 border border-foreground/10"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 * i }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>

                        <motion.div className="w-full h-px bg-foreground/5" variants={itemVariants}></motion.div>

                        <motion.div className="relative grid grid-cols-12 gap-4" variants={itemVariants}>
                          <div className="col-span-3 text-foreground/50 text-sm">2019 - 2021</div>
                          <div className="col-span-9 space-y-2">
                            <h3 className="text-xl font-medium">Frontend Developer</h3>
                            <p className="text-foreground/60 italic">Digital Solutions</p>
                            <p className="text-foreground/80 mt-3">
                              Desarrollé interfaces de usuario intuitivas y responsivas utilizando React y Next.js,
                              colaborando estrechamente con diseñadores UX/UI y backend developers.
                            </p>
                            <motion.div className="flex flex-wrap gap-2 mt-3">
                              {["React", "Next.js", "Tailwind CSS", "Firebase"].map((tech, i) => (
                                <motion.span
                                  key={i}
                                  className="text-xs text-foreground/40 px-2 py-1 border border-foreground/10"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 * i }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Sección de educación */}
                  {activeSection === "education" && (
                    <motion.div
                      key="education"
                      className="space-y-6"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div className="flex items-center gap-4 mb-6" variants={itemVariants}>
                        <h2 className={cn("text-3xl font-light", playfair.className)}>Educación</h2>
                        <div className="h-px bg-foreground/20 flex-grow"></div>
                      </motion.div>

                      <motion.div className="space-y-8" variants={itemVariants}>
                        <motion.div className="relative grid grid-cols-12 gap-4" variants={itemVariants}>
                          <div className="col-span-3 text-foreground/50 text-sm">2016 - 2017</div>
                          <div className="col-span-9 space-y-2">
                            <h3 className="text-xl font-medium">Máster en Desarrollo Web</h3>
                            <p className="text-foreground/60 italic">Universidad Tecnológica</p>
                            <p className="text-foreground/80 mt-3">
                              Especialización en tecnologías web modernas, arquitectura de software y metodologías
                              ágiles.
                            </p>
                            <motion.div className="flex flex-wrap gap-2 mt-3">
                              <motion.span
                                className="text-xs text-foreground/40 px-2 py-1 border border-foreground/10"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                              >
                                Nota media: 9.2
                              </motion.span>
                            </motion.div>
                          </div>
                        </motion.div>

                        <motion.div className="w-full h-px bg-foreground/5" variants={itemVariants}></motion.div>

                        <motion.div className="relative grid grid-cols-12 gap-4" variants={itemVariants}>
                          <div className="col-span-3 text-foreground/50 text-sm">2012 - 2016</div>
                          <div className="col-span-9 space-y-2">
                            <h3 className="text-xl font-medium">Grado en Ingeniería Informática</h3>
                            <p className="text-foreground/60 italic">Universidad Nacional</p>
                            <p className="text-foreground/80 mt-3">
                              Formación en fundamentos de programación, algoritmos, bases de datos y desarrollo de
                              software.
                            </p>
                            <motion.div className="flex flex-wrap gap-2 mt-3">
                              <motion.span
                                className="text-xs text-foreground/40 px-2 py-1 border border-foreground/10"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                              >
                                Nota media: 8.7
                              </motion.span>
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Navegación elegante - Posicionada absolutamente en el extremo derecho */}
          <motion.div
            className="hidden lg:block fixed top-20 right-4 w-64 space-y-4 z-20"
            variants={fadeInUp}
            custom={1}
          >
            <h3 className="text-sm uppercase tracking-widest text-foreground/50 mb-4">Explorar</h3>

            <nav className="space-y-3">
              {[
                { id: "biography", label: "Biografía" },
                { id: "skills", label: "Habilidades" },
                { id: "experience", label: "Experiencia" },
                { id: "education", label: "Educación" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "group flex items-center space-x-4 w-full text-left transition-all duration-300",
                    activeSection === item.id ? "text-foreground" : "text-foreground/40 hover:text-foreground/70",
                  )}
                >
                  <div
                    className={cn(
                      "h-px transition-all duration-300",
                      activeSection === item.id
                        ? "w-12 bg-foreground"
                        : "w-6 bg-foreground/40 group-hover:w-8 group-hover:bg-foreground/70",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xl transition-all duration-300",
                      activeSection === item.id ? "font-medium" : "font-light",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            {/* Botones CV y LinkedIn — bajo la nav, en la columna derecha */}
            <div className="pt-10 flex flex-col gap-3">
              <Button className="rounded-none gap-2 bg-transparent hover:bg-foreground/5 text-foreground border border-foreground/10 h-12 justify-start px-6">
                <Download size={16} />
                <span className="ml-2">Descargar CV</span>
                <ArrowRight size={14} className="ml-auto opacity-50" />
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none gap-2 border-foreground/10 text-foreground hover:bg-foreground/5 h-12 justify-start px-6"
              >
                <a
                  href="https://es.linkedin.com/in/javier-reyes-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} />
                  <span className="ml-2">LinkedIn</span>
                  <ArrowRight size={14} className="ml-auto opacity-50" />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Navegación móvil - Solo visible en dispositivos pequeños */}
          <motion.div className="lg:hidden mt-8 space-y-4" variants={fadeInUp} custom={1}>
            <h3 className="text-sm uppercase tracking-widest text-foreground/50 mb-3">Explorar</h3>

            <nav className="grid grid-cols-2 gap-3">
              {[
                { id: "biography", label: "Biografía" },
                { id: "skills", label: "Habilidades" },
                { id: "experience", label: "Experiencia" },
                { id: "education", label: "Educación" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "group flex items-center space-x-2 w-full text-left transition-all duration-300 p-2 border border-foreground/10 rounded-none",
                    activeSection === item.id
                      ? "text-foreground bg-foreground/5 border-foreground/20"
                      : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5",
                  )}
                >
                  <div
                    className={cn(
                      "h-px transition-all duration-300",
                      activeSection === item.id
                        ? "w-8 bg-foreground"
                        : "w-4 bg-foreground/40 group-hover:w-6 group-hover:bg-foreground/70",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm transition-all duration-300",
                      activeSection === item.id ? "font-medium" : "font-light",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            <div className="pt-4 flex flex-col gap-3">
              <Button className="rounded-none gap-2 bg-transparent hover:bg-foreground/5 text-foreground border border-foreground/10 h-12 justify-start px-6">
                <Download size={16} />
                <span className="ml-2">Descargar CV</span>
                <ArrowRight size={14} className="ml-auto opacity-50" />
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none gap-2 border-foreground/10 text-foreground hover:bg-foreground/5 h-12 justify-start px-6"
              >
                <a
                  href="https://es.linkedin.com/in/javier-reyes-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} />
                  <span className="ml-2">LinkedIn</span>
                  <ArrowRight size={14} className="ml-auto opacity-50" />
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
