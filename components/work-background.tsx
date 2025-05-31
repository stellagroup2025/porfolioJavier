"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function WorkShape({
  className,
  delay = 0,
  width = 300,
  height = 300,
  rotate = 0,
  gradient = "from-[#d1d1d1]/[0.3]",
  shape = "circle",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  shape?: "circle" | "square" | "triangle" | "hexagon" | "diamond";
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -100,
        rotate: rotate - 20,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
        scale: 1,
      }}
      transition={{
        duration: 2.5,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [rotate, rotate + 5, rotate],
        }}
        transition={{
          duration: 15,
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
              ? "rounded-lg"
              : shape === "hexagon"
              ? "rounded-lg"
              : shape === "diamond"
              ? "rounded-lg"
              : "",
            "bg-gradient-to-br to-transparent",
            gradient,
            "backdrop-blur-[1px] border-2 border-black/[0.12]",
            "shadow-[0_12px_40px_0_rgba(0,0,0,0.08)]"
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
              : {}
          }
        />
      </motion.div>
    </motion.div>
  );
}

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

    const lightColors = [
      "rgba(209, 209, 209, 0.4)",
      "rgba(225, 219, 214, 0.4)",
      "rgba(226, 226, 226, 0.4)",
      "rgba(249, 246, 242, 0.4)",
    ];

    const particles = [];
    const lines = [];
    const floatingShapes = [];

    // Más partículas
    for (let i = 0; i < 60; i++) {
      // Aumentado de 40 a 60
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        color: lightColors[Math.floor(Math.random() * lightColors.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Más líneas
    for (let i = 0; i < 8; i++) {
      // Aumentado de 5 a 8
      lines.push({
        x1: -200,
        y1: Math.random() * canvas.height,
        x2: canvas.width + 200,
        y2: Math.random() * canvas.height,
        opacity: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    // Formas flotantes adicionales
    for (let i = 0; i < 15; i++) {
      // Nuevas formas flotantes
      floatingShapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 50 + 20,
        speedX: Math.random() * 0.15 - 0.075,
        speedY: Math.random() * 0.15 - 0.075,
        opacity: Math.random() * 0.1 + 0.03,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.003 - 0.0015,
        type: Math.floor(Math.random() * 4), // 0: circle, 1: square, 2: triangle, 3: diamond
      });
    }

    const drawFloatingShape = (shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;

      const halfSize = shape.size / 2;

      switch (shape.type) {
        case 0: // circle
          ctx.beginPath();
          ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(150, 150, 150, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        case 1: // square
          ctx.strokeStyle = "rgba(140, 140, 140, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-halfSize, -halfSize, shape.size, shape.size);
          break;
        case 2: // triangle
          ctx.beginPath();
          ctx.moveTo(0, -halfSize);
          ctx.lineTo(-halfSize, halfSize);
          ctx.lineTo(halfSize, halfSize);
          ctx.closePath();
          ctx.strokeStyle = "rgba(130, 130, 130, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        case 3: // diamond
          ctx.beginPath();
          ctx.moveTo(0, -halfSize);
          ctx.lineTo(halfSize, 0);
          ctx.lineTo(0, halfSize);
          ctx.lineTo(-halfSize, 0);
          ctx.closePath();
          ctx.strokeStyle = "rgba(160, 160, 160, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Líneas diagonales mejoradas
      lines.forEach((line) => {
        const offset = time * line.speed * 60;
        const gradient = ctx.createLinearGradient(
          line.x1,
          line.y1,
          line.x2,
          line.y2
        );
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.5, `rgba(180, 180, 180, ${line.opacity})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(line.x1 + (offset % (canvas.width + 400)), line.y1);
        ctx.lineTo(line.x2 + (offset % (canvas.width + 400)), line.y2);
        ctx.stroke();
      });

      // Partículas mejoradas
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += 0.03;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.8;
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.15;

        ctx.save();
        ctx.globalAlpha = pulseOpacity;
        ctx.shadowBlur = 5;
        ctx.shadowColor = particle.color;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        ctx.restore();
      });

      // Formas flotantes
      floatingShapes.forEach((shape) => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        if (shape.x < -50) shape.x = canvas.width + 50;
        if (shape.x > canvas.width + 50) shape.x = -50;
        if (shape.y < -50) shape.y = canvas.height + 50;
        if (shape.y > canvas.height + 50) shape.y = -50;

        drawFloatingShape(shape);
      });

      // Ondas concéntricas mejoradas
      const centerX = canvas.width * 0.7;
      const centerY = canvas.height * 0.3;
      for (let i = 0; i < 5; i++) {
        // Aumentado de 3 a 5
        const radius = (time * 40 + i * 120) % 400;
        const opacity = Math.max(0, 0.15 - radius / 2500);

        ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Segundo centro de ondas
      const centerX2 = canvas.width * 0.2;
      const centerY2 = canvas.height * 0.7;
      for (let i = 0; i < 4; i++) {
        const radius = (time * 35 + i * 100) % 350;
        const opacity = Math.max(0, 0.12 - radius / 2800);

        ctx.strokeStyle = `rgba(190, 190, 190, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX2, centerY2, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Grid sutil
      const gridSize = 80;
      const gridOpacity = 0.03 + Math.sin(time * 0.5) * 0.01;
      ctx.strokeStyle = `rgba(0, 0, 0, ${gridOpacity})`;
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

export function WorkBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0  aaaa" />

      <AnimatedCanvas />

      {/* Muchas más formas geométricas */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Formas principales */}
        <WorkShape
          delay={0.2}
          width={400}
          height={400}
          rotate={15}
          gradient="from-[#d1d1d1]/[0.3]"
          shape="circle"
          className="left-[-15%] top-[-10%]"
        />
        <WorkShape
          delay={0.4}
          width={300}
          height={300}
          rotate={-20}
          gradient="from-[#e1dbd6]/[0.3]"
          shape="square"
          className="right-[-10%] top-[60%]"
        />
        <WorkShape
          delay={0.6}
          width={250}
          height={250}
          rotate={45}
          gradient="from-[#e2e2e2]/[0.3]"
          shape="triangle"
          className="left-[5%] bottom-[-5%]"
        />

        {/* Formas adicionales */}
        <WorkShape
          delay={0.8}
          width={350}
          height={350}
          rotate={-30}
          gradient="from-[#d1d1d1]/[0.25]"
          shape="hexagon"
          className="right-[20%] top-[20%]"
        />
        <WorkShape
          delay={1.0}
          width={200}
          height={200}
          rotate={60}
          gradient="from-[#e1dbd6]/[0.25]"
          shape="diamond"
          className="left-[30%] top-[40%]"
        />
        <WorkShape
          delay={1.2}
          width={180}
          height={180}
          rotate={-45}
          gradient="from-[#e2e2e2]/[0.25]"
          shape="circle"
          className="right-[40%] bottom-[30%]"
        />
        <WorkShape
          delay={1.4}
          width={280}
          height={280}
          rotate={25}
          gradient="from-[#f9f6f2]/[0.25]"
          shape="square"
          className="left-[60%] top-[10%]"
        />
        <WorkShape
          delay={1.6}
          width={160}
          height={160}
          rotate={-60}
          gradient="from-[#d1d1d1]/[0.2]"
          shape="triangle"
          className="right-[60%] top-[70%]"
        />
        <WorkShape
          delay={1.8}
          width={220}
          height={220}
          rotate={40}
          gradient="from-[#e1dbd6]/[0.2]"
          shape="hexagon"
          className="left-[40%] bottom-[40%]"
        />
        <WorkShape
          delay={2.0}
          width={140}
          height={140}
          rotate={-15}
          gradient="from-[#e2e2e2]/[0.2]"
          shape="diamond"
          className="right-[25%] bottom-[10%]"
        />
      </div>

      {/* Efectos de luz mejorados */}
      <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#d1d1d1]/[0.15] blur-3xl" />
      <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#e1dbd6]/[0.15] blur-3xl" />
      <div className="absolute top-[50%] left-[50%] w-[250px] h-[250px] rounded-full bg-[#e2e2e2]/[0.1] blur-3xl" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#f9f6f2]/80 via-transparent to-[#f9f6f2]/60 pointer-events-none" />
    </motion.div>
  );
}
