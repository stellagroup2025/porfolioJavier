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
import { useTransition } from "@/components/page-transition/TransitionProvider";
import {
  RevealerTransition,
  type RevealerDirection,
  type RevealerPhase,
} from "@/components/page-transition/RevealerTransition";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [revealerPhase, setRevealerPhase] = useState<RevealerPhase>("idle");
  const [revealerDirection, setRevealerDirection] =
    useState<RevealerDirection>("forward");
  const isMobile = useIsMobile();
  const { withTransition } = useTransition();

  const handleSectionChange = async (section: string) => {
    if (activeSection === section || isTransitioning) return;

    setIsTransitioning(true);
    setRevealerDirection(section === "home" ? "backward" : "forward");
    setRevealerPhase("covering");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setRevealerPhase("covered");
    setActiveSection(section);
    if (section !== "work") {
      setActiveProject(null);
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    setRevealerPhase("uncovering");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setRevealerPhase("idle");
    setIsTransitioning(false);
  };

  // Function to set active project (will be passed to Work component)
  const handleProjectChange = (projectId: string | null) => {
    setActiveProject(projectId);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedSection = params.get("section");
    const validSections = ["home", "work", "services", "about", "contact"];
    if (requestedSection && validSections.includes(requestedSection)) {
      setActiveSection(requestedSection);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

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
      ? () => withTransition(() => handleProjectChange(null)) // Si estamos en un proyecto, volver a la lista con transición
      : () => handleSectionChange("home"); // En cualquier otro caso, volver a home

  return (
    <div className="min-h-screen overflow-hidden text-foreground">
      <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 pointer-events-none">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-auto"
          >
            <Logo onClick={() => handleSectionChange("home")} />
          </motion.div>

          <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
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

      <RevealerTransition phase={revealerPhase} direction={revealerDirection} />
    </div>
  );
}
