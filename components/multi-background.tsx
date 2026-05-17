"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";
import { mousePositionRef } from "@/lib/mouse-light";
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
            "backdrop-blur-[2px] border-2 border-foreground/[0.08]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// Escala fluida 0.55..1.0 según ancho del viewport.
// 1920px y mayores → 1.0 (tamaños originales).
// MacBook Air (~1440px) → 0.75. iPad pro / 1024px → ~0.55.
function useViewportScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setScale(Math.min(1, Math.max(0.55, w / 1920)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

// Fragmento "tallado" en la figura. Cada figura puede mostrar una imagen
// distinta (planos arquitectónicos, diagramas software, ...) que se revela
// solo donde la luz del cursor incide — es invisible por defecto. La idea
// es que cada figura sea una pieza de identidad: arquitecto, diseñador,
// desarrollador, etc.
type EtchedFragment = {
  /** URL de la imagen a tallar. Default "/identity/blueprint.jpg". */
  url?: string;
  /** background-position X (ej: "20%", "-120px"). */
  x: string;
  /** background-position Y. */
  y: string;
  /** background-size (default "260%" → zoom en una zona pequeña). */
  size?: string;
  /** Modula la intensidad máxima de la talla (default 1.0). 0..1. */
  strength?: number;
};

// Componente para formas geométricas elegantes
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-foreground/[0.08]",
  shape = "rectangle",
  etched,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  shape?: "rectangle" | "triangle";
  etched?: EtchedFragment;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const scale = useViewportScale();
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      const el = surfaceRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const mouseX = mousePositionRef.current.x * window.innerWidth;
        const mouseY = mousePositionRef.current.y * window.innerHeight;
        const dist = Math.hypot(mouseX - cx, mouseY - cy);
        const reach = 460;
        const proximity = Math.max(0, 1 - dist / reach); // 0..1
        const eased = proximity * proximity; // squared for sharper falloff

        // Highlight position relative to the shape (where the light "hits")
        const relX = ((mouseX - rect.left) / Math.max(rect.width, 1)) * 100;
        const relY = ((mouseY - rect.top) / Math.max(rect.height, 1)) * 100;

        el.style.setProperty("--light-x", `${relX}%`);
        el.style.setProperty("--light-y", `${relY}%`);
        el.style.setProperty("--light-strength", eased.toFixed(3));
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

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
          width: scaledWidth,
          height: scaledHeight,
        }}
        className="relative"
      >
        <div
          ref={surfaceRef}
          className={cn(
            "absolute inset-0 overflow-hidden",
            shape === "triangle" ? "triangle-shape" : "rounded-sm",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-foreground/[0.05]"
          )}
          style={{
            clipPath:
              shape === "triangle"
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : undefined,
            // Glow externo que cambia con la proximidad
            boxShadow:
              "0 0 calc(60px * var(--light-strength, 0)) calc(8px * var(--light-strength, 0)) rgba(255, 245, 220, calc(0.55 * var(--light-strength, 0))), 0 8px 32px 0 rgba(0,0,0,0.05)",
            // Brillo global proporcional al cursor
            filter:
              "brightness(calc(1 + 1.4 * var(--light-strength, 0))) saturate(calc(1 + 0.3 * var(--light-strength, 0)))",
            // Highlight radial dentro del shape, en la zona donde "rebota" la luz
            backgroundImage:
              "radial-gradient(circle at var(--light-x, 50%) var(--light-y, 50%), rgba(255, 248, 230, calc(0.85 * var(--light-strength, 0))) 0%, rgba(255, 248, 230, calc(0.25 * var(--light-strength, 0))) 30%, transparent 70%)",
            transition: "filter 120ms linear",
          }}
        >
          {etched && (
            <>
              {/* Capa 1 — sombra dentro del surco. La imagen original tiene
                  líneas finas tipo lápiz que sin amplificar quedan invisibles
                  tras multiply. contrast(3) las empuja a casi negro y
                  brightness(0.7) baja el fondo blanco a gris medio para que
                  el multiply tenga rango (blanco puro × algo = identidad).
                  color-burn da un darkening más agresivo que multiply. */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("${etched.url ?? "/identity/blueprint.jpg"}")`,
                  backgroundSize: etched.size ?? "100% auto",
                  backgroundPosition: `${etched.x} ${etched.y}`,
                  backgroundRepeat: "no-repeat",
                  // Filter fuerte: brightness 0.5 baja todo bajo el midpoint
                  // primero, contrast 2.5 lo amplía después → líneas finas
                  // pasan a casi negro, paper queda gris medio. Combinado
                  // con multiply oscurecen visiblemente la superficie.
                  filter: "grayscale(1) brightness(0.5) contrast(2.5)",
                  mixBlendMode: "multiply",
                  // Mask radius pequeño (45%): la zona etched queda
                  // contenida, no agranda el halo cremoso.
                  maskImage:
                    "radial-gradient(circle at var(--light-x, 50%) var(--light-y, 50%), black 0%, black 20%, transparent 45%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at var(--light-x, 50%) var(--light-y, 50%), black 0%, black 20%, transparent 45%)",
                  // Opacity con saturación rápida: min(cap, strength*3).
                  // En cuanto --light-strength llega a ~0.18 la opacidad ya
                  // está en su cap (0.55). Esto significa que las líneas
                  // están visibles desde que el cursor está MODERADAMENTE
                  // cerca, no hace falta luz halo al 100% — y como el cap
                  // es 0.55 (no 1.0), no añaden ni el contraste exagerado
                  // de antes ni un brillo que extienda el halo.
                  opacity: `min(${(etched.strength ?? 1.0) * 0.55}, calc(var(--light-strength, 0) * 3))`,
                  transition: "opacity 120ms linear",
                }}
              />
              {/* La segunda capa (highlight con screen blend) se eliminó
                  intencionalmente: con etched en las 10 figuras añadía un
                  brillo perceptible al halo del cursor — el padre tiene
                  filter: brightness escalado con --light-strength que cascada
                  al hijo, y el screen blend de líneas blancas reforzaba eso.
                  Ahora solo el surco oscuro (multiply) — sin efecto 3D lip
                  pero el halo de luz queda idéntico a las figuras vacías. */}
            </>
          )}
        </div>
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
      className={cn("absolute rounded-full bg-foreground/10", className)}
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
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    let targetX = 0.5;
    let targetY = 0.5;
    let currentX = 0.5;
    let currentY = 0.5;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
      mousePositionRef.current.hasMoved = true;
    };

    const tick = () => {
      const ease = 0.15;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      mousePositionRef.current.x = currentX;
      mousePositionRef.current.y = currentY;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 -z-10"
    >
      <div className="absolute inset-0 bg-background"></div>
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
          // Único fragmento "tallado": size 100% 100% estira la imagen al
          // espacio EXACTO del rect (600×140). El jpg (311×90, ratio 3.46:1)
          // está cerca del aspect del rect (4.3:1) — la distorsión vertical
          // es leve (~24% squash) y el contenido sigue siendo reconocible.
          // Imagen ocupa toda la figura, sin huecos.
          etched={{ x: "50%", y: "50%", size: "100% 100%", strength: 1.0 }}
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-[#e1dbd6]/[0.25]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          // Segundo fragmento — diagrama de arquitectura software (presentación
          // / aplicación / datos). Imagen 335×62 (ratio 5.4:1), rect 500×120
          // (ratio 4.17:1). size 100% 100% estira levemente vertical (~23%
          // squash) pero el diagrama sigue siendo perfectamente legible.
          etched={{
            url: "/identity/software.png",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-[#e2e2e2]/[0.25]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          // Tercer fragmento — iconografía de diseño (lápices, vector pen,
          // paper plane, ...). Imagen 1200×271 (ratio 4.43:1) sobre rect
          // 300×80 (ratio 3.75:1). size 100% 100% causa un squash horizontal
          // del ~18% pero los iconos siguen siendo reconocibles.
          etched={{
            url: "/identity/design.png",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-[#f9f6f2]/[0.25]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          etched={{
            url: "/identity/marketing.jpg",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-[#d1d1d1]/[0.25]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          etched={{
            url: "/identity/software.png",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
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
          etched={{
            url: "/identity/blueprint.jpg",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
        />
        <ElegantShape
          delay={0.9}
          width={250}
          height={70}
          rotate={-30}
          gradient="from-[#e2e2e2]/[0.2]"
          className="left-[40%] top-[60%]"
          etched={{
            url: "/identity/software.png",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
        />
        <ElegantShape
          delay={1.0}
          width={180}
          height={50}
          rotate={45}
          gradient="from-[#d1d1d1]/[0.2]"
          shape="triangle"
          className="left-[60%] bottom-[30%]"
          etched={{
            url: "/identity/design.png",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
        />
        <ElegantShape
          delay={1.1}
          width={320}
          height={90}
          rotate={-10}
          gradient="from-[#f9f6f2]/[0.2]"
          className="right-[40%] bottom-[20%]"
          // Cuarto fragmento — iconografía marketing (megáfono, dispositivos,
          // word "MARKETING"). Imagen 1400×274 (ratio 5.11:1) sobre rect
          // 320×90 (ratio 3.55:1). size 100% 100% squashea horizontalmente
          // ~30% pero los iconos y la palabra siguen siendo legibles.
          etched={{
            url: "/identity/marketing.jpg",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
        />
        <ElegantShape
          delay={1.2}
          width={120}
          height={35}
          rotate={60}
          gradient="from-[#e1dbd6]/[0.2]"
          shape="triangle"
          className="left-[30%] top-[25%]"
          etched={{
            url: "/identity/design.png",
            x: "50%",
            y: "50%",
            size: "100% 100%",
            strength: 1.0,
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
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
      {/* Base background */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_75%)]"></div>
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

      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
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
      <div className="absolute inset-0 z-0 bg-background"></div>

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
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-foreground/[0.05] border border-foreground/[0.1] backdrop-blur-md hover:bg-foreground/[0.08] transition-all duration-300">
            <ChevronLeft className="w-4 h-4 text-foreground/70" />
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-foreground/[0.05] border border-foreground/[0.1] backdrop-blur-md hover:bg-foreground/[0.08] transition-all duration-300">
            <ChevronRight className="w-4 h-4 text-foreground/70" />
          </div>
        </motion.button>
      </div>

      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-foreground/[0.03] border border-foreground/[0.08] backdrop-blur-md">
          <div className="flex gap-2">
            <motion.div
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentBackground === "cosmic"
                  ? getBackgroundColor("cosmic")
                  : "bg-foreground/30"
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
                  : "bg-foreground/30"
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
                  : "bg-foreground/30"
              )}
              animate={{
                scale: currentBackground === "minimal" ? 1.2 : 1,
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/50 capitalize">
              {currentBackground}
            </span>
            <div className="text-foreground/50">
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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/[0.03] border border-foreground/[0.08] mb-8 md:mb-12"
          >
            <div className="text-foreground/60 mr-2">
              {getBackgroundIcon(currentBackground)}
            </div>
            <span className="text-sm text-foreground/60 tracking-wide capitalize">
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
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
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
            <p className="text-base sm:text-lg md:text-xl text-foreground/60 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {getBackgroundDescription(currentBackground)}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
