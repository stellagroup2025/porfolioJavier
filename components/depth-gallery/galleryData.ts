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
  }
}

export const galleryPlaneData: GalleryPlane[] = [
  {
    id: "fade",
    title: "Fade",
    fallbackColor: "#feca4f",
    accentColor: "#feca4f",
    textBgColor: "#feca4f",
    textColor: "#1a1a1a",
    position: { x: -0.9, y: 0 },
    backgroundColor: "#fffaf0",
    blob1Color: "#ffdf94",
    blob2Color: "#fce7c4",
    label: { word: "fade in", pms: "transition · 01", color: "#2e2e2e" },
  },
  {
    id: "scale",
    title: "Scale",
    fallbackColor: "#80455a",
    accentColor: "#80455a",
    textBgColor: "#80455a",
    textColor: "#f4f4f4",
    position: { x: 0.8, y: 0 },
    backgroundColor: "#fffaf0",
    blob1Color: "#d29a41",
    blob2Color: "#bb96af",
    label: { word: "scale pulse", pms: "transform · 02", color: "#2e2e2e" },
  },
  {
    id: "rotate",
    title: "Rotate",
    fallbackColor: "#fa7b71",
    accentColor: "#fa7b71",
    textBgColor: "#fa7b71",
    textColor: "#1a1a1a",
    position: { x: -0.7, y: 0 },
    backgroundColor: "#5f81ab",
    blob1Color: "#f88b8d",
    blob2Color: "#cfbbdd",
    label: { word: "rotate loop", pms: "transform · 03", color: "#f4f4f4" },
  },
  {
    id: "slide",
    title: "Slide",
    fallbackColor: "#3c72c6",
    accentColor: "#3c72c6",
    textBgColor: "#3c72c6",
    textColor: "#f4f4f4",
    position: { x: 1, y: 0 },
    backgroundColor: "#5b9bc2",
    blob1Color: "#ffaa00",
    blob2Color: "#00e1ff",
    label: { word: "slide x", pms: "motion · 04", color: "#f4f4f4" },
  },
  {
    id: "morph",
    title: "Morph",
    fallbackColor: "#fdd895",
    accentColor: "#fdd895",
    textBgColor: "#fdd895",
    textColor: "#1a1a1a",
    position: { x: -0.7, y: 0 },
    backgroundColor: "#7d936e",
    blob1Color: "#fdd895",
    blob2Color: "#a5b599",
    label: { word: "morph shape", pms: "shape · 05", color: "#f4f4f4" },
  },
  {
    id: "spring",
    title: "Spring",
    fallbackColor: "#0f1d2e",
    accentColor: "#0f1d2e",
    textBgColor: "#0f1d2e",
    textColor: "#f8f8f8",
    position: { x: 0.85, y: 0 },
    backgroundColor: "#1c2f47",
    blob1Color: "#ff7c5c",
    blob2Color: "#5cb8ff",
    label: { word: "spring hover", pms: "physics · 06", color: "#f4f4f4" },
  },
  {
    id: "stagger",
    title: "Stagger",
    fallbackColor: "#e8e1d4",
    accentColor: "#1a1a1a",
    textBgColor: "#e8e1d4",
    textColor: "#1a1a1a",
    position: { x: -0.8, y: 0 },
    backgroundColor: "#f4eee0",
    blob1Color: "#c8b291",
    blob2Color: "#999079",
    label: { word: "stagger", pms: "sequence · 07", color: "#2e2e2e" },
  },
  {
    id: "path",
    title: "Path",
    fallbackColor: "#1f4032",
    accentColor: "#1f4032",
    textBgColor: "#1f4032",
    textColor: "#f4f4f4",
    position: { x: 0.9, y: 0 },
    backgroundColor: "#234a3a",
    blob1Color: "#7fd5a8",
    blob2Color: "#cfeadf",
    label: { word: "path draw", pms: "svg · 08", color: "#f4f4f4" },
  },
]
