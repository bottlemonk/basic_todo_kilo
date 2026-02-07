"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Priority, SortMode } from "@/lib/types"

interface SearchFilterProps {
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  selectedPriorities: Priority[]
  onTogglePriority: (priority: Priority) => void
  selectedTags: string[]
  onToggleTag: (tag: string) => void
  availableTags: string[]
  sortMode: SortMode
  onSortModeChange: (mode: SortMode) => void
}

const sortModes: Array<{ value: SortMode; label: string }> = [
  { value: "manual", label: "Manual" },
  { value: "priority", label: "Priority" },
  { value: "dueDate", label: "Due date" },
  { value: "createdAt", label: "Created" },
  { value: "alphabetical", label: "A-Z" },
]

export function SearchFilter({
  searchQuery,
  onSearchQueryChange,
  selectedPriorities,
  onTogglePriority,
  selectedTags,
  onToggleTag,
  availableTags,
  sortMode,
  onSortModeChange,
}: SearchFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-3 rounded-lg border bg-card p-3">
      <Input
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        placeholder="Search tasks..."
        className="h-11"
      />

      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md border bg-background px-3 text-sm font-medium"
        aria-expanded={isExpanded}
      >
        <SlidersHorizontal className="h-4 w-4" />
        {isExpanded ? "Hide Filters" : "Show Filters"}
      </button>

      {isExpanded && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-full text-xs font-medium text-muted-foreground">Priority</span>
            {(["P1", "P2", "P3"] as Priority[]).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => onTogglePriority(priority)}
                aria-pressed={selectedPriorities.includes(priority)}
                className={cn(
                  "min-h-11 rounded-md px-3 py-1 text-sm",
                  selectedPriorities.includes(priority)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {priority}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="w-full text-xs font-medium text-muted-foreground">Sort</span>
            {sortModes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => onSortModeChange(mode.value)}
                aria-pressed={sortMode === mode.value}
                className={cn(
                  "min-h-11 rounded-md px-3 py-1 text-sm",
                  sortMode === mode.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {availableTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-full text-xs font-medium text-muted-foreground">Tags</span>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  aria-pressed={selectedTags.includes(tag)}
                  className={cn(
                    "min-h-11 rounded-md px-3 py-1 text-sm",
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
