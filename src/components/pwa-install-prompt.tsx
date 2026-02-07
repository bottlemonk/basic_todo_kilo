"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  if (!installPrompt) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await installPrompt.prompt()
        await installPrompt.userChoice
        setInstallPrompt(null)
      }}
    >
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  )
}
