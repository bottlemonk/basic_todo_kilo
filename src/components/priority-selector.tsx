"use client"

import { PRIORITY_VALUES, type Priority } from "@/lib/types"
import { cn } from "@/lib/utils"

interface PrioritySelectorProps {
  value: Priority
  onChange: (priority: Priority) => void
  className?: string
  compact?: boolean
}

export function PrioritySelector({ value, onChange, className, compact = false }: PrioritySelectorProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {PRIORITY_VALUES.map((priority) => (
        <button
          key={priority}
          type="button"
          onClick={() => onChange(priority)}
          aria-pressed={value === priority}
          className={cn(
            "rounded-md px-3 font-medium transition-colors",
            compact ? "h-9 text-xs" : "min-h-11 text-sm",
            value === priority
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {priority}
        </button>
      ))}
    </div>
  )
}
