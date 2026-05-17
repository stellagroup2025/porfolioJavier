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
  "nav.home": { es: "Inicio", en: "Home" },
  "nav.work": { es: "Trabajo", en: "Work" },
  "nav.services": { es: "Servicios", en: "Services" },
  "nav.about": { es: "Sobre mí", en: "About" },
  "nav.contact": { es: "Contacto", en: "Contact" },

  // About section
  "about.title": { es: "Sobre mí", en: "About me" },
  "about.explore": { es: "Explorar", en: "Explore" },
  "about.section.biography": { es: "Biografía", en: "Biography" },
  "about.section.skills": { es: "Habilidades", en: "Skills" },
  "about.section.experience": { es: "Experiencia", en: "Experience" },
  "about.section.education": { es: "Educación", en: "Education" },
  "about.available": {
    es: "Disponible para nuevos proyectos",
    en: "Available for new projects",
  },
  "about.cv.download": { es: "Descargar CV", en: "Download CV" },

  "about.bio.p1": {
    es: "Llegué al desarrollo de software por un camino poco convencional: pasando primero por las aulas de Arquitectura y de Publicidad y Marketing. A simple vista parecen mundos opuestos, pero esa mezcla me enseñó algo fundamental: no sirve de nada construir algo técnicamente increíble si la estructura base no es sólida, ni si la persona que va a usarlo no lo entiende.",
    en: "I came into software development through an unconventional path: first through the lecture halls of Architecture, then of Advertising and Marketing. At first glance they seem like opposite worlds, but that mix taught me something fundamental: there's no point in building something technically incredible if the underlying structure isn't solid, or if the person who's going to use it doesn't understand it.",
  },
  "about.bio.p2": {
    es: "Hoy, como Full Stack Developer en Avanzadi Innovación Digital, me dedico a desarrollar productos digitales uniendo tres piezas clave: arquitectura de software robusta y escalable, diseño y UX/UI sin fricciones, y visión de negocio para que el código que escribo responda a las necesidades reales del cliente.",
    en: "Today, as a Full Stack Developer at Avanzadi Innovación Digital, I build digital products by combining three key pieces: robust and scalable software architecture, frictionless design and UX/UI, and a business perspective so the code I write answers the client's real needs.",
  },
  "about.bio.p3": {
    es: "Me considero un perfil polivalente que disfruta tanto colaborando en equipo como resolviendo problemas técnicos complejos por mi cuenta. Para mí, el mayor logro en el desarrollo web es lograr traducir retos comerciales en soluciones tecnológicas que simplemente funcionan y conectan con el usuario.",
    en: "I think of myself as a versatile profile who enjoys both team collaboration and tackling complex technical problems on my own. For me, the biggest achievement in web development is translating commercial challenges into technological solutions that simply work and connect with the user.",
  },

  "about.skills.frontend.title": { es: "Desarrollo Frontend", en: "Frontend Development" },
  "about.skills.animation.title": {
    es: "Animación y Experiencia Visual",
    en: "Animation & Visual Experience",
  },
  "about.skills.backend.title": { es: "Desarrollo Backend", en: "Backend Development" },
  "about.skills.other.title": { es: "Otras tecnologías", en: "Other technologies" },
  "about.skills.other.uxui": { es: "Diseño UX/UI", en: "UX/UI Design" },
  "about.skills.other.responsive": {
    es: "Diseño web adaptable",
    en: "Responsive Web Design",
  },

  "about.experience.period": { es: "sept. 2024 – Presente", en: "Sept. 2024 – Present" },
  "about.experience.role": { es: "Full Stack Developer", en: "Full Stack Developer" },
  "about.experience.company": {
    es: "Avanzadi Innovación Digital",
    en: "Avanzadi Innovación Digital",
  },
  "about.experience.description": {
    es: "Desarrollo y mantengo el frontend de las aplicaciones principales de Avanzadi, trabajando de forma transversal en todo el stack tecnológico según las necesidades de cada proyecto. Áreas de trabajo: desarrollo frontend con React.js, TypeScript y Tailwind CSS; desarrollo backend con Node.js, Express.js y REST APIs en sistemas de gestión y ticketing; participación en proyectos de ERP, automatizaciones, integraciones y páginas web corporativas; colaboración tanto en equipos multidisciplinares como en desarrollo individual end-to-end. Mi aportación combina solidez técnica y criterio visual, lo que se traduce en productos con arquitectura escalable y una experiencia de usuario claramente superior.",
    en: "I develop and maintain the frontend of Avanzadi's main applications, working transversally across the full tech stack depending on each project's needs. Work areas: frontend development with React.js, TypeScript and Tailwind CSS; backend development with Node.js, Express.js and REST APIs on management and ticketing systems; involvement in ERP projects, automations, integrations and corporate websites; collaboration both within multidisciplinary teams and as an end-to-end individual contributor. My contribution combines technical solidity with visual judgement, which translates into products with scalable architecture and a clearly superior user experience.",
  },

  "about.education.1.title": {
    es: "Desarrollo Web Full Stack",
    en: "Full Stack Web Development",
  },
  "about.education.1.institution": { es: "thePower", en: "thePower" },
  "about.education.1.description": {
    es: "Formación intensiva en desarrollo web full stack con enfoque práctico en tecnologías modernas del ecosistema JavaScript.",
    en: "Intensive full stack web development training with a hands-on focus on modern technologies from the JavaScript ecosystem.",
  },
  "about.education.2.title": {
    es: "Doble Grado en Publicidad y Relaciones Públicas + Marketing",
    en: "Double Degree in Advertising and Public Relations + Marketing",
  },
  "about.education.2.institution": {
    es: "Universidad Rey Juan Carlos",
    en: "Universidad Rey Juan Carlos",
  },
  "about.education.2.description": {
    es: "Formación en comunicación, estrategia de marca, comportamiento del consumidor y marketing digital.",
    en: "Training in communication, brand strategy, consumer behaviour and digital marketing.",
  },
  "about.education.3.title": {
    es: "Licenciatura en Arquitectura",
    en: "Bachelor's Degree in Architecture",
  },
  "about.education.3.institution": {
    es: "Universidad Complutense de Madrid",
    en: "Universidad Complutense de Madrid",
  },
  "about.education.3.description": {
    es: "Formación en diseño, composición espacial, estructuras y representación gráfica. Base del pensamiento visual y arquitectónico aplicado hoy al diseño de interfaces y productos digitales.",
    en: "Training in design, spatial composition, structures and graphic representation. The foundation of the visual and architectural thinking I apply today to interface and product design.",
  },
  "about.education.4.title": {
    es: "Formación en Arquitectura",
    en: "Architecture Studies",
  },
  "about.education.4.institution": {
    es: "Pontificia Universidad Católica de Chile",
    en: "Pontificia Universidad Católica de Chile",
  },
  "about.education.4.description": {
    es: "Estudios de arquitectura en Chile con enfoque en proyecto, escala humana y diseño contextual.",
    en: "Architecture studies in Chile focused on project work, human scale and contextual design.",
  },

  // Work
  "work.title": { es: "Proyectos", en: "Projects" },
  "work.subtitle": {
    es: "Una selección de mis trabajos más recientes y destacados.",
    en: "A selection of my most recent and notable work.",
  },
  "work.project.ecommerce.title": { es: "Plataforma E-commerce", en: "E-commerce Platform" },
  "work.project.ecommerce.description": {
    es: "Plataforma de comercio electrónico completa con gestión de inventario, carrito de compras, pasarela de pagos y panel de administración.",
    en: "Complete e-commerce platform with inventory management, shopping cart, payment gateway and admin panel.",
  },
  "work.project.animaciones.title": { es: "Animaciones", en: "Animations" },
  "work.project.animaciones.description": {
    es: "Galería de demos de animaciones interactivas creadas con Framer Motion y React.",
    en: "Gallery of interactive animation demos built with Framer Motion and React.",
  },
  "work.project.mobileapp.title": { es: "App Móvil", en: "Mobile App" },
  "work.project.mobileapp.description": {
    es: "Aplicación móvil para gestión de tareas y productividad personal.",
    en: "Mobile app for task management and personal productivity.",
  },
  "work.project.aigenerator.title": { es: "Generador de Contenido IA", en: "AI Content Generator" },
  "work.project.aigenerator.description": {
    es: "Herramienta de generación de contenido utilizando inteligencia artificial.",
    en: "Content generation tool powered by artificial intelligence.",
  },

  // Animaciones page — hint general (cards con animación WebGL).
  "animaciones.hint": {
    es: "Scroll para navegar · click en la card en foco para ver la animación",
    en: "Scroll to navigate · click the focused card to view the animation",
  },
  // Hint corto para las cards de intro / outro (scroll, scroll back) que no
  // tienen modal asociado.
  "animaciones.hintScroll": {
    es: "Scroll para navegar",
    en: "Scroll to navigate",
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
