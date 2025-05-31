"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  return (
    <Button variant="ghost" size="icon" className="rounded-full">
      <Globe size={18} />
      <span className="sr-only">Change language</span>
    </Button>
  )
}
