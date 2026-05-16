"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface LogoProps {
  onClick?: () => void
}

export function Logo({ onClick }: LogoProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = "/images/jr-logo.png"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data
      // Convert dark pixels to opaque white, light pixels to fully transparent.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const lum = (r + g + b) / 3
        // Pixels darker than 200/255 keep visibility (the lines of the letters);
        // smooth fade to transparent for antialiased edges.
        const darkness = Math.max(0, 1 - lum / 200)
        data[i] = 255
        data[i + 1] = 255
        data[i + 2] = 255
        data[i + 3] = Math.round(Math.min(1, darkness * 1.4) * 255)
      }
      ctx.putImageData(imageData, 0, 0)
      setDataUrl(canvas.toDataURL("image/png"))
    }
  }, [])

  return (
    <motion.button
      onClick={onClick}
      className="cursor-pointer border-0 bg-transparent p-0 outline-none focus:outline-none focus-visible:outline-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Javier Reyes"
    >
      {dataUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={dataUrl}
          alt="JR Logo"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain block"
        />
      ) : (
        <span className="block w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28" />
      )}
    </motion.button>
  )
}
