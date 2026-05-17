"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { GeometricBackground } from "@/components/multi-background";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { mousePositionRef } from "@/lib/mouse-light";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function Home() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const lineAnimation = {
    hidden: { width: "0%" },
    show: {
      width: "100%",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.4, 0.25, 1],
        delay: 0.8,
      },
    },
  };

  const technologies = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Three.js",
    "GSAP",
    "Framer Motion",
    "Anime.js",
    "GLSL / WebGL",
    "Lottie",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "GraphQL",
  ];

  const techContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.2,
      },
    },
  };

  const techItem = {
    hidden: { scale: 0.92 },
    show: {
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <div className="relative w-full h-full flex items-end">
      <GeometricBackground />

      {/* Contenido principal */}
      <motion.div
        className={cn(
          "w-full z-10 px-6 sm:pl-20 md:pl-24 lg:pl-28",
          isMobile ? "max-w-full pb-16" : "max-w-2xl pb-12"
        )}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Título principal */}
        <motion.div className="mb-3" variants={item}>
          <h1
            className={cn(
              "font-light tracking-tight leading-tight text-foreground mb-1.5",
              isMobile
                ? "text-2xl text-center"
                : "text-[clamp(1.5rem,2.1vw,2.25rem)]",
              playfair.className
            )}
          >
            Javier Reyes
          </h1>

          {/* Línea decorativa */}
          <motion.div
            className="h-[0.5px] bg-foreground"
            variants={lineAnimation}
            initial="hidden"
            animate="show"
          />
        </motion.div>

        {/* Texto descriptivo profesional */}
        <motion.div className="mb-4" variants={item}>
          <p
            className={cn(
              "font-light tracking-tight text-foreground/90",
              isMobile
                ? "text-sm text-center max-w-full"
                : "text-[clamp(0.95rem,1.25vw,1.25rem)] max-w-xl"
            )}
          >
            {t("home.role")}
          </p>
        </motion.div>

        {/* Subtítulo */}
        <motion.div className="mb-4 sm:mb-6" variants={item}>
          <h2
            className={cn(
              "font-light leading-relaxed text-foreground",
              isMobile
                ? "text-sm text-center max-w-full"
                : "text-[clamp(0.85rem,1vw,1.05rem)] max-w-xl"
            )}
          >
            {t("home.tagline")}
          </h2>
        </motion.div>

        {/* Tecnologías — solo desktop (lg+). En mobile/tablet la lista
            empujaba todo el contenido hacia arriba. Tailwind lg: = 1024px. */}
        <motion.div className="hidden lg:block mb-4 sm:mb-6" variants={item}>
          <div className="space-y-3">
            <div
              className={cn(
                "inline-flex items-center gap-2 font-light tracking-[0.2em] uppercase text-foreground/70",
                isMobile
                  ? "text-[10px] w-full justify-center"
                  : "text-[clamp(10px,0.78vw,12px)]"
              )}
            >
              <span>{t("home.technologies")}</span>
              <motion.span
                aria-hidden
                className="text-foreground/50"
                animate={{ y: [0, 3, 0], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown
                  size={isMobile ? 11 : 13}
                  strokeWidth={1.4}
                  className="block"
                />
              </motion.span>
            </div>
            <motion.div
              className={cn(
                "grid gap-1.5 sm:gap-2",
                isMobile
                  ? "grid-cols-2 max-w-[320px] mx-auto"
                  : "grid-cols-4 max-w-xl"
              )}
              variants={techContainer}
              initial="hidden"
              animate="show"
            >
              {technologies.map((tech, index) => (
                <TechTag key={index} tech={tech} variants={techItem} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

interface TechTagProps {
  tech: string
  variants: {
    hidden: { scale: number }
    show: {
      scale: number
      transition: { duration: number; ease: number[] }
    }
  }
}

function TechTag({ tech, variants }: TechTagProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Efecto de iluminación solo en desktop. En mobile/tablet el grid de
    // tech ni siquiera está visible (hidden lg:block) — gateamos también
    // este RAF para no tirar de batería de balde.
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches
    if (!isDesktop) return

    let rafId = 0
    const tick = () => {
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const mouseX = mousePositionRef.current.x * window.innerWidth
        const mouseY = mousePositionRef.current.y * window.innerHeight
        const dist = Math.hypot(mouseX - cx, mouseY - cy)
        const reach = 240
        const proximity = Math.max(0, 1 - dist / reach)
        const eased = proximity * proximity
        el.style.setProperty("--tag-strength", eased.toFixed(3))
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <motion.span
      ref={ref}
      variants={variants}
      className="px-2 py-1 text-center text-[clamp(9px,0.72vw,11px)] font-light tracking-wide border backdrop-blur-sm rounded-sm transition-colors duration-150"
      style={{
        opacity: "var(--tag-strength, 0)",
        color: "rgba(255,255,255, calc(0.4 + 0.6 * var(--tag-strength, 0)))",
        borderColor: "rgba(255,255,255, calc(0.08 + 0.22 * var(--tag-strength, 0)))",
        backgroundColor: "rgba(255,255,255, calc(0.02 + 0.06 * var(--tag-strength, 0)))",
      }}
      whileHover={{
        scale: 1.06,
        y: -1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
      }}
    >
      {tech}
    </motion.span>
  )
}
