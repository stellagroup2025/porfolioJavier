"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Coffee,
  Sparkles,
  Palette,
} from "lucide-react";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

// Componente para formas cósmicas circulares
function CosmicShape({
  className,
  delay = 0,
  width = 400,
  height = 400,
  rotate = 0,
  gradient = "from-[#d1d1d1]/[0.2]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-black/[0.08]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// Componente para formas geométricas elegantes
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-black/[0.08]",
  shape = "rectangle",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  shape?: "rectangle" | "triangle";
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0",
            shape === "triangle" ? "triangle-shape" : "rounded-sm",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-black/[0.05]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]",
            "after:absolute after:inset-0",
            shape === "triangle" ? "after:triangle-shape" : "after:rounded-sm",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)]"
          )}
          style={
            shape === "triangle"
              ? {
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }
              : {}
          }
        />
      </motion.div>
    </motion.div>
  );
}

// Componente para partículas minimalistas
function MinimalParticle({
  className,
  delay = 0,
  size = 4,
  duration = 20,
}: {
  className?: string;
  delay?: number;
  size?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        opacity: [0, 0.5, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={cn("absolute rounded-full bg-black/10", className)}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

// Canvas animado con muchas más figuras
function AnimatedCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Light color palette
    const lightColors = [
      "rgba(209, 209, 209, 0.3)",
      "rgba(225, 219, 214, 0.3)",
      "rgba(226, 226, 226, 0.3)",
      "rgba(249, 246, 242, 0.3)",
      "rgba(240, 240, 240, 0.3)",
    ];

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }[] = [];

    const shapes: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      type: "triangle" | "square" | "circle";
    }[] = [];

    // Create more particles
    const createParticles = () => {
      const particleCount = 50; // Aumentado de 30 a 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: Math.random() * 0.2 - 0.1,
          opacity: Math.random() * 0.15 + 0.05,
          color: lightColors[Math.floor(Math.random() * lightColors.length)],
        });
      }

      // Create more geometric shapes
      for (let i = 0; i < 12; i++) {
        // Aumentado de 6 a 12
        const shapeTypes: ("triangle" | "square" | "circle")[] = [
          "triangle",
          "square",
          "circle",
        ];
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 40 + 20,
          speedX: Math.random() * 0.1 - 0.05,
          speedY: Math.random() * 0.1 - 0.05,
          opacity: Math.random() * 0.08 + 0.03,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: Math.random() * 0.002 - 0.001,
          type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        });
      }
    };

    createParticles();

    // Draw geometric shape
    const drawShape = (shape: (typeof shapes)[0]) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;

      if (shape.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(0, -shape.size / 2);
        ctx.lineTo(-shape.size / 2, shape.size / 2);
        ctx.lineTo(shape.size / 2, shape.size / 2);
        ctx.closePath();
        ctx.strokeStyle = "rgba(100, 100, 100, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (shape.type === "square") {
        ctx.strokeStyle = "rgba(120, 120, 120, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          -shape.size / 2,
          -shape.size / 2,
          shape.size,
          shape.size
        );
      } else {
        // circle
        ctx.beginPath();
        ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(110, 110, 110, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // More diagonal lines
      for (let i = 0; i < 4; i++) {
        // Aumentado de 2 a 4
        const offset = time * 20 + i * 400;
        const x1 = (offset % (canvas.width + 800)) - 400;
        const y1 = 0;
        const x2 = x1 + canvas.height * 0.5;
        const y2 = canvas.height;

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.5, `rgba(200, 200, 200, ${0.08 - i * 0.015})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.shadowBlur = 3;
        ctx.shadowColor = particle.color;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        ctx.restore();
      });

      // Update and draw geometric shapes
      shapes.forEach((shape) => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        if (shape.x < -50) shape.x = canvas.width + 50;
        if (shape.x > canvas.width + 50) shape.x = -50;
        if (shape.y < -50) shape.y = canvas.height + 50;
        if (shape.y > canvas.height + 50) shape.y = -50;

        drawShape(shape);
      });

      // Enhanced pulsing effect
      const pulseIntensity = Math.sin(time * 1.2) * 0.012 + 0.012;
      const centerGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );

      centerGradient.addColorStop(0, `rgba(200, 200, 200, ${pulseIntensity})`);
      centerGradient.addColorStop(
        0.5,
        `rgba(220, 220, 220, ${pulseIntensity * 0.6})`
      );
      centerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-5"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}

// Fondo geométrico con muchas más figuras
export function GeometricBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 -z-10"
    >
      <div className="absolute inset-0 bg-[#ffffff]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#e1dbd6]/[0.15] via-transparent to-[#d1d1d1]/[0.15] blur-3xl" />

      {/* Canvas animado con muchas figuras */}
      <AnimatedCanvas />

      {/* Muchas más formas geométricas */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Formas principales */}
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-[#d1d1d1]/[0.25]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-[#e1dbd6]/[0.25]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-[#e2e2e2]/[0.25]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-[#f9f6f2]/[0.25]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-[#d1d1d1]/[0.25]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />

        {/* Formas adicionales */}
        <ElegantShape
          delay={0.8}
          width={400}
          height={100}
          rotate={35}
          gradient="from-[#e1dbd6]/[0.2]"
          shape="triangle"
          className="right-[30%] top-[40%]"
        />
        <ElegantShape
          delay={0.9}
          width={250}
          height={70}
          rotate={-30}
          gradient="from-[#e2e2e2]/[0.2]"
          className="left-[40%] top-[60%]"
        />
        <ElegantShape
          delay={1.0}
          width={180}
          height={50}
          rotate={45}
          gradient="from-[#d1d1d1]/[0.2]"
          shape="triangle"
          className="left-[60%] bottom-[30%]"
        />
        <ElegantShape
          delay={1.1}
          width={320}
          height={90}
          rotate={-10}
          gradient="from-[#f9f6f2]/[0.2]"
          className="right-[40%] bottom-[20%]"
        />
        <ElegantShape
          delay={1.2}
          width={120}
          height={35}
          rotate={60}
          gradient="from-[#e1dbd6]/[0.2]"
          shape="triangle"
          className="left-[30%] top-[25%]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-transparent to-[#ffffff]/80 pointer-events-none" />
    </motion.div>
  );
}

// Resto de componentes sin cambios...
export function CosmicBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 -z-10"
    >
      {/* Base background image */}
      <div className="absolute inset-0 z-0  aaaa">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(225,219,214,0.3),rgba(249,246,242,1)_80%)]"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e1dbd6]/[0.1] via-transparent to-[#d1d1d1]/[0.1] blur-3xl" />

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <CosmicShape
          delay={0.3}
          width={500}
          height={500}
          rotate={5}
          gradient="from-[#d1d1d1]/[0.2]"
          className="left-[-10%] top-[-10%]"
        />
        <CosmicShape
          delay={0.5}
          width={600}
          height={600}
          rotate={-8}
          gradient="from-[#e1dbd6]/[0.2]"
          className="right-[-15%] bottom-[-15%]"
        />
        <CosmicShape
          delay={0.4}
          width={100}
          height={400}
          rotate={0}
          gradient="from-[#e2e2e2]/[0.2]"
          className="right-[10%] top-[20%]"
        />
        <CosmicShape
          delay={0.6}
          width={200}
          height={200}
          rotate={20}
          gradient="from-[#d1d1d1]/[0.2]"
          className="right-[25%] top-[15%]"
        />
        <CosmicShape
          delay={0.7}
          width={150}
          height={150}
          rotate={-15}
          gradient="from-[#e2e2e2]/[0.2]"
          className="left-[20%] bottom-[20%]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#f9f6f2] via-transparent to-[#f9f6f2] pointer-events-none" />
    </motion.div>
  );
}

export function MinimalBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 -z-10"
    >
      {/* Base background */}
      <div className="absolute inset-0 z-0 bg-[#ffffff]"></div>

      {/* Subtle particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <MinimalParticle
            key={i}
            delay={i * 0.3}
            size={Math.random() * 6 + 2}
            duration={Math.random() * 20 + 15}
            className={`left-[${Math.random() * 100}%] top-[${
              Math.random() * 100
            }%]`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Subtle light effect */}
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#d1d1d1]/[0.2] blur-3xl" />
      <div className="absolute bottom-[10%] left-[10%] w-[200px] h-[200px] rounded-full bg-[#e1dbd6]/[0.2] blur-3xl" />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-transparent to-[#ffffff]/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff]/50 via-transparent to-[#ffffff]/50 pointer-events-none" />
    </motion.div>
  );
}

export default function MultiBackground() {
  const [currentBackground, setCurrentBackground] = useState<
    "cosmic" | "geometric" | "minimal"
  >("cosmic");

  const nextBackground = () => {
    setCurrentBackground((prev) => {
      if (prev === "cosmic") return "geometric";
      if (prev === "geometric") return "minimal";
      return "cosmic";
    });
  };

  const prevBackground = () => {
    setCurrentBackground((prev) => {
      if (prev === "cosmic") return "minimal";
      if (prev === "geometric") return "cosmic";
      return "geometric";
    });
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  const getBackgroundIcon = (type: "cosmic" | "geometric" | "minimal") => {
    switch (type) {
      case "cosmic":
        return <Sparkles className="w-4 h-4" />;
      case "geometric":
        return <Palette className="w-4 h-4" />;
      case "minimal":
        return <Coffee className="w-4 h-4" />;
    }
  };

  const getBackgroundTitle = (type: "cosmic" | "geometric" | "minimal") => {
    switch (type) {
      case "cosmic":
        return { main: "Explore The", accent: "Cosmos" };
      case "geometric":
        return { main: "Elevate Your", accent: "Digital Vision" };
      case "minimal":
        return { main: "Embrace", accent: "Simplicity" };
    }
  };

  const getBackgroundDescription = (
    type: "cosmic" | "geometric" | "minimal"
  ) => {
    switch (type) {
      case "cosmic":
        return "Journey through the celestial wonders of the universe with our immersive cosmic experience.";
      case "geometric":
        return "Crafting exceptional digital experiences through innovative design and cutting-edge technology.";
      case "minimal":
        return "Focus on what matters most with our clean, distraction-free minimal workspace environment.";
    }
  };

  const getBackgroundColor = (type: "cosmic" | "geometric" | "minimal") => {
    switch (type) {
      case "cosmic":
        return "bg-[#d1d1d1]";
      case "geometric":
        return "bg-[#e1dbd6]";
      case "minimal":
        return "bg-[#e2e2e2]";
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden  aaaa">
      <AnimatePresence mode="wait">
        {currentBackground === "cosmic" && <CosmicBackground key="cosmic" />}
        {currentBackground === "geometric" && (
          <GeometricBackground key="geometric" />
        )}
        {currentBackground === "minimal" && <MinimalBackground key="minimal" />}
      </AnimatePresence>

      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <motion.button
          onClick={prevBackground}
          className="group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/[0.05] border border-black/[0.1] backdrop-blur-md hover:bg-black/[0.08] transition-all duration-300">
            <ChevronLeft className="w-4 h-4 text-black/70" />
          </div>
        </motion.button>

        <motion.button
          onClick={nextBackground}
          className="group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/[0.05] border border-black/[0.1] backdrop-blur-md hover:bg-black/[0.08] transition-all duration-300">
            <ChevronRight className="w-4 h-4 text-black/70" />
          </div>
        </motion.button>
      </div>

      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08] backdrop-blur-md">
          <div className="flex gap-2">
            <motion.div
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentBackground === "cosmic"
                  ? getBackgroundColor("cosmic")
                  : "bg-black/30"
              )}
              animate={{
                scale: currentBackground === "cosmic" ? 1.2 : 1,
              }}
            />
            <motion.div
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentBackground === "geometric"
                  ? getBackgroundColor("geometric")
                  : "bg-black/30"
              )}
              animate={{
                scale: currentBackground === "geometric" ? 1.2 : 1,
              }}
            />
            <motion.div
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentBackground === "minimal"
                  ? getBackgroundColor("minimal")
                  : "bg-black/30"
              )}
              animate={{
                scale: currentBackground === "minimal" ? 1.2 : 1,
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-black/50 capitalize">
              {currentBackground}
            </span>
            <div className="text-black/50">
              {getBackgroundIcon(currentBackground)}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            key={`badge-${currentBackground}`}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.08] mb-8 md:mb-12"
          >
            <div className="text-black/60 mr-2">
              {getBackgroundIcon(currentBackground)}
            </div>
            <span className="text-sm text-black/60 tracking-wide capitalize">
              {currentBackground} Experience
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            key={`title-${currentBackground}`}
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-black to-black/80">
                {getBackgroundTitle(currentBackground).main}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent",
                  currentBackground === "cosmic"
                    ? "bg-gradient-to-r from-[#6b5b73] via-black/90 to-[#6b5b73]"
                    : currentBackground === "geometric"
                    ? "bg-gradient-to-r from-[#6b5b73] via-black/90 to-[#6b5b73]"
                    : "bg-gradient-to-r from-[#6b5b73] via-black/90 to-[#6b5b73]",
                  pacifico.className
                )}
              >
                {getBackgroundTitle(currentBackground).accent}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            key={`desc-${currentBackground}`}
          >
            <p className="text-base sm:text-lg md:text-xl text-black/60 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {getBackgroundDescription(currentBackground)}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
