"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { PrioritySelector } from "@/components/priority-selector"
import { TagInput } from "@/components/tag-input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn, dateValueToTimestamp, timestampToDateValue } from "@/lib/utils"
import type { Subtask, Todo } from "@/lib/types"

interface TaskEditModalProps {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
  tagSuggestions?: string[]
  readOnly?: boolean
}

function generateSubtaskId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function TaskEditModal({
  todo,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  tagSuggestions = [],
  readOnly = false,
}: TaskEditModalProps) {
  const [subtaskDraft, setSubtaskDraft] = useState("")
  const [customRecurrenceDays, setCustomRecurrenceDays] = useState(
    todo.recurrenceIntervalDays ? String(todo.recurrenceIntervalDays) : "1"
  )

  useEffect(() => {
    setCustomRecurrenceDays(todo.recurrenceIntervalDays ? String(todo.recurrenceIntervalDays) : "1")
  }, [todo.recurrenceIntervalDays])

  const updateSubtasks = (nextSubtasks: Subtask[]) => {
    const allCompleted = nextSubtasks.length > 0 && nextSubtasks.every((subtask) => subtask.completed)
    let nextCompleted = todo.completed
    if (allCompleted) {
      nextCompleted = true
    } else if (todo.completed && nextSubtasks.some((subtask) => !subtask.completed)) {
      nextCompleted = false
    }

    onUpdate(todo.id, {
      subtasks: nextSubtasks,
      completed: nextCompleted,
    })
  }

  const addSubtask = () => {
    const nextText = subtaskDraft.trim()
    if (!nextText) {
      return
    }

    updateSubtasks([
      ...todo.subtasks,
      { id: generateSubtaskId(), text: nextText, completed: false },
    ])
    setSubtaskDraft("")
  }

  const toggleSubtask = (id: string) => {
    updateSubtasks(
      todo.subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
      )
    )
  }

  const removeSubtask = (id: string) => {
    updateSubtasks(todo.subtasks.filter((subtask) => subtask.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>{todo.text}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Due date</label>
            <Input
              type="date"
              value={timestampToDateValue(todo.dueDate)}
              onChange={(event) =>
                onUpdate(todo.id, { dueDate: dateValueToTimestamp(event.target.value) })
              }
              className="h-11 w-full sm:w-48"
              disabled={readOnly}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Priority</label>
            <PrioritySelector
              value={todo.priority}
              onChange={(priority) => onUpdate(todo.id, { priority })}
              compact
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Recurrence</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={todo.recurrence}
                onChange={(event) => {
                  const recurrence = event.target.value as Todo["recurrence"]
                  onUpdate(todo.id, {
                    recurrence,
                    recurrenceIntervalDays:
                      recurrence === "custom"
                        ? Math.max(1, Number(customRecurrenceDays) || 1)
                        : null,
                  })
                }}
                className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                disabled={readOnly}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>

              {todo.recurrence === "custom" && (
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={customRecurrenceDays}
                  onChange={(event) => setCustomRecurrenceDays(event.target.value)}
                  onBlur={() =>
                    onUpdate(todo.id, {
                      recurrenceIntervalDays: Math.max(1, Number(customRecurrenceDays) || 1),
                    })
                  }
                  className="h-11 w-full sm:w-28"
                  disabled={readOnly}
                />
              )}
            </div>
          </div>

          <TagInput
            value={todo.tags}
            onChange={(tags) => onUpdate(todo.id, { tags })}
            suggestions={tagSuggestions}
            placeholder="Add tag"
            className={cn(readOnly && "pointer-events-none opacity-60")}
          />

          <div className="space-y-2 rounded-md bg-black/5 p-2">
            <div className="text-xs font-medium text-muted-foreground">Subtasks</div>
            {todo.subtasks.length > 0 ? (
              <div className="space-y-1">
                {todo.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => toggleSubtask(subtask.id)}
                      disabled={readOnly}
                    />
                    <span
                      className={cn("flex-1 text-xs", subtask.completed && "line-through opacity-50")}
                    >
                      {subtask.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                      disabled={readOnly}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No subtasks yet</p>
            )}

            <div className="flex gap-2">
              <Input
                value={subtaskDraft}
                onChange={(event) => setSubtaskDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    addSubtask()
                  }
                }}
                placeholder="Add subtask"
                className="h-10 text-xs"
                disabled={readOnly}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="min-h-10"
                onClick={addSubtask}
                disabled={readOnly}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <textarea
              value={todo.notes ?? ""}
              onChange={(event) => onUpdate(todo.id, { notes: event.target.value })}
              placeholder="Add details for this task..."
              className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
              disabled={readOnly}
            />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="min-h-11 w-full border-destructive/40 text-destructive hover:text-destructive"
                disabled={readOnly}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete task?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete(todo.id)
                    onOpenChange(false)
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="min-h-11 w-full"
            onClick={() => onOpenChange(false)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
