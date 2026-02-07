"use client"

import type { Priority, Todo } from "@/lib/types"

interface ProgressBarProps {
  todos: Todo[]
}

export function ProgressBar({ todos }: ProgressBarProps) {
  const total = todos.length
  const completed = todos.filter((todo) => todo.completed).length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  const priorityCounts = (["P1", "P2", "P3"] as Priority[]).reduce(
    (acc, priority) => {
      acc[priority] = todos.filter((todo) => todo.priority === priority).length
      return acc
    },
    {} as Record<Priority, number>
  )

  return (
    <div className="mb-6 space-y-2 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Progress: {completed}/{total}
        </span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>P1: {priorityCounts.P1}</span>
        <span>P2: {priorityCounts.P2}</span>
        <span>P3: {priorityCounts.P3}</span>
      </div>
    </div>
  )
}
