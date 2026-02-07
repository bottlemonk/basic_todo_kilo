import { z } from "zod"
import type { Todo } from "@/lib/types"
import { migrateTodosPayload } from "@/lib/migrations"

const todoImportSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  priority: z.enum(["P1", "P2", "P3"]),
  completed: z.boolean(),
  createdAt: z.number(),
  dueDate: z.number().nullable().optional(),
  tags: z.array(z.string()).default([]),
  subtasks: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1),
      completed: z.boolean(),
    })
  ).default([]),
  notes: z.string().optional().default(""),
  recurrence: z.enum(["none", "daily", "weekly", "custom"]).default("none"),
  recurrenceIntervalDays: z.number().nullable().optional().default(null),
})

const todoImportArraySchema = z.array(todoImportSchema)

function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportTodosAsJson(todos: Todo[]): string {
  return JSON.stringify({ version: 2, todos }, null, 2)
}

export function exportTodosAsCsv(todos: Todo[]): string {
  const header = ["id", "text", "priority", "completed", "createdAt", "dueDate", "tags", "subtasks", "notes", "recurrence", "recurrenceIntervalDays"]
  const lines = todos.map((todo) => [
    todo.id,
    todo.text,
    todo.priority,
    String(todo.completed),
    String(todo.createdAt),
    todo.dueDate ? String(todo.dueDate) : "",
    todo.tags.join("|"),
    String(todo.subtasks.length),
    todo.notes ?? "",
    todo.recurrence,
    todo.recurrenceIntervalDays ? String(todo.recurrenceIntervalDays) : "",
  ].map(escapeCsvValue).join(","))

  return [header.join(","), ...lines].join("\n")
}

export function exportTodosAsMarkdown(todos: Todo[]): string {
  const lines = ["# Priority Todo Export", ""]
  for (const todo of todos) {
    lines.push(`- [${todo.completed ? "x" : " "}] ${todo.text} (${todo.priority})`)
    if (todo.dueDate) {
      lines.push(`  - Due: ${new Date(todo.dueDate).toISOString().slice(0, 10)}`)
    }
    if (todo.tags.length > 0) {
      lines.push(`  - Tags: ${todo.tags.join(", ")}`)
    }
    if (todo.notes) {
      lines.push(`  - Notes: ${todo.notes}`)
    }
    if (todo.subtasks.length > 0) {
      lines.push(`  - Subtasks:`)
      for (const subtask of todo.subtasks) {
        lines.push(`    - [${subtask.completed ? "x" : " "}] ${subtask.text}`)
      }
    }
  }
  return lines.join("\n")
}

export function parseImportedTodos(rawText: string): Todo[] {
  const parsed = JSON.parse(rawText) as unknown
  const migrated = migrateTodosPayload(parsed)
  const validated = todoImportArraySchema.parse(migrated.todos)
  return validated
}
