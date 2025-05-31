"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function AboutShape({
  className,
  delay = 0,
  width = 300,
  height = 300,
  rotate = 0,
  gradient = "from-[#e1dbd6]/[0.3]",
  shape = "rectangle",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  shape?:
    | "rectangle"
    | "square"
    | "circle"
    | "triangle"
    | "hexagon"
    | "diamond"
    | "oval";
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -50,
        rotate: rotate - 10,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
        scale: 1,
      }}
      transition={{
        duration: 2.0,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [rotate, rotate + 3, rotate],
        }}
        transition={{
          duration: 18,
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
            shape === "circle"
              ? "rounded-full"
              : shape === "square"
              ? "rounded-md"
              : shape === "oval"
              ? "rounded-full"
              : "rounded-sm",
            "bg-gradient-to-br to-transparent",
            gradient,
            "backdrop-blur-[1px] border border-black/[0.08]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]"
          )}
          style={
            shape === "triangle"
              ? {
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }
              : shape === "hexagon"
              ? {
                  clipPath:
                    "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                }
              : shape === "diamond"
              ? {
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }
              : shape === "oval"
              ? {
                  transform: "scaleX(1.5)",
                }
              : {}
          }
        />
      </motion.div>
    </motion.div>
  );
}

function AnimatedGrid() {
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

    const lightColors = [
      "rgba(209, 209, 209, 0.4)",
      "rgba(225, 219, 214, 0.4)",
      "rgba(226, 226, 226, 0.4)",
      "rgba(249, 246, 242, 0.4)",
      "rgba(240, 240, 240, 0.4)",
    ];

    const particles = [];
    const floatingElements = [];
    const connections = [];

    // Más partículas
    for (let i = 0; i < 80; i++) {
      // Aumentado significativamente
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: Math.random() * 0.25 - 0.125,
        speedY: Math.random() * 0.25 - 0.125,
        opacity: Math.random() * 0.3 + 0.1,
        color: lightColors[Math.floor(Math.random() * lightColors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Elementos flotantes geométricos
    for (let i = 0; i < 20; i++) {
      floatingElements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 15,
        speedX: Math.random() * 0.1 - 0.05,
        speedY: Math.random() * 0.1 - 0.05,
        opacity: Math.random() * 0.08 + 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.002 - 0.001,
        type: Math.floor(Math.random() * 6), // 6 tipos diferentes
        scale: Math.random() * 0.5 + 0.5,
      });
    }

    // Conexiones entre partículas
    for (let i = 0; i < 15; i++) {
      connections.push({
        start: Math.floor(Math.random() * particles.length),
        end: Math.floor(Math.random() * particles.length),
        opacity: Math.random() * 0.1 + 0.02,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const drawFloatingElement = (element) => {
      ctx.save();
      ctx.translate(element.x, element.y);
      ctx.rotate(element.rotation);
      ctx.scale(element.scale, element.scale);
      ctx.globalAlpha = element.opacity;

      const halfSize = Math.max(0.1, element.size / 2);

      switch (element.type) {
        case 0: // círculo
          ctx.beginPath();
          ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(120, 120, 120, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        case 1: // cuadrado
          ctx.strokeStyle = "rgba(130, 130, 130, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-halfSize, -halfSize, element.size, element.size);
          break;
        case 2: // triángulo
          ctx.beginPath();
          ctx.moveTo(0, -halfSize);
          ctx.lineTo(-halfSize, halfSize);
          ctx.lineTo(halfSize, halfSize);
          ctx.closePath();
          ctx.strokeStyle = "rgba(110, 110, 110, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        case 3: // hexágono
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * halfSize;
            const y = Math.sin(angle) * halfSize;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = "rgba(140, 140, 140, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        case 4: // diamante
          ctx.beginPath();
          ctx.moveTo(0, -halfSize);
          ctx.lineTo(halfSize, 0);
          ctx.lineTo(0, halfSize);
          ctx.lineTo(-halfSize, 0);
          ctx.closePath();
          ctx.strokeStyle = "rgba(150, 150, 150, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        case 5: // estrella
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const radius = i % 2 === 0 ? halfSize : halfSize * 0.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = "rgba(160, 160, 160, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    const drawGrid = (time: number) => {
      // Grid principal
      const gridSize = 50;
      const lineWidth = 0.5;
      const baseOpacity = 0.04;

      // Líneas horizontales
      for (let y = 0; y < canvas.height; y += gridSize) {
        const opacity = baseOpacity + Math.sin(y * 0.01 + time * 0.5) * 0.02;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // Líneas verticales
      for (let x = 0; x < canvas.width; x += gridSize) {
        const opacity = baseOpacity + Math.sin(x * 0.01 + time * 0.3) * 0.02;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // Puntos en intersecciones
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const distance = Math.sqrt(
            Math.pow((x - canvas.width / 2) / canvas.width, 2) +
              Math.pow((y - canvas.height / 2) / canvas.height, 2)
          );

          const size = Math.max(
            0.5,
            1.5 + Math.sin(distance * 12 + time * 2) * 0.8
          );
          const opacity = 0.15 + Math.sin(distance * 10 + time) * 0.08;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
          ctx.fill();
        }
      }
    };

    let animationId: number;
    const animate = () => {
      const time = Date.now() * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid animado
      drawGrid(time);

      // Conexiones entre partículas
      connections.forEach((connection) => {
        const startParticle = particles[connection.start];
        const endParticle = particles[connection.end];
        const distance = Math.sqrt(
          Math.pow(startParticle.x - endParticle.x, 2) +
            Math.pow(startParticle.y - endParticle.y, 2)
        );

        if (distance < 150) {
          // Solo conectar partículas cercanas
          const opacity =
            connection.opacity * (1 - distance / 150) +
            Math.sin(connection.pulse + time) * 0.02;
          connection.pulse += 0.02;

          ctx.beginPath();
          ctx.moveTo(startParticle.x, startParticle.y);
          ctx.lineTo(endParticle.x, endParticle.y);
          ctx.strokeStyle = `rgba(180, 180, 180, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // Partículas mejoradas
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += particle.pulseSpeed;

        // Rebote en bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        const pulseSize = Math.max(
          0.1,
          particle.size + Math.sin(particle.pulse) * 0.8
        );
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.1;

        ctx.save();
        ctx.globalAlpha = pulseOpacity;
        ctx.shadowBlur = 4;
        ctx.shadowColor = particle.color;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        ctx.restore();
      });

      // Elementos flotantes
      floatingElements.forEach((element) => {
        element.x += element.speedX;
        element.y += element.speedY;
        element.rotation += element.rotationSpeed;

        if (element.x < -50) element.x = canvas.width + 50;
        if (element.x > canvas.width + 50) element.x = -50;
        if (element.y < -50) element.y = canvas.height + 50;
        if (element.y > canvas.height + 50) element.y = -50;

        drawFloatingElement(element);
      });

      // Ondas concéntricas múltiples
      const centers = [
        { x: canvas.width * 0.3, y: canvas.height * 0.2 },
        { x: canvas.width * 0.7, y: canvas.height * 0.8 },
        { x: canvas.width * 0.8, y: canvas.height * 0.3 },
      ];

      centers.forEach((center, centerIndex) => {
        for (let i = 0; i < 4; i++) {
          const radius = Math.max(
            0.1,
            (time * 30 + i * 80 + centerIndex * 40) % 300
          );
          const opacity = Math.max(0, 0.1 - radius / 3000);

          ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Líneas de flujo
      for (let i = 0; i < 5; i++) {
        const offset = time * 25 + i * 200;
        const y = (offset % (canvas.height + 400)) - 200;
        const gradient = ctx.createLinearGradient(0, y, canvas.width, y);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.5, `rgba(190, 190, 190, ${0.06 - i * 0.01})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

export function AboutBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base background */}
      <div className="absolute inset-0  aaaa" />

      {/* Grid animado mejorado */}
      <AnimatedGrid />

      {/* Muchas más formas geométricas */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Formas principales */}
        <AboutShape
          delay={0.2}
          width={500}
          height={200}
          rotate={10}
          gradient="from-[#e1dbd6]/[0.4]"
          shape="rectangle"
          className="left-[-10%] top-[10%]"
        />
        <AboutShape
          delay={0.4}
          width={300}
          height={300}
          rotate={-15}
          gradient="from-[#d1d1d1]/[0.3]"
          shape="square"
          className="right-[-5%] top-[60%]"
        />
        <AboutShape
          delay={0.6}
          width={250}
          height={250}
          rotate={25}
          gradient="from-[#e2e2e2]/[0.35]"
          shape="circle"
          className="left-[20%] bottom-[-10%]"
        />
        <AboutShape
          delay={0.8}
          width={180}
          height={120}
          rotate={-5}
          gradient="from-[#d1d1d1]/[0.25]"
          shape="rectangle"
          className="right-[15%] top-[20%]"
        />

        {/* Formas adicionales */}
        <AboutShape
          delay={1.0}
          width={350}
          height={350}
          rotate={35}
          gradient="from-[#e1dbd6]/[0.3]"
          shape="hexagon"
          className="left-[40%] top-[5%]"
        />
        <AboutShape
          delay={1.2}
          width={220}
          height={160}
          rotate={-25}
          gradient="from-[#e2e2e2]/[0.3]"
          shape="oval"
          className="right-[30%] top-[40%]"
        />
        <AboutShape
          delay={1.4}
          width={280}
          height={280}
          rotate={50}
          gradient="from-[#d1d1d1]/[0.25]"
          shape="diamond"
          className="left-[60%] bottom-[20%]"
        />
        <AboutShape
          delay={1.6}
          width={200}
          height={200}
          rotate={-40}
          gradient="from-[#f9f6f2]/[0.25]"
          shape="triangle"
          className="right-[50%] bottom-[5%]"
        />
        <AboutShape
          delay={1.8}
          width={160}
          height={160}
          rotate={70}
          gradient="from-[#e1dbd6]/[0.2]"
          shape="circle"
          className="left-[10%] top-[50%]"
        />
        <AboutShape
          delay={2.0}
          width={240}
          height={180}
          rotate={-10}
          gradient="from-[#e2e2e2]/[0.2]"
          shape="rectangle"
          className="right-[70%] top-[70%]"
        />
        <AboutShape
          delay={2.2}
          width={190}
          height={190}
          rotate={30}
          gradient="from-[#d1d1d1]/[0.2]"
          shape="hexagon"
          className="left-[80%] bottom-[40%]"
        />
        <AboutShape
          delay={2.4}
          width={150}
          height={100}
          rotate={-55}
          gradient="from-[#f9f6f2]/[0.2]"
          shape="oval"
          className="right-[10%] bottom-[60%]"
        />
      </div>

      {/* Efectos de luz mejorados */}
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] rounded-full bg-[#e1dbd6]/[0.2] blur-3xl" />
      <div className="absolute bottom-[15%] left-[15%] w-[250px] h-[250px] rounded-full bg-[#d1d1d1]/[0.15] blur-3xl" />
      <div className="absolute top-[60%] left-[60%] w-[200px] h-[200px] rounded-full bg-[#e2e2e2]/[0.12] blur-3xl" />
      <div className="absolute bottom-[50%] right-[40%] w-[180px] h-[180px] rounded-full  aaaa/[0.1] blur-3xl" />

      {/* Gradientes sutiles para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f9f6f2]/70 via-transparent to-[#f9f6f2]/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f9f6f2]/30 via-transparent to-[#f9f6f2]/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9f6f2]/20 via-transparent to-[#f9f6f2]/20 pointer-events-none" />
    </motion.div>
  );
}
