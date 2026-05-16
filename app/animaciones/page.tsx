"use client"

import dynamic from "next/dynamic"

const DepthGallery = dynamic(
  () => import("@/components/depth-gallery/DepthGallery").then((mod) => mod.DepthGallery),
  { ssr: false },
)

export default function AnimacionesPage() {
  return <DepthGallery />
}
