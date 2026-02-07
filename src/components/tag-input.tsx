"use client"

import { useMemo, useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  className?: string
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add tag",
  className,
}: TagInputProps) {
  const [draft, setDraft] = useState("")
  const normalizedValue = useMemo(
    () => value.map((tag) => tag.trim()).filter(Boolean),
    [value]
  )

  const addTag = (raw: string) => {
    const next = raw.trim()
    if (!next) {
      return
    }

    const alreadyExists = normalizedValue.some(
      (tag) => tag.toLowerCase() === next.toLowerCase()
    )
    if (!alreadyExists) {
      onChange([...normalizedValue, next])
    }
    setDraft("")
  }

  const removeTag = (tagToRemove: string) => {
    onChange(normalizedValue.filter((tag) => tag !== tagToRemove))
  }

  const filteredSuggestions = suggestions
    .filter((suggestion) => !normalizedValue.includes(suggestion))
    .filter((suggestion) =>
      draft.trim().length === 0
        ? false
        : suggestion.toLowerCase().includes(draft.toLowerCase())
    )
    .slice(0, 4)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addTag(draft)
            }
          }}
          className="h-11"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => addTag(draft)}
          className="min-h-11"
        >
          Add
        </Button>
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="min-h-10 rounded-md bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {normalizedValue.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {normalizedValue.map((tag) => (
            <span
              key={tag}
              className="inline-flex min-h-9 items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
