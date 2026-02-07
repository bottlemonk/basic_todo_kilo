import type { Priority, Todo } from "@/lib/types"

export const CURRENT_TODOS_VERSION = 2

interface LegacyTodo {
  id: string
  text: string
  priority: Priority
  completed: boolean
  createdAt: number
}

interface TodosEnvelope {
  version: number
  todos: Todo[]
}

interface TodosEnvelopeV1 {
  version: 1
  todos: Todo[]
}

interface TodosEnvelopeV2 {
  version: 2
  todos: Todo[]
}

function normalizeTodo(input: Partial<Todo> & LegacyTodo): Todo {
  const recurrence =
    input.recurrence === "daily" ||
    input.recurrence === "weekly" ||
    input.recurrence === "custom"
      ? input.recurrence
      : "none"

  const recurrenceIntervalDays =
    recurrence === "custom" && typeof input.recurrenceIntervalDays === "number"
      ? Math.max(1, Math.floor(input.recurrenceIntervalDays))
      : null

  return {
    id: input.id,
    text: input.text,
    priority: input.priority,
    completed: input.completed,
    createdAt: input.createdAt,
    dueDate: input.dueDate ?? null,
    tags: Array.isArray(input.tags) ? input.tags.filter(Boolean) : [],
    subtasks: Array.isArray(input.subtasks)
      ? input.subtasks
          .filter((subtask) => Boolean(subtask?.id && subtask?.text))
          .map((subtask) => ({
            id: subtask.id,
            text: subtask.text,
            completed: Boolean(subtask.completed),
          }))
      : [],
    notes: typeof input.notes === "string" ? input.notes : "",
    recurrence,
    recurrenceIntervalDays,
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isLegacyTodo(value: unknown): value is LegacyTodo & Partial<Todo> {
  if (!isObject(value)) {
    return false
  }

  return (
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    (value.priority === "P1" || value.priority === "P2" || value.priority === "P3") &&
    typeof value.completed === "boolean" &&
    typeof value.createdAt === "number"
  )
}

function migrateV1ToV2(input: TodosEnvelopeV1): TodosEnvelopeV2 {
  return {
    version: 2,
    todos: input.todos.map((todo) => normalizeTodo(todo)),
  }
}

export function migrateTodosPayload(payload: unknown): TodosEnvelope {
  let envelope: TodosEnvelope

  if (Array.isArray(payload)) {
    envelope = {
      version: 1,
      todos: payload
        .filter((item) => isLegacyTodo(item))
        .map((item) => normalizeTodo(item)),
    }
  } else if (isObject(payload) && typeof payload.version === "number" && Array.isArray(payload.todos)) {
    envelope = {
      version: payload.version,
      todos: payload.todos
        .filter((item) => isLegacyTodo(item))
        .map((item) => normalizeTodo(item)),
    }
  } else {
    envelope = { version: 2, todos: [] }
  }

  if (envelope.version === 1) {
    envelope = migrateV1ToV2(envelope as TodosEnvelopeV1)
  }

  return {
    version: CURRENT_TODOS_VERSION,
    todos: envelope.todos.map((todo) => normalizeTodo(todo)),
  }
}
