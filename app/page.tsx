"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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
  MOBILE_REVEALER_DURATIONS,
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
  // Scroll del contenido activo (solo se usa en mobile para activar el
  // glass effect del header). Como cada sección tiene su propio
  // overflow-y-auto interno, capturamos cualquier scroll en fase capture.
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { withTransition } = useTransition();

  useEffect(() => {
    if (!isMobile) return;
    const onScroll = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target && typeof target.scrollTop === "number") {
        setIsScrolled(target.scrollTop > 8);
      }
    };
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () =>
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
  }, [isMobile]);

  // Reset al cambiar de sección — el container nuevo arranca a scrollTop 0.
  useEffect(() => {
    setIsScrolled(false);
  }, [activeSection]);

  const handleSectionChange = async (section: string) => {
    if (activeSection === section || isTransitioning) return;

    // Mobile usa una cortina diferente (transform-only, GPU). Las
    // duraciones son MUCHO más cortas (~760ms total vs 3200ms desktop)
    // para que no se sienta laggy en dispositivos con GPU modesta.
    const timing = isMobile
      ? {
          cover: MOBILE_REVEALER_DURATIONS.covering * 1000,
          hold: MOBILE_REVEALER_DURATIONS.covered * 1000,
          uncover: MOBILE_REVEALER_DURATIONS.uncovering * 1000,
        }
      : { cover: 1200, hold: 800, uncover: 1200 };

    setIsTransitioning(true);
    setRevealerDirection(section === "home" ? "backward" : "forward");
    setRevealerPhase("covering");
    await new Promise((resolve) => setTimeout(resolve, timing.cover));

    setRevealerPhase("covered");
    setActiveSection(section);
    if (section !== "work") {
      setActiveProject(null);
    }

    await new Promise((resolve) => setTimeout(resolve, timing.hold));
    setRevealerPhase("uncovering");
    await new Promise((resolve) => setTimeout(resolve, timing.uncover));

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
        {/* Capa de glass: solo en mobile, se desvanece en función del
            scroll. Fuera de mobile / sin scroll, opacity 0 → el header
            es invisible como antes (solo se ven sus hijos interactivos). */}
        {isMobile && (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 backdrop-blur-2xl bg-background/70 border-b border-foreground/10 transition-opacity duration-300 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <div className="relative flex items-center justify-between">
          {/* Slot izquierdo: back button cuando estamos en mobile y hay
              shouldShowSectionLink. El logo se traslada al centro abajo. */}
          <div className="pointer-events-auto">
            {isMobile && shouldShowSectionLink ? (
              <motion.button
                key="back-button"
                initial={{ opacity: 0, scale: 0.7, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: -8 }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                onClick={() => !isTransitioning && sectionToNavigate()}
                disabled={isTransitioning}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10 disabled:opacity-50"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.div
                key="logo-left"
                layoutId="header-logo"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Logo onClick={() => handleSectionChange("home")} />
              </motion.div>
            )}
          </div>

          {/* Slot centro: logo cuando mobile + section page. layoutId
              comparte identidad con el logo-left, así framer-motion anima
              la transición de posición (left → center) suavemente.
              Usamos flex centering (no translate) porque framer-motion
              sobrescribe el `transform` durante la animación layoutId y
              los `-translate-*` de Tailwind quedan ignorados → el logo
              caía debajo del back button. Con `absolute inset-0 flex
              items-center justify-center` el centrado se hace por
              layout, no por transform, y se respeta. */}
          {isMobile && shouldShowSectionLink && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.div
                layoutId="header-logo"
                className="pointer-events-auto"
                // El logo png tiene un poco de aire en la parte inferior,
                // así que el centro visual queda más arriba del centro
                // geométrico → bajamos 4px para alinear ópticamente con
                // el back button y el toggle de idioma.
                style={{ marginTop: 4 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
              >
                <Logo
                  onClick={() => handleSectionChange("home")}
                  className="w-14 h-14"
                />
              </motion.div>
            </div>
          )}

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

        {shouldShowSectionLink && !isMobile && (
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
