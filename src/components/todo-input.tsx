"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { dateValueToTimestamp } from "@/lib/utils"
import type { Priority } from "@/lib/types"

interface TodoInputProps {
  onAdd: (text: string, priority: Priority, dueDate?: number | null, tags?: string[]) => void
  availableTags?: string[]
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim(), "P2", dateValueToTimestamp(dueDate))
      setText("")
      setDueDate("")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          className="h-11 flex-1"
          data-todo-input="true"
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="h-11 w-full sm:w-44"
          aria-label="Due date"
        />
        <Button type="submit" className="min-h-11 px-4 sm:w-auto">
          Add
        </Button>
      </div>
    </form>
  )
}
