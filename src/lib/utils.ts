import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateValueToTimestamp(value: string): number | null {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day).getTime()
}

export function timestampToDateValue(timestamp?: number | null): string {
  if (!timestamp) {
    return ""
  }

  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getDueDateMeta(dueDate?: number | null): { label: string; className: string } | null {
  if (!dueDate) {
    return null
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const target = new Date(dueDate)
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime()
  const dayDiff = Math.round((targetDay - today) / (1000 * 60 * 60 * 24))

  if (dayDiff < 0) {
    return {
      label: `Overdue ${Math.abs(dayDiff)}d`,
      className: "bg-red-100 text-red-700",
    }
  }

  if (dayDiff === 0) {
    return {
      label: "Due today",
      className: "bg-amber-100 text-amber-700",
    }
  }

  return {
    label: `Due in ${dayDiff}d`,
    className: "bg-muted text-muted-foreground",
  }
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diffMs = now - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) {
    return "just now"
  }

  if (diffMs < hour) {
    return `${Math.floor(diffMs / minute)}m ago`
  }

  if (diffMs < day) {
    return `${Math.floor(diffMs / hour)}h ago`
  }

  if (diffMs < 2 * day) {
    return "yesterday"
  }

  return `${Math.floor(diffMs / day)}d ago`
}
