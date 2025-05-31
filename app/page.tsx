"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home } from "@/components/sections/home";
import { About } from "@/components/sections/about";
import { Work } from "@/components/sections/work";
import { Services } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";
import { TypographicNavigation } from "@/components/typographic-navigation";
import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { PageTransition } from "@/components/page-transition";
import { SectionLink } from "@/components/section-link";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSectionChange = (section: string) => {
    if (activeSection !== section && !isTransitioning) {
      setIsTransitioning(true);
      setActiveSection(section);

      // Reset active project when changing sections
      if (section !== "work") {
        setActiveProject(null);
      }
    }
  };

  // Function to set active project (will be passed to Work component)
  const handleProjectChange = (projectId: string | null) => {
    setActiveProject(projectId);
  };

  useEffect(() => {
    // Reset transitioning state after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const sections = {
    home: <Home />,
    work: (
      <Work
        activeProject={activeProject}
        setActiveProject={handleProjectChange}
      />
    ),
    services: <Services />,
    about: <About />,
    contact: <Contact />,
  };

  // Determinar qué sección debe tener el enlace de navegación
  const shouldShowSectionLink = activeSection !== "home";

  // Determinar si debemos mostrar "HOME" o "WORK" en el enlace
  // Solo mostrar "WORK" cuando estamos en un proyecto específico dentro de la sección work
  const sectionToReturn =
    activeSection === "work" && activeProject ? "work" : "home";

  // Determinar a qué sección debemos navegar al hacer clic en el enlace
  const sectionToNavigate =
    activeSection === "work" && activeProject
      ? () => handleProjectChange(null) // Si estamos en un proyecto, volver a la lista de proyectos
      : () => handleSectionChange("home"); // En cualquier otro caso, volver a home

  return (
    <div className="min-h-screen overflow-hidden text-black  aaaa">
      <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo onClick={() => handleSectionChange("home")} />
          </motion.div>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="relative h-screen">
        <AnimatePresence mode="wait">
          <PageTransition key={activeSection}>
            <div className="w-full h-full">
              {sections[activeSection as keyof typeof sections]}
            </div>
          </PageTransition>
        </AnimatePresence>

        {shouldShowSectionLink && (
          <SectionLink
            onClick={sectionToNavigate}
            isTransitioning={isTransitioning}
            section={sectionToReturn}
          />
        )}

        <TypographicNavigation
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          isTransitioning={isTransitioning}
          isMobile={isMobile}
        />
      </div>

      {/* Footer con posicionamiento condicional */}
      <footer
        className={
          isMobile
            ? "fixed bottom-4 left-0 w-full z-40 px-6"
            : "fixed bottom-6 sm:bottom-8 left-4 sm:left-6 w-auto z-40"
        }
      >
        <SocialLinks />
      </footer>
    </div>
  );
}
