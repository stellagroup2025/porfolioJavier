"use client"

import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export function ContactButton() {
  return (
    <Button variant="outline" size="sm" className="rounded-full gap-2">
      <Mail size={14} />
      <span>Contact Me</span>
    </Button>
  )
}
