"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Bot, Sparkles, Zap } from "lucide-react";

export function AI() {
  const aiServices = [
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Machine Learning",
      description:
        "Implementación de modelos de aprendizaje automático para resolver problemas complejos.",
    },
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: "Chatbots",
      description:
        "Desarrollo de asistentes virtuales inteligentes para mejorar la atención al cliente.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "Generación de Contenido",
      description:
        "Creación automática de textos, imágenes y otros contenidos mediante IA.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Automatización",
      description:
        "Optimización de procesos mediante sistemas inteligentes y automatizados.",
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
    <div className="w-full h-full flex flex-col items-center justify-center py-20 px-6  aaaa">
      <motion.div
        className="max-w-5xl w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="text-center mb-16" variants={item}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-black">
            Inteligencia Artificial
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto">
            Soluciones avanzadas basadas en IA para potenciar tu negocio.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {aiServices.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card className="border border-black/10 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-xl text-black">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-black/70">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
