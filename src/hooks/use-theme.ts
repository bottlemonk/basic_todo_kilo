"use client"

import { useEffect, useState } from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "priority-todo-app_theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light"
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark") {
    return stored
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) {
      return
    }

    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return { theme, toggleTheme, mounted }
}
