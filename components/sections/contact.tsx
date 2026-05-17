"use client";

import type React from "react";
import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const { t } = useTranslation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío
    setTimeout(() => {
      console.log("Form submitted:", formState);
      setIsSubmitting(false);
      setFormSubmitted(true);
      // Reset form
      setFormState({
        name: "",
        email: "",
        message: "",
      });
    }, 1500);
  };

  const socialLinks = [
    { name: "LinkedIn", url: "https://es.linkedin.com/in/javier-reyes-dev" },
    { name: "Instagram", url: "https://www.instagram.com/javier_reyes_b/" },
    { name: "GitHub", url: "#" },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  // Animación para las letras del título
  const titleText = t("contact.hello");
  const letters = titleText.split("");

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        mass: 0.8,
        duration: 1.2,
      },
    },
  };

  // Animación para la cita
  const quoteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2.0,
        duration: 1.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Workspace background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/contact-workspace.png"
          alt="Workspace background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-background/80" />
        {/* Subtle animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: Math.random() * 20,
                x: Math.random() * 100 - 50,
              }}
              animate={{
                opacity: [0, 0.1, 0],
                y: [0, -10, 0],
                transition: {
                  opacity: { duration: 1, delay: i * 0.2 },
                  y: {
                    duration: 3 + i,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: i * 0.5,
                  },
                },
              }}
              className="absolute w-[2px] h-[2px] rounded-full bg-foreground/20"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + i * 8}%`,
              }}
            />
          ))}
        </div>
        {/* Subtle light effects */}
        <div className="absolute top-[20%] right-[20%] w-[200px] h-[200px] rounded-full bg-[#e1dbd6]/[0.3] blur-3xl" />
        <div className="absolute bottom-[10%] left-[10%] w-[150px] h-[150px] rounded-full bg-[#d1d1d1]/[0.3] blur-3xl" />
      </div>

      {/* Título animado: en mobile lo contenemos al viewport (left-4 right-4)
          en sm+ recupera el posicionamiento original empujado al centro-
          derecha. Sin esto la cita (max-w-md = 448px) se salía del viewport
          mobile. */}
      <div
        className={cn(
          "absolute z-10 -translate-y-1/2",
          "left-4 right-4 top-[42%]",
          "sm:left-1/2 sm:right-auto sm:top-1/2 sm:translate-x-[15%] md:translate-x-[20%]",
        )}
        ref={containerRef}
      >
        <motion.h1
          className={cn(
            "text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight overflow-hidden text-foreground",
            playfair.className
          )}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block"
              style={{
                // Preservar espacios
                whiteSpace: letter === " " ? "pre" : "normal",
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Cita en cursiva */}
        <motion.p
          className={cn(
            "text-sm sm:text-base md:text-lg font-light italic text-foreground/70 mt-4 sm:mt-6 md:mt-8 max-w-full sm:max-w-md",
            cormorant.className
          )}
          variants={quoteVariants}
          initial="hidden"
          animate="visible"
        >
          {t("contact.quote")}
        </motion.p>
      </div>

      {/* Información de contacto en la parte inferior izquierda */}
      <motion.div
        className="w-full z-10 px-4 sm:px-6 md:px-16 lg:px-24 mt-auto pb-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <div className="max-w-md space-y-2">
          <div>
            <p
              className={cn(
                "text-foreground/70 text-sm font-light tracking-wide mb-0",
                cormorant.className
              )}
            >
              {t("contact.email")}
            </p>
            <a
              href="mailto:jreyes@avanzadi.com"
              className={cn(
                "text-xl sm:text-2xl font-light text-foreground hover:text-foreground/80 transition-colors tracking-wide",
                cormorant.className
              )}
            >
              jreyes@avanzadi.com
            </a>
          </div>

          <div>
            <p
              className={cn(
                "text-foreground/70 text-sm font-light tracking-wide mb-0",
                cormorant.className
              )}
            >
              {t("contact.online")}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-foreground hover:text-foreground/70 transition-colors text-lg font-light tracking-wide",
                    cormorant.className
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
