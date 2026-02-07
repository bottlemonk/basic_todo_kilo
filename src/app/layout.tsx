import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Priority Todo",
  description: "A lightweight todo app with priority levels and drag-and-drop reordering",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster position="bottom-right" />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
