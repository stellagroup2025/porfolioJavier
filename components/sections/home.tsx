"use client";

import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { GeometricBackground } from "@/components/multi-background";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

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
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
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
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
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
              isMobile ? "text-2xl text-center" : "text-2xl md:text-3xl",
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
                : "text-base md:text-xl max-w-xl"
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
                : "text-sm md:text-base max-w-xl"
            )}
          >
            {t("home.tagline")}
          </h2>
        </motion.div>

        {/* Tecnologías */}
        <motion.div className="mb-4 sm:mb-6" variants={item}>
          <div className="space-y-3">
            <span
              className={cn(
                "text-[10px] sm:text-xs font-light tracking-[0.2em] uppercase text-foreground/70",
                isMobile ? "block text-center" : ""
              )}
            >
              {t("home.technologies")}
            </span>
            <motion.div
              className={cn(
                "flex flex-wrap gap-x-1.5 gap-y-1.5 sm:gap-x-2 sm:gap-y-2",
                isMobile ? "justify-center" : ""
              )}
              variants={techContainer}
              initial="hidden"
              animate="show"
            >
              {technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  variants={techItem}
                  className="px-2 py-1 text-[9px] sm:text-[8px] font-light text-foreground/80 tracking-wide border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm rounded-sm hover:border-foreground/20 hover:bg-foreground/[0.05] transition-all duration-300"
                  whileHover={{
                    scale: 1.05,
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
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
