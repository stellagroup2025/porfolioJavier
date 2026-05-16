"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Language = "es" | "en"

type Dictionary = Record<string, { es: string; en: string }>

const STORAGE_KEY = "portfolio-language"

const dictionary: Dictionary = {
  // Common
  "common.backToProjects": { es: "Volver a proyectos", en: "Back to projects" },
  "common.viewLive": { es: "Ver proyecto en vivo", en: "View live project" },
  "common.viewSource": { es: "Ver código fuente", en: "View source code" },
  "common.learnMore": { es: "Más información", en: "Learn more" },
  "common.downloadCV": { es: "Descargar CV", en: "Download CV" },
  "common.available": { es: "Disponible para nuevos proyectos", en: "Available for new projects" },
  "common.popular": { es: "Popular", en: "Popular" },
  "common.explore": { es: "Explorar", en: "Explore" },

  // Home
  "home.role": {
    es: "Arquitecto y Publicista reconvertido a Full Stack Developer",
    en: "Architect & Publicist Turned Full Stack Developer",
  },
  "home.tagline": {
    es: "Creo experiencias digitales donde el diseño y la tecnología se entienden sin esfuerzo.",
    en: "I craft digital experiences where design and technology meet effortlessly.",
  },
  "home.technologies": { es: "Tecnologías", en: "Technologies" },

  // Navigation (TypographicNavigation labels)
  "nav.work": { es: "Trabajo", en: "Work" },
  "nav.services": { es: "Servicios", en: "Services" },
  "nav.about": { es: "Sobre mí", en: "About" },
  "nav.contact": { es: "Contacto", en: "Contact" },

  // Work
  "work.title": { es: "Proyectos", en: "Projects" },
  "work.subtitle": {
    es: "Una selección de mis trabajos más recientes y destacados.",
    en: "A selection of my most recent and notable work.",
  },
  "work.project.ecommerce.title": { es: "E-commerce Platform", en: "E-commerce Platform" },
  "work.project.ecommerce.description": {
    es: "Plataforma de comercio electrónico completa con gestión de inventario, carrito de compras, pasarela de pagos y panel de administración.",
    en: "Complete e-commerce platform with inventory management, shopping cart, payment gateway and admin panel.",
  },
  "work.project.animaciones.title": { es: "Animaciones", en: "Animations" },
  "work.project.animaciones.description": {
    es: "Galería de demos de animaciones interactivas creadas con Framer Motion y React.",
    en: "Gallery of interactive animation demos built with Framer Motion and React.",
  },
  "work.project.mobileapp.title": { es: "Mobile App", en: "Mobile App" },
  "work.project.mobileapp.description": {
    es: "Aplicación móvil para gestión de tareas y productividad personal.",
    en: "Mobile app for task management and personal productivity.",
  },
  "work.project.aigenerator.title": { es: "AI Content Generator", en: "AI Content Generator" },
  "work.project.aigenerator.description": {
    es: "Herramienta de generación de contenido utilizando inteligencia artificial.",
    en: "Content generation tool powered by artificial intelligence.",
  },

  // Animaciones page
  "animaciones.hint": {
    es: "Scroll para navegar · click en la card en foco para ver la animación",
    en: "Scroll to navigate · click the focused card to view the animation",
  },

  // Animation modal demos (titles stay english; descriptions translate)
  "animaciones.modal.fade.title": { es: "Fade In", en: "Fade In" },
  "animaciones.modal.fade.description": {
    es: "Transición suave de opacidad. El elemento aparece y desaparece de forma continua.",
    en: "Smooth opacity transition. The element fades in and out continuously.",
  },
  "animaciones.modal.scale.title": { es: "Scale Pulse", en: "Scale Pulse" },
  "animaciones.modal.scale.description": {
    es: "Pulso de escala continuo. Útil para llamar la atención sin interrumpir el flujo.",
    en: "Continuous scale pulse. Useful to draw attention without breaking the flow.",
  },
  "animaciones.modal.rotate.title": { es: "Rotate Loop", en: "Rotate Loop" },
  "animaciones.modal.rotate.description": {
    es: "Rotación continua sobre el eje Z. Ideal para iconos de carga o estados activos.",
    en: "Continuous rotation on the Z axis. Ideal for loading icons or active states.",
  },
  "animaciones.modal.slide.title": { es: "Slide X", en: "Slide X" },
  "animaciones.modal.slide.description": {
    es: "Desplazamiento horizontal de ida y vuelta. Base de transiciones entre vistas.",
    en: "Horizontal back-and-forth translation. The foundation of view transitions.",
  },
  "animaciones.modal.morph.title": { es: "Morph Shape", en: "Morph Shape" },
  "animaciones.modal.morph.description": {
    es: "Transición entre formas variando border-radius. Cuadrado <-> círculo orgánico.",
    en: "Transition between shapes by morphing border-radius. Organic square ↔ circle.",
  },
  "animaciones.modal.spring.title": { es: "Spring Hover", en: "Spring Hover" },
  "animaciones.modal.spring.description": {
    es: "Hover con física de muelle. Pasa el ratón sobre el cuadro para sentir el spring.",
    en: "Hover with spring physics. Move the mouse over the box to feel the spring.",
  },
  "animaciones.modal.stagger.title": { es: "Stagger", en: "Stagger" },
  "animaciones.modal.stagger.description": {
    es: "Aparición secuencial de varios elementos. Da ritmo y guía la lectura del usuario.",
    en: "Sequential reveal of multiple elements. Adds rhythm and guides the eye.",
  },
  "animaciones.modal.path.title": { es: "Path Draw", en: "Path Draw" },
  "animaciones.modal.path.description": {
    es: "Animación de trazado de un SVG. La ruta se dibuja y se borra de forma continua.",
    en: "SVG path-draw animation. The stroke is drawn and erased continuously.",
  },
  "animaciones.modal.demoLabel": { es: "Demo", en: "Demo" },
  "animaciones.modal.close": { es: "Cerrar", en: "Close" },

  // Services
  "services.title": { es: "Servicios", en: "Services" },
  "services.subtitle": {
    es: "Ofrezco soluciones digitales completas adaptadas a las necesidades específicas de cada proyecto, combinando tecnología de vanguardia con estrategias efectivas.",
    en: "I offer end-to-end digital solutions tailored to each project's needs, blending cutting-edge tech with effective strategy.",
  },
  "services.featured": { es: "Servicios Destacados", en: "Featured Services" },
  "services.all": { es: "Todos los Servicios", en: "All Services" },

  // About
  "about.title": { es: "Sobre mí", en: "About me" },
  "about.role": { es: "Full Stack Developer", en: "Full Stack Developer" },
  "about.nav.biography": { es: "Biografía", en: "Biography" },
  "about.nav.skills": { es: "Habilidades", en: "Skills" },
  "about.nav.experience": { es: "Experiencia", en: "Experience" },
  "about.nav.education": { es: "Educación", en: "Education" },
  "about.frontend": { es: "Desarrollo Frontend", en: "Frontend Development" },
  "about.backend": { es: "Desarrollo Backend", en: "Backend Development" },
  "about.otherTech": { es: "Otras tecnologías", en: "Other technologies" },
  "about.now": { es: "Presente", en: "Present" },
  "about.gpa": { es: "Nota media:", en: "GPA:" },

  // Contact
  "contact.hello": { es: "Hola.", en: "Hello." },
  "contact.email": { es: "Email:", en: "Email:" },
  "contact.online": { es: "En internet:", en: "Online:" },
  "contact.quote": {
    es: '"Cada paso es una oportunidad, cada desafío una lección, y cada meta el comienzo de algo aún más grande."',
    en: '"Every step is an opportunity, every challenge a lesson, and every goal the start of something greater."',
  },
}

type LanguageContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: keyof typeof dictionary | string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return "es"
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored === "es" || stored === "en") return stored
  } catch {
    // ignore
  }
  const nav = window.navigator?.language?.toLowerCase() ?? ""
  return nav.startsWith("en") ? "en" : "es"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    setLanguageState(detectInitialLanguage())
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === "es" ? "en" : "es"
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const t = useCallback(
    (key: string) => {
      const entry = dictionary[key]
      if (!entry) return key
      return entry[language] ?? entry.es ?? key
    },
    [language]
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return {
      language: "es" as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string) => {
        const entry = dictionary[key]
        return entry?.es ?? key
      },
    }
  }
  return ctx
}
