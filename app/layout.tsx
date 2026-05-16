import type React from "react"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TransitionProvider } from "@/components/page-transition/TransitionProvider"
import { LanguageProvider } from "@/lib/i18n"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "900"],
})

export const metadata = {
  title: "Javier Reyes | Portfolio",
  description: "Full Stack Developer especializado en crear aplicaciones web modernas",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <LanguageProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
