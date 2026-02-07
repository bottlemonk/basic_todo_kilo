"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { FileText, GripVertical, SquarePen } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TaskEditModal } from "@/components/task-edit-modal"
import { cn, formatRelativeTime, getDueDateMeta } from "@/lib/utils"
import type { Todo } from "@/lib/types"

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  tagSuggestions?: string[]
  dragDisabled?: boolean
  readOnly?: boolean
  isTouchActive?: boolean
}

export function TodoItem({
  todo,
  onUpdate,
  onToggleComplete,
  onDelete,
  tagSuggestions = [],
  dragDisabled = false,
  readOnly = false,
  isTouchActive = false,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)
  const skipBlurSaveRef = useRef(false)
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: dragDisabled || readOnly || isEditing || isEditModalOpen })

  useEffect(() => {
    setEditText(todo.text)
  }, [todo.text])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current)
      }
    }
  }, [])

  const dueMeta = getDueDateMeta(todo.dueDate)
  const subtaskSummary = useMemo(() => {
    if (todo.subtasks.length === 0) {
      return null
    }
    const completed = todo.subtasks.filter((subtask) => subtask.completed).length
    return `${completed}/${todo.subtasks.length}`
  }, [todo.subtasks])

  const startEditing = () => {
    if (readOnly) {
      return
    }
    setEditText(todo.text)
    setIsEditing(true)
  }

  const saveEdit = () => {
    const nextText = editText.trim()
    if (nextText.length > 0 && nextText !== todo.text) {
      onUpdate(todo.id, { text: nextText })
    }
    setEditText(todo.text)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const priorityColors: Record<Todo["priority"], string> = {
    P1: "bg-priority-p1 hover:bg-priority-p1-hover text-priority-p1-text",
    P2: "bg-priority-p2 hover:bg-priority-p2-hover text-priority-p2-text",
    P3: "bg-priority-p3 hover:bg-priority-p3-hover text-priority-p3-text",
  }

  const isExiting = isCompleting || isDeleting

  return (
    <>
      <div
        ref={setNodeRef}
        role="listitem"
        tabIndex={0}
        onKeyDown={(event) => {
          if (readOnly || isEditing) {
            return
          }
          if (event.key === "1" || event.key === "2" || event.key === "3") {
            event.preventDefault()
            const priority = `P${event.key}` as Todo["priority"]
            onUpdate(todo.id, { priority })
          }
        }}
        className={cn(
          "group relative rounded-lg p-3 transition-shadow animate-in fade-in slide-in-from-top-1 duration-200",
          priorityColors[todo.priority],
          isExiting && "animate-out fade-out slide-out-to-top-1 duration-200 pointer-events-none",
          isDragging && "shadow-lg z-50 opacity-0 pointer-events-none",
          !readOnly && "hover:shadow-md",
          isTouchActive && "ring-2 ring-ring"
        )}
        style={{
          transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
          transition,
        }}
        data-dnd-kit-dragging={isDragging}
      >
        <div className="flex items-center gap-3">
          {!dragDisabled && !readOnly && (
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-priority-p1-text/70 hover:text-priority-p1-text transition-colors p-2 touch-none"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-6 w-6" />
            </button>
          )}

          <Checkbox
            checked={todo.completed}
            onCheckedChange={(checked) => {
              if (readOnly) {
                return
              }

              const shouldComplete = checked === true && !todo.completed
              if (!shouldComplete) {
                onToggleComplete(todo.id)
                return
              }

              setIsCompleting(true)
              exitTimeoutRef.current = setTimeout(() => {
                onToggleComplete(todo.id)
              }, 180)
            }}
            className="h-6 w-6 flex-shrink-0"
            disabled={readOnly}
          />

          {isEditing ? (
            <Input
              ref={inputRef}
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              onBlur={() => {
                if (skipBlurSaveRef.current) {
                  skipBlurSaveRef.current = false
                  return
                }
                saveEdit()
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  saveEdit()
                }

                if (event.key === "Escape") {
                  event.preventDefault()
                  skipBlurSaveRef.current = true
                  cancelEdit()
                }
              }}
              className="h-10 flex-1 bg-transparent"
              aria-label="Edit task text"
            />
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={cn("truncate text-sm cursor-text", todo.completed && "line-through opacity-50")}
                onDoubleClick={startEditing}
              >
                {todo.text}
              </span>
              <span className="rounded-md bg-black/10 px-2 py-0.5 text-xs">{todo.priority}</span>
              {dueMeta && <span className={cn("rounded-md px-2 py-0.5 text-xs", dueMeta.className)}>{dueMeta.label}</span>}
              {subtaskSummary && <span className="rounded-md bg-black/10 px-2 py-0.5 text-xs">{subtaskSummary}</span>}
              {todo.notes && (
                <span className="rounded-md bg-black/10 px-2 py-0.5 text-xs inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Notes
                </span>
              )}
              <span className="text-xs text-muted-foreground">{formatRelativeTime(todo.createdAt)}</span>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => setIsEditModalOpen(true)}
            aria-label="Edit task"
            disabled={readOnly}
          >
            <SquarePen className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TaskEditModal
        todo={todo}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUpdate={onUpdate}
        onDelete={(id) => {
          setIsDeleting(true)
          exitTimeoutRef.current = setTimeout(() => {
            onDelete(id)
          }, 180)
        }}
        tagSuggestions={tagSuggestions}
        readOnly={readOnly}
      />
    </>
  )
}
