"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

let cachedLogoDataUrl: string | null = null
let cachedLogoPromise: Promise<string> | null = null

function loadLogoDataUrl(): Promise<string> {
  if (cachedLogoDataUrl) return Promise.resolve(cachedLogoDataUrl)
  if (cachedLogoPromise) return cachedLogoPromise

  cachedLogoPromise = new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = "/images/jr-logo.png"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("no context"))
        return
      }
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const lum = (r + g + b) / 3
        const darkness = Math.max(0, 1 - lum / 200)
        data[i] = 255
        data[i + 1] = 255
        data[i + 2] = 255
        data[i + 3] = Math.round(Math.min(1, darkness * 1.4) * 255)
      }
      ctx.putImageData(imageData, 0, 0)
      cachedLogoDataUrl = canvas.toDataURL("image/png")
      resolve(cachedLogoDataUrl)
    }
    img.onerror = reject
  })

  return cachedLogoPromise
}

interface LogoProps {
  onClick?: () => void
  className?: string
  interactive?: boolean
}

const DEFAULT_SIZE = "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"

export function Logo({ onClick, className, interactive = true }: LogoProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(cachedLogoDataUrl)

  useEffect(() => {
    if (dataUrl) return
    let cancelled = false
    loadLogoDataUrl()
      .then((url) => {
        if (!cancelled) setDataUrl(url)
      })
      .catch(() => {
        /* swallow */
      })
    return () => {
      cancelled = true
    }
  }, [dataUrl])

  const sizeClass = className ?? DEFAULT_SIZE
  const imgClass = cn(sizeClass, "object-contain block")

  if (!interactive) {
    return dataUrl ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img src={dataUrl} alt="JR Logo" className={imgClass} />
    ) : (
      <span className={cn("block", sizeClass)} />
    )
  }

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
        <img src={dataUrl} alt="JR Logo" className={imgClass} />
      ) : (
        <span className={cn("block", sizeClass)} />
      )}
    </motion.button>
  )
}
