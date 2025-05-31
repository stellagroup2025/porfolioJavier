"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Projects() {
  const projects = [
    {
      title: "E-commerce Platform",
      description:
        "Plataforma de comercio electrónico con gestión de inventario y pagos integrados.",
      image: "/modern-ecommerce-website.png",
      tags: ["Next.js", "Tailwind CSS", "Stripe"],
      link: "#",
    },
    {
      title: "Dashboard Analytics",
      description:
        "Panel de control para visualización de datos y métricas empresariales en tiempo real.",
      image: "/data-analytics-dashboard.png",
      tags: ["React", "D3.js", "Firebase"],
      link: "#",
    },
    {
      title: "Mobile App",
      description:
        "Aplicación móvil para gestión de tareas y productividad personal.",
      image: "/mobile-app-interface.png",
      tags: ["React Native", "Redux", "Node.js"],
      link: "#",
    },
    {
      title: "AI Content Generator",
      description:
        "Herramienta de generación de contenido utilizando inteligencia artificial.",
      image: "/ai-content-generator.png",
      tags: ["Python", "TensorFlow", "OpenAI"],
      link: "#",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-20 px-6 overflow-y-auto  aaaa">
      <motion.div
        className="max-w-6xl w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="text-center mb-16" variants={item}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-black">
            Proyectos
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto">
            Una selección de mis trabajos más recientes y destacados.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={item}>
              <Card className="overflow-hidden border-0 bg-transparent">
                <div className="relative overflow-hidden aspect-video rounded-lg mb-4 group">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <motion.a
                      href={project.link}
                      className="p-3 bg-primary rounded-full text-primary-foreground"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowUpRight size={20} />
                    </motion.a>
                  </div>
                </div>
                <CardContent className="px-0">
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {project.title}
                  </h3>
                  <p className="text-black/70 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-[#e1dbd6] text-black"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
