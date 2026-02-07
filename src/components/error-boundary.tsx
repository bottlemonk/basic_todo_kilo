"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error("Application error captured by ErrorBoundary:", error)
  }

  resetApp = () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear()
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="max-w-md rounded-lg border bg-card p-6 text-center">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The app hit an unexpected error. You can reset local data and reload.
            </p>
            <Button className="mt-4" onClick={this.resetApp}>
              Reset App
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
