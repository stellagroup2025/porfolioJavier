"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code,
  Smartphone,
  Globe,
  Database,
  LineChart,
  Zap,
  ArrowRight,
  CheckCircle,
  Server,
  Layout,
  Search,
} from "lucide-react";
import { CosmicBackground } from "@/components/multi-background";

export function Services() {
  const [activeService, setActiveService] = useState<number | null>(null);
  const containerRef = useRef(null);
  // Cambiamos la configuración del useInView para evitar re-triggers
  const isInView = useInView(containerRef, {
    once: true, // Solo animar una vez
    amount: 0.1, // Reducir el threshold para móvil
    margin: "0px 0px -100px 0px", // Agregar margen negativo para trigger más temprano
  });

  const services = [
    {
      icon: <Code className="h-10 w-10 text-black" />,
      title: "Desarrollo Web",
      description:
        "Creación de aplicaciones web modernas y responsivas utilizando las últimas tecnologías como React, Next.js y Node.js.",
      features: [
        "Sitios web corporativos",
        "Aplicaciones web",
        "E-commerce",
        "Dashboards",
        "CMS personalizados",
      ],
      highlight: true,
    },
    {
      icon: <Smartphone className="h-10 w-10 text-black" />,
      title: "Desarrollo Móvil",
      description:
        "Desarrollo de aplicaciones móviles nativas y multiplataforma para iOS y Android con React Native y Flutter.",
      features: [
        "Apps iOS y Android",
        "PWA",
        "Integración con APIs",
        "Notificaciones push",
        "Modo offline",
      ],
      highlight: false,
    },
    {
      icon: <Database className="h-10 w-10 text-black" />,
      title: "Bases de Datos",
      description:
        "Diseño e implementación de bases de datos SQL y NoSQL optimizadas para rendimiento y escalabilidad.",
      features: [
        "MongoDB",
        "PostgreSQL",
        "MySQL",
        "Firebase",
        "Redis",
        "Optimización de consultas",
      ],
      highlight: true,
    },
    {
      icon: <Globe className="h-10 w-10 text-black" />,
      title: "Consultoría Técnica",
      description:
        "Asesoramiento estratégico para optimizar tu presencia digital, arquitectura de software y procesos tecnológicos.",
      features: [
        "Auditorías técnicas",
        "Arquitectura de software",
        "Migración a la nube",
        "DevOps",
        "Seguridad",
      ],
      highlight: false,
    },
    {
      icon: <LineChart className="h-10 w-10 text-black" />,
      title: "Analítica Web",
      description:
        "Implementación de soluciones de analítica web para medir y optimizar el rendimiento de tu sitio o aplicación.",
      features: [
        "Google Analytics",
        "Heatmaps",
        "A/B Testing",
        "Funnel de conversión",
        "Informes personalizados",
      ],
      highlight: false,
    },
    {
      icon: <Search className="h-10 w-10 text-black" />,
      title: "SEO Técnico",
      description:
        "Optimización técnica de tu sitio web para mejorar su posicionamiento en los motores de búsqueda.",
      features: [
        "Auditoría SEO",
        "Optimización de velocidad",
        "Estructura de datos",
        "Mobile-first",
        "Core Web Vitals",
      ],
      highlight: true,
    },
  ];

  const highlightedServices = [
    {
      title: "Desarrollo Full Stack",
      description:
        "Soluciones completas desde el frontend hasta el backend, con arquitecturas modernas y escalables.",
      icon: <Server className="h-16 w-16 text-black" />,
      features: [
        "Arquitectura de microservicios",
        "APIs RESTful y GraphQL",
        "Integración continua y despliegue",
        "Testing automatizado",
        "Monitorización y logging",
      ],
    },
    {
      title: "Diseño UI/UX",
      description:
        "Creación de interfaces intuitivas y experiencias de usuario excepcionales que convierten visitantes en clientes.",
      icon: <Layout className="h-16 w-16 text-black" />,
      features: [
        "Wireframing y prototipos",
        "Diseño responsive",
        "Sistemas de diseño",
        "Animaciones e interacciones",
        "Accesibilidad (WCAG)",
      ],
    },
    {
      title: "Optimización de Rendimiento",
      description:
        "Mejora de la velocidad y eficiencia de aplicaciones web existentes para una experiencia de usuario óptima.",
      icon: <Zap className="h-16 w-16 text-black" />,
      features: [
        "Análisis de Core Web Vitals",
        "Optimización de carga",
        "Code splitting y lazy loading",
        "Optimización de imágenes y assets",
        "Caché y estrategias de servicio",
      ],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Simplificamos las variantes para evitar conflictos en móvil
  const highlightVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.15, // Reducir delays
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="w-full h-full flex flex-col items-start justify-start py-20 px-4 sm:px-6 md:px-16 overflow-y-auto">
      <CosmicBackground />

      <motion.div
        className="w-full max-w-4xl mx-auto z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="mb-16" variants={item}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-black">
            Servicios
          </h2>
          <p className="text-black/70">
            Ofrezco soluciones digitales completas adaptadas a las necesidades
            específicas de cada proyecto, combinando tecnología de vanguardia
            con estrategias efectivas.
          </p>
        </motion.div>

        <motion.div className="mb-24" variants={item}>
          <h3 className="text-2xl font-bold mb-8 font-playfair text-black">
            Servicios Destacados
          </h3>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            ref={containerRef}
          >
            {highlightedServices.map((service, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={highlightVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative"
                // Agregamos layout para evitar re-renders problemáticos
                layout={false}
              >
                <Card className="h-full border border-black/10  aaaa/80 backdrop-blur-sm hover: aaaa transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 text-black">
                  <CardHeader className="pb-4">
                    <div className="mb-4 p-3 bg-black/5 rounded-lg w-fit">
                      <div className="text-black">{service.icon}</div>
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base text-black/70">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-black shrink-0 mt-0.5" />
                          <span className="text-sm text-black/80">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="link"
                      className="mt-4 p-0 h-auto text-black"
                    >
                      Más información <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="text-2xl font-bold mb-8 font-playfair text-black">
            Todos los Servicios
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setActiveService(index)}
                onMouseLeave={() => setActiveService(null)}
                // Deshabilitamos layout para evitar re-renders
                layout={false}
              >
                <Card
                  className={`h-full border transition-all duration-300 text-black ${
                    service.highlight
                      ? "border-black/20 bg-[#e1dbd6]/30"
                      : "border-black/10  aaaa/70 backdrop-blur-sm"
                  } ${activeService === index ? "shadow-md" : ""}`}
                >
                  <CardHeader>
                    <div className="mb-4 text-black">{service.icon}</div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {service.title}
                      {service.highlight && (
                        <Badge
                          variant="default"
                          className="ml-2 bg-black/10 text-black"
                        >
                          Popular
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-black/70 mb-4">
                      {service.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-black/5 text-black"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {service.features.length > 3 && (
                        <Badge
                          variant="outline"
                          className="border-black/10 text-black"
                        >
                          +{service.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
