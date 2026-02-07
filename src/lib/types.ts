export type Priority = "P1" | "P2" | "P3"
export type SortMode = "manual" | "priority" | "dueDate" | "createdAt" | "alphabetical"
export type Recurrence = "none" | "daily" | "weekly" | "custom"

export interface Subtask {
  id: string
  text: string
  completed: boolean
}

export interface Todo {
  id: string
  text: string
  priority: Priority
  completed: boolean
  createdAt: number
  dueDate?: number | null
  tags: string[]
  subtasks: Subtask[]
  notes?: string
  recurrence: Recurrence
  recurrenceIntervalDays?: number | null
}

export interface TodoState {
  todos: Todo[]
  addTodo: (text: string, priority: Priority, dueDate?: number | null, tags?: string[]) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleComplete: (id: string) => void
  reorderTodos: (activeId: string, overId: string) => void
  clearCompleted: () => void
  importTodos: (todos: Todo[]) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  P1: "High",
  P2: "Medium",
  P3: "Low",
}

export const PRIORITY_VALUES: Priority[] = ["P1", "P2", "P3"]
