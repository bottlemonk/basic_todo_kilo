"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PrioritySelector } from "@/components/priority-selector"
import { TagInput } from "@/components/tag-input"
import { dateValueToTimestamp } from "@/lib/utils"
import type { Priority } from "@/lib/types"
import { Plus } from "lucide-react"

interface TodoInputProps {
  onAdd: (text: string, priority: Priority, dueDate?: number | null, tags?: string[]) => void
  availableTags?: string[]
}

export function TodoInput({ onAdd, availableTags = [] }: TodoInputProps) {
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<Priority>("P2")
  const [dueDate, setDueDate] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim(), priority, dateValueToTimestamp(dueDate), tags)
      setText("")
      setDueDate("")
      setTags([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        <PrioritySelector value={priority} onChange={setPriority} />
        <Button type="submit" className="min-h-11 gap-2 px-4 sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </div>

      <TagInput
        value={tags}
        onChange={setTags}
        suggestions={availableTags}
        placeholder="Add tag to new task"
      />
    </form>
  )
}
