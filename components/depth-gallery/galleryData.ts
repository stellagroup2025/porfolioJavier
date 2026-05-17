export type GalleryPlane = {
  id: string
  title: string
  fallbackColor: string
  accentColor: string
  textBgColor: string
  textColor: string
  position: { x: number; y: number }
  backgroundColor: string
  blob1Color: string
  blob2Color: string
  label: {
    word: string
    pms: string
    color: string
    /** Tecnologías extras que se muestran en una fila TECH del panel de specs.
     *  Se renderizan unidas con " · ". Si está vacío/undefined la fila se
     *  oculta — útil para cards de intro/outro sin WebGL detrás. */
    techs?: string[]
  }
  /** Id de animación en el registry. La animación se renderiza a canvas oculto
   * y se inyecta como textura del plano. */
  animationId?: string
}

export const galleryPlaneData: GalleryPlane[] = [
  {
    id: "fade",
    title: "Scroll",
    fallbackColor: "#feca4f",
    accentColor: "#feca4f",
    textBgColor: "#feca4f",
    textColor: "#1a1a1a",
    position: { x: -0.9, y: 0 },
    backgroundColor: "#fffaf0",
    blob1Color: "#ffdf94",
    blob2Color: "#fce7c4",
    label: { word: "scroll", pms: "intro · 01", color: "#2e2e2e" },
  },
  {
    id: "scale",
    title: "Scale",
    fallbackColor: "#80455a",
    accentColor: "#80455a",
    textBgColor: "#80455a",
    textColor: "#f4f4f4",
    position: { x: 0.8, y: 0 },
    backgroundColor: "#0a0a14",
    blob1Color: "#3b2451",
    blob2Color: "#1e1a30",
    label: {
      word: "galaxy",
      pms: "webgl · 02",
      color: "#f4f4f4",
      techs: ["three.js", "glsl", "points"],
    },
    animationId: "galaxy",
  },
  {
    id: "rotate",
    title: "Rotate",
    fallbackColor: "#59c384",
    accentColor: "#59c384",
    textBgColor: "#59c384",
    textColor: "#0f2a1d",
    position: { x: -0.7, y: 0 },
    backgroundColor: "#1a3a2a",
    blob1Color: "#3aa56a",
    blob2Color: "#7fd6a5",
    label: {
      word: "icosphere",
      pms: "webgl · 03",
      color: "#f4f4f4",
      techs: ["three.js", "glsl", "points"],
    },
    animationId: "icosphere",
  },
  {
    id: "slide",
    title: "Slide",
    fallbackColor: "#a9e7da",
    accentColor: "#23f660",
    textBgColor: "#a9e7da",
    textColor: "#0f2a1d",
    position: { x: 1, y: 0 },
    backgroundColor: "#a9e7da",
    blob1Color: "#23f660",
    blob2Color: "#590d82",
    label: {
      word: "quantum",
      pms: "webgl · 04",
      color: "#0f2a1d",
      techs: ["three.js", "simplex", "phong"],
    },
    animationId: "quantum",
  },
  {
    id: "morph",
    title: "Morph",
    fallbackColor: "#101010",
    accentColor: "#fe0e55",
    textBgColor: "#101010",
    textColor: "#f4f4f4",
    position: { x: -0.7, y: 0 },
    backgroundColor: "#101010",
    blob1Color: "#fe0e55",
    blob2Color: "#3a0a1c",
    label: {
      word: "physics",
      pms: "webgl · 05",
      color: "#fe0e55",
      techs: ["three.js", "simplex", "lines"],
    },
    animationId: "physics",
  },
  {
    id: "spring",
    title: "Spring",
    fallbackColor: "#0f1617",
    accentColor: "#13756a",
    textBgColor: "#0f1617",
    textColor: "#f4f4f4",
    position: { x: 0.85, y: 0 },
    backgroundColor: "#0f1617",
    blob1Color: "#13756a",
    blob2Color: "#1f2d2c",
    label: {
      word: "heuristics",
      pms: "webgl · 06",
      color: "#13756a",
      techs: ["three.js", "simplex", "wireframe"],
    },
    animationId: "heuristics",
  },
  {
    id: "stagger",
    title: "Stagger",
    fallbackColor: "#191919",
    accentColor: "#3f51b5",
    textBgColor: "#191919",
    textColor: "#f4f4f4",
    position: { x: -0.8, y: 0 },
    backgroundColor: "#191919",
    blob1Color: "#3f51b5",
    blob2Color: "#4a4a4a",
    label: {
      word: "hawking",
      pms: "webgl · 07",
      color: "#3f51b5",
      techs: ["three.js", "lines", "sine"],
    },
    animationId: "hawking",
  },
  {
    id: "path",
    title: "Scroll Back",
    fallbackColor: "#1f4032",
    accentColor: "#1f4032",
    textBgColor: "#1f4032",
    textColor: "#f4f4f4",
    position: { x: 0.9, y: 0 },
    backgroundColor: "#234a3a",
    blob1Color: "#7fd5a8",
    blob2Color: "#cfeadf",
    label: { word: "scroll back", pms: "outro · 08", color: "#f4f4f4" },
  },
]
