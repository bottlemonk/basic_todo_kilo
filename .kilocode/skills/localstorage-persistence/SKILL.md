---
name: localstorage-persistence
description: Implement robust localStorage persistence with error handling and data validation. This skill should be used when building applications that need to persist data across sessions, implementing offline-first features, or creating apps that work without a backend.
license: Complete terms in LICENSE.txt
metadata:
  category: development
  source:
    repository: https://github.com/ComposioHQ/awesome-claude-skills
    path: localstorage-persistence
---

# localStorage Persistence

This skill provides a complete pattern for persisting application state to localStorage. It includes error handling, data validation, migration support, and TypeScript type safety.

## Purpose

Implement robust localStorage persistence with error handling, data validation, and TypeScript type safety for applications that need to persist data across sessions.

## When to Use

- Building applications that need to persist data across sessions
- Implementing offline-first features
- Creating apps that work without a backend
- Storing user preferences and settings
- Caching data for performance

## Setup Process

### Step 1: Install Dependencies

Install Zod for data validation:

```bash
npm install zod
```

### Step 2: Create Storage Utilities

Create `lib/storage.ts` with storage utility functions:

```typescript
/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Get storage usage information
 */
export function getStorageUsage(): { used: number; total: number; percentage: number } {
  if (!isStorageAvailable()) {
    return { used: 0, total: 0, percentage: 0 }
  }

  let used = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length
    }
  }

  // localStorage typically has ~5MB limit
  const total = 5 * 1024 * 1024
  return {
    used,
    total,
    percentage: (used / total) * 100,
  }
}

/**
 * Save data to localStorage
 */
export function save<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available")
    return false
  }

  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error(`Failed to save to localStorage (key: ${key}):`, error)
    return false
  }
}

/**
 * Load data from localStorage
 */
export function load<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) {
    return defaultValue
  }

  try {
    const serialized = localStorage.getItem(key)
    if (serialized === null) {
      return defaultValue
    }
    return JSON.parse(serialized) as T
  } catch (error) {
    console.error(`Failed to load from localStorage (key: ${key}):`, error)
    return defaultValue
  }
}

/**
 * Remove data from localStorage
 */
export function remove(key: string): boolean {
  if (!isStorageAvailable()) {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Failed to remove from localStorage (key: ${key}):`, error)
    return false
  }
}

/**
 * Clear all localStorage data
 */
export function clear(): boolean {
  if (!isStorageAvailable()) {
    return false
  }

  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error("Failed to clear localStorage:", error)
    return false
  }
}

/**
 * Get all keys from localStorage
 */
export function getKeys(): string[] {
  if (!isStorageAvailable()) {
    return []
  }

  try {
    return Object.keys(localStorage)
  } catch (error) {
    console.error("Failed to get localStorage keys:", error)
    return []
  }
}
```

### Step 3: Create useLocalStorage Hook

Create `hooks/use-local-storage.ts`:

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"
import { save, load, remove, isStorageAvailable } from "@/lib/storage"

interface UseLocalStorageOptions<T> {
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
  validate?: (value: unknown) => value is T
  onWriteError?: (error: Error) => void
  onReadError?: (error: Error) => void
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    validate,
    onWriteError,
    onReadError,
  } = options

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isStorageAvailable()) {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }

      const parsed = deserialize(item)
      if (validate && !validate(parsed)) {
        console.warn(`Invalid data in localStorage for key "${key}", using initial value`)
        return initialValue
      }

      return parsed
    } catch (error) {
      onReadError?.(error as Error)
      return initialValue
    }
  })

  // Update localStorage when value changes
  useEffect(() => {
    if (!isStorageAvailable()) {
      return
    }

    try {
      window.localStorage.setItem(key, serialize(storedValue))
    } catch (error) {
      onWriteError?.(error as Error)
    }
  }, [key, storedValue, serialize, onWriteError])

  // Return a wrapped version of useState's setter function
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
      } catch (error) {
        onWriteError?.(error as Error)
      }
    },
    [storedValue, onWriteError]
  )

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      onWriteError?.(error as Error)
    }
  }, [key, initialValue, onWriteError])

  return [storedValue, setValue, removeValue]
}
```

### Step 4: Create Data Validation Schemas

Create `lib/schemas.ts` with Zod schemas:

```typescript
import { z } from "zod"

// Example: Todo schema
export const todoSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Todo text is required"),
  completed: z.boolean(),
  priority: z.enum(["P1", "P2", "P3"]),
  createdAt: z.number(),
})

export type Todo = z.infer<typeof todoSchema>

// Example: Todos array schema
export const todosSchema = z.array(todoSchema)

// Example: User preferences schema
export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.string().default("en"),
  notifications: z.boolean().default(true),
})

export type UserPreferences = z.infer<typeof userPreferencesSchema>

// Validation function
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data)
  if (result.success) {
    return result.data
  }
  console.warn("Validation failed:", result.error.errors)
  return null
}
```

### Step 5: Create Storage Migration System

Create `lib/storage-migrations.ts`:

```typescript
export interface Migration<T> {
  version: number
  migrate: (data: unknown) => T
}

export class StorageMigrator<T> {
  private migrations: Map<number, Migration<T>> = new Map()
  private key: string
  private currentVersion: number

  constructor(key: string, currentVersion: number) {
    this.key = key
    this.currentVersion = currentVersion
  }

  addMigration(migration: Migration<T>): this {
    this.migrations.set(migration.version, migration)
    return this
  }

  migrate(data: unknown, dataVersion: number): T {
    if (dataVersion >= this.currentVersion) {
      return data as T
    }

    let result = data
    for (let version = dataVersion + 1; version <= this.currentVersion; version++) {
      const migration = this.migrations.get(version)
      if (migration) {
        result = migration.migrate(result)
      }
    }

    return result as T
  }

  getDataVersion(): number {
    const versionKey = `${this.key}__version`
    const version = localStorage.getItem(versionKey)
    return version ? parseInt(version, 10) : 0
  }

  setDataVersion(version: number): void {
    const versionKey = `${this.key}__version`
    localStorage.setItem(versionKey, version.toString())
  }
}
```

### Step 6: Create Typed Storage Hook

Create `hooks/use-typed-storage.ts` for type-safe storage with validation:

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"
import { z } from "zod"
import { isStorageAvailable } from "@/lib/storage"

interface UseTypedStorageOptions<T> {
  schema: z.ZodSchema<T>
  onWriteError?: (error: Error) => void
  onValidationError?: (error: z.ZodError) => void
}

export function useTypedStorage<T>(
  key: string,
  initialValue: T,
  options: UseTypedStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { schema, onWriteError, onValidationError } = options

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isStorageAvailable()) {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }

      const parsed = JSON.parse(item)
      const result = schema.safeParse(parsed)

      if (result.success) {
        return result.data
      } else {
        onValidationError?.(result.error)
        return initialValue
      }
    } catch (error) {
      onWriteError?.(error as Error)
      return initialValue
    }
  })

  useEffect(() => {
    if (!isStorageAvailable()) {
      return
    }

    try {
      const result = schema.safeParse(storedValue)
      if (result.success) {
        window.localStorage.setItem(key, JSON.stringify(result.data))
      } else {
        onValidationError?.(result.error)
      }
    } catch (error) {
      onWriteError?.(error as Error)
    }
  }, [key, storedValue, schema, onWriteError, onValidationError])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
      } catch (error) {
        onWriteError?.(error as Error)
      }
    },
    [storedValue, onWriteError]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      onWriteError?.(error as Error)
    }
  }, [key, initialValue, onWriteError])

  return [storedValue, setValue, removeValue]
}
```

### Step 7: Usage Examples

#### Basic Usage

```tsx
"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"

export function Counter() {
  const [count, setCount] = useLocalStorage("counter", 0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}
```

#### With Validation

```tsx
"use client"

import { useTypedStorage } from "@/hooks/use-typed-storage"
import { todoSchema, type Todo } from "@/lib/schemas"

export function TodoApp() {
  const [todos, setTodos, clearTodos] = useTypedStorage(
    "todos",
    [],
    {
      schema: z.array(todoSchema),
      onValidationError: (error) => {
        console.error("Invalid todo data:", error)
      },
    }
  )

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority: "P2",
      createdAt: Date.now(),
    }
    setTodos([...todos, newTodo])
  }

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      <button onClick={() => addTodo("New todo")}>Add Todo</button>
      <button onClick={clearTodos}>Clear All</button>
    </div>
  )
}
```

#### With Migrations

```tsx
"use client"

import { useEffect } from "react"
import { StorageMigrator } from "@/lib/storage-migrations"
import { todoSchema, type Todo } from "@/lib/schemas"

const migrator = new StorageMigrator<Todo[]>("todos", 2)
  .addMigration({
    version: 1,
    migrate: (data) => {
      // Migration from version 0 to 1: Add priority field
      return (data as Todo[]).map((todo) => ({
        ...todo,
        priority: todo.priority || "P2",
      }))
    },
  })
  .addMigration({
    version: 2,
    migrate: (data) => {
      // Migration from version 1 to 2: Add createdAt field
      return (data as Todo[]).map((todo) => ({
        ...todo,
        createdAt: todo.createdAt || Date.now(),
      }))
    },
  })

export function MigratedTodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const dataVersion = migrator.getDataVersion()
    const stored = localStorage.getItem("todos")

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return migrator.migrate(parsed, dataVersion)
      } catch {
        return []
      }
    }

    return []
  })

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
    migrator.setDataVersion(2)
  }, [todos])

  return <div>{/* ... */}</div>
}
```

## Error Handling

### Quota Exceeded

Handle localStorage quota exceeded errors:

```tsx
const [data, setData, clearData] = useLocalStorage("large-data", [], {
  onWriteError: (error) => {
    if (error.name === "QuotaExceededError") {
      alert("Storage is full. Please clear some data.")
      // Alternatively, implement cleanup logic
      clearData()
    }
  },
})
```

### Corrupted Data

Handle corrupted or invalid data:

```tsx
const [data, setData] = useLocalStorage("data", [], {
  validate: (value): value is Todo[] => {
    return Array.isArray(value) && value.every(isValidTodo)
  },
})
```

## SSR Compatibility

The hooks are SSR-safe and will return the initial value on the server:

```tsx
"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"

export function ServerComponent() {
  // Works on both server and client
  const [theme, setTheme] = useLocalStorage("theme", "light")

  return <div>Current theme: {theme}</div>
}
```

## Performance Tips

1. **Debounce writes:** For frequently changing data, debounce writes to localStorage:

```tsx
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebouncedCallback } from "use-debounce"

export function DebouncedInput() {
  const [value, setValue] = useLocalStorage("input", "")

  const debouncedSetValue = useDebouncedCallback(
    (val) => setValue(val),
    500
  )

  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value) // Update state immediately
        debouncedSetValue(e.target.value) // Debounce storage write
      }}
    />
  )
}
```

2. **Use selective updates:** Only update what changed:

```tsx
const [todos, setTodos] = useLocalStorage("todos", [])

// Instead of replacing the entire array
setTodos([...todos, newTodo])

// Update only the changed item
setTodos(todos.map((t) => t.id === id ? { ...t, completed: true } : t))
```

## Dependencies Added

```json
{
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

## Common Issues and Solutions

### Issue: Data not persisting

**Solution:** Ensure the component is a client component (`"use client"`) and that localStorage is available.

### Issue: Type errors with complex data

**Solution:** Use Zod schemas with `useTypedStorage` for proper type validation.

### Issue: Performance issues with large datasets

**Solution:** Implement debouncing, selective updates, or consider using IndexedDB for larger datasets.

### Issue: Data corruption after schema changes

**Solution:** Implement the migration system to handle schema changes gracefully.

## Success Criteria

- Data persists across page refreshes
- Errors are handled gracefully
- Invalid data falls back to default values
- TypeScript types are inferred correctly
- Works in SSR environments (Next.js)
- Unit tests pass

## Next Steps

After implementing localStorage persistence:
1. Add data export/import functionality
2. Implement backup/restore features
3. Add data compression for large datasets
4. Consider IndexedDB for larger datasets
5. Add sync with backend when available
6. Implement data analytics and usage tracking
