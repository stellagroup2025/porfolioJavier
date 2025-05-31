"use client";

import { motion } from "framer-motion";
import { Pacifico } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
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
            "backdrop-blur-[2px] border border-white/[0.05]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
            "after:absolute after:inset-0",
            shape === "triangle" ? "after:triangle-shape" : "after:rounded-sm",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"
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
      type: "triangle" | "square";
    }[] = [];

    // Create particles
    const createParticles = () => {
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1 + 0.5,
          speedX: Math.random() * 0.15 - 0.075,
          speedY: Math.random() * 0.15 - 0.075,
          opacity: Math.random() * 0.1 + 0.03,
          color: lightColors[Math.floor(Math.random() * lightColors.length)],
        });
      }

      // Create geometric shapes - triangles and rectangles only
      for (let i = 0; i < 6; i++) {
        const shapeTypes: ("triangle" | "square")[] = ["triangle", "square"];
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 30 + 15,
          speedX: Math.random() * 0.08 - 0.04,
          speedY: Math.random() * 0.08 - 0.04,
          opacity: Math.random() * 0.06 + 0.02,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: Math.random() * 0.001 - 0.0005,
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
      } else {
        ctx.strokeStyle = "rgba(120, 120, 120, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          -shape.size / 2,
          -shape.size / 2,
          shape.size,
          shape.size
        );
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Extremely subtle diagonal lines
      for (let i = 0; i < 2; i++) {
        const offset = time * 15 + i * 500;
        const x1 = (offset % (canvas.width + 800)) - 400;
        const y1 = 0;
        const x2 = x1 + canvas.height * 0.4;
        const y2 = canvas.height;

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.5, `rgba(200, 200, 200, ${0.05 - i * 0.01})`);
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
        ctx.shadowBlur = 2;
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

      // Barely perceptible pulsing effect
      const pulseIntensity = Math.sin(time * 0.8) * 0.008 + 0.008;
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
        `rgba(220, 220, 220, ${pulseIntensity * 0.5})`
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

export default function HeroGeometric({
  badge = "Kokonut UI",
  title1 = "Elevate Your",
  title2 = "Digital Vision",
  showContent = true,
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  showContent?: boolean;
}) {
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

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#ffffff]">
      {/* Base geometric background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/geometric-background.png"
          alt="Geometric gradient background"
          fill
          style={{ objectFit: "cover", opacity: 0.08 }}
          priority
        />
      </div>

      {/* Light overlay */}
      <div className="absolute inset-0 z-1  aaaa opacity-90" />

      {/* Animated canvas */}
      <AnimatedCanvas />

      {/* Ultra subtle gradient overlay */}
      <div className="absolute inset-0 z-2 bg-gradient-to-br from-[#e1dbd6]/[0.1] via-transparent to-[#d1d1d1]/[0.1] blur-3xl" />

      {/* Geometric shapes overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-[#d1d1d1]/[0.25]"
          shape="rectangle"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-[#e1dbd6]/[0.25]"
          shape="triangle"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-[#e2e2e2]/[0.25]"
          shape="rectangle"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-[#d1d1d1]/[0.25]"
          shape="triangle"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-[#e2e2e2]/[0.25]"
          shape="rectangle"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Content */}
      {showContent && (
        <div className="relative z-20 container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.05] border border-black/[0.1] mb-8 md:mb-12"
            >
              <span className="text-sm text-black/60 tracking-wide">
                {badge}
              </span>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-black/90 to-black/70">
                  {title1}
                </span>
                <br />
                <span
                  className={cn(
                    "bg-clip-text text-transparent bg-gradient-to-r from-black/80 via-black/90 to-black/80",
                    pacifico.className
                  )}
                >
                  {title2}
                </span>
              </h1>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-base sm:text-lg md:text-xl text-black/60 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                Crafting exceptional digital experiences through innovative
                design and cutting-edge technology.
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Bottom gradient */}
      <div className="absolute inset-0 z-15 bg-gradient-to-t from-[#ffffff] via-transparent to-[#ffffff]/60 pointer-events-none" />
    </div>
  );
}
