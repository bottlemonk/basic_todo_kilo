"use client"

import { useState, useEffect, useCallback } from "react"
import { arrayMove } from "@dnd-kit/sortable"
import { z } from "zod"
import type { Todo, Priority, TodoState } from "@/lib/types"
import { save, load, isStorageAvailable } from "@/lib/storage"
import { CURRENT_TODOS_VERSION, migrateTodosPayload } from "@/lib/migrations"

// Zod schema for todo validation
const todoSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  priority: z.enum(["P1", "P2", "P3"]),
  completed: z.boolean(),
  createdAt: z.number(),
  dueDate: z.number().nullable().optional(),
  tags: z.array(z.string()).default([]),
  subtasks: z.array(z.object({
    id: z.string(),
    text: z.string().min(1),
    completed: z.boolean(),
  })).default([]),
  notes: z.string().optional().default(""),
  recurrence: z.enum(["none", "daily", "weekly", "custom"]).default("none"),
  recurrenceIntervalDays: z.number().nullable().optional().default(null),
})

const todosSchema = z.array(todoSchema)
const todosEnvelopeSchema = z.object({
  version: z.number(),
  todos: todosSchema,
})

const STORAGE_KEY = "priority-todo-app_todos"
const MAX_HISTORY = 20

function generateTodoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useTodos(): TodoState {
  const [undoStack, setUndoStack] = useState<Todo[][]>([])
  const [redoStack, setRedoStack] = useState<Todo[][]>([])
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (!isStorageAvailable()) {
      return []
    }

    try {
      const stored = load<unknown>(STORAGE_KEY, [])
      const migrated = migrateTodosPayload(stored)
      const result = todosEnvelopeSchema.safeParse(migrated)
      if (result.success) {
        return result.data.todos
      } else {
        console.warn("Invalid todos data in localStorage, using empty array")
        return []
      }
    } catch (error) {
      console.error("Failed to load todos:", error)
      return []
    }
  })

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    if (!isStorageAvailable()) {
      return
    }

    const result = todosSchema.safeParse(todos)
    if (result.success) {
      save(STORAGE_KEY, {
        version: CURRENT_TODOS_VERSION,
        todos: result.data,
      })
    } else {
      console.error("Failed to validate todos for storage:", result.error)
    }
  }, [todos])

  const cloneTodos = (value: Todo[]) => value.map((todo) => ({ ...todo, tags: [...todo.tags], subtasks: todo.subtasks.map((s) => ({ ...s })) }))

  const recordHistory = useCallback((previous: Todo[]) => {
    setUndoStack((stack) => [...stack.slice(-MAX_HISTORY + 1), cloneTodos(previous)])
    setRedoStack([])
  }, [])

  const applyMutation = useCallback((updater: (prev: Todo[]) => Todo[]) => {
    setTodos((prev) => {
      const next = updater(prev)
      if (next !== prev) {
        recordHistory(prev)
      }
      return next
    })
  }, [recordHistory])

  const addTodo = useCallback((text: string, priority: Priority, dueDate: number | null = null, tags: string[] = []) => {
    const newTodo: Todo = {
      id: generateTodoId(),
      text: text.trim(),
      priority,
      completed: false,
      createdAt: Date.now(),
      dueDate,
      tags,
      subtasks: [],
      notes: "",
      recurrence: "none",
      recurrenceIntervalDays: null,
    }
    applyMutation((prev) => [...prev, newTodo])
  }, [applyMutation])

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    applyMutation((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    )
  }, [applyMutation])

  const deleteTodo = useCallback((id: string) => {
    applyMutation((prev) => prev.filter((todo) => todo.id !== id))
  }, [applyMutation])

  const toggleComplete = useCallback((id: string) => {
    applyMutation((prev) => {
      const target = prev.find((todo) => todo.id === id)
      if (!target) {
        return prev
      }

      const toggled = prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )

      if (target.completed) {
        return toggled
      }

      if (target.recurrence === "none") {
        return toggled
      }

      const intervalDays =
        target.recurrence === "daily"
          ? 1
          : target.recurrence === "weekly"
          ? 7
          : target.recurrenceIntervalDays && target.recurrenceIntervalDays > 0
          ? target.recurrenceIntervalDays
          : 1

      const baseDate = target.dueDate ?? Date.now()
      const nextDueDate = baseDate + intervalDays * 24 * 60 * 60 * 1000

      const recurringClone: Todo = {
        ...target,
        id: generateTodoId(),
        completed: false,
        createdAt: Date.now(),
        dueDate: nextDueDate,
        subtasks: target.subtasks.map((subtask) => ({ ...subtask, completed: false })),
      }

      return [...toggled, recurringClone]
    })
  }, [applyMutation])

  const reorderTodos = useCallback((activeId: string, overId: string) => {
    applyMutation((prev) => {
      const oldIndex = prev.findIndex((todo) => todo.id === activeId)
      const newIndex = prev.findIndex((todo) => todo.id === overId)

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prev
      }

      return arrayMove(prev, oldIndex, newIndex)
    })
  }, [applyMutation])

  const clearCompleted = useCallback(() => {
    applyMutation((prev) => prev.filter((todo) => !todo.completed))
  }, [applyMutation])

  const importTodos = useCallback((nextTodos: Todo[]) => {
    applyMutation(() => nextTodos)
  }, [applyMutation])

  const undo = useCallback(() => {
    if (undoStack.length === 0) {
      return
    }

    const previous = undoStack[undoStack.length - 1]
    const nextUndo = undoStack.slice(0, -1)
    setUndoStack(nextUndo)
    setRedoStack((stack) => [...stack.slice(-MAX_HISTORY + 1), cloneTodos(todos)])
    setTodos(cloneTodos(previous))
  }, [todos, undoStack])

  const redo = useCallback(() => {
    if (redoStack.length === 0) {
      return
    }

    const next = redoStack[redoStack.length - 1]
    const nextRedo = redoStack.slice(0, -1)
    setRedoStack(nextRedo)
    setUndoStack((stack) => [...stack.slice(-MAX_HISTORY + 1), cloneTodos(todos)])
    setTodos(cloneTodos(next))
  }, [redoStack, todos])

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    reorderTodos,
    clearCompleted,
    importTodos,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  }
}
