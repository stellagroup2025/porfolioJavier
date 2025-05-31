"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface LogoProps {
  onClick?: () => void
}

export function Logo({ onClick }: LogoProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      className="cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Image
        src="/images/jr-logo.png"
        alt="JR Logo"
        width={60}
        height={60}
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain filter invert brightness-0 contrast-100"
        priority
        style={{
          filter: "invert(1) brightness(2) contrast(1)",
          mixBlendMode: "normal",
        }}
      />
    </motion.button>
  )
}
