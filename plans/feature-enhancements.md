# Priority Todo App — Feature Enhancement Roadmap

| Field       | Value                                          |
|-------------|------------------------------------------------|
| **Project** | Priority Todo App                              |
| **Date**    | 2026-02-07                                     |
| **Status**  | Proposed                                       |
| **Stack**   | Next.js 16 / React 19 / TypeScript / Tailwind  |

---

## Current State Summary

The app is a functional MVP with these capabilities:

- Task creation with P1/P2/P3 priority levels and color coding
- Drag-and-drop reordering via `@dnd-kit` (touch, keyboard, pointer sensors)
- Task completion via checkbox, with a collapsible completed-tasks section
- Restore completed tasks or clear all completed
- `localStorage` persistence with Zod validation
- Dark mode CSS variables defined but **no user-facing toggle**
- `@radix-ui/react-dialog` and `@radix-ui/react-dropdown-menu` installed but **unused**

### Key Gaps

No inline editing, no task deletion UI, no due dates, no search/filter, no sort options, no categories/tags, no undo/redo, no keyboard shortcuts, no export/import, no tests, no dark mode toggle, no animations on add/remove.

---

## Category 1: Core Functionality Enhancements

### 1.1 Inline Task Editing

| Complexity | Impact    | Tier |
|------------|-----------|------|
| Low        | Very High | 1    |

Allow users to double-click or tap on a task's text to edit it in-place. Enter saves, Escape cancels.

The `updateTodo` function in `use-todos.ts` already supports partial updates (`Partial<Todo>`), so the hook layer needs zero changes. Only `todo-item.tsx` needs an `isEditing` local state that toggles between a `<span>` and an `<Input>`.

**Key files:** `src/components/todo-item.tsx`

---

### 1.2 Task Deletion

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | High   | 1    |

Add a delete button (Trash2 icon) to each task row.

`deleteTodo` already exists in the `useTodos` hook and the `TodoState` interface but is **never wired to the UI**. This is a wiring-only task: pass `deleteTodo` down through `TodoList` to `TodoItem` and add a button.

**Key files:** `src/app/page.tsx`, `src/components/todo-list.tsx`, `src/components/todo-item.tsx`

---

### 1.3 Due Dates

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | High   | 2    |

Allow users to optionally assign a due date to any task. Display relative date badges with visual indicators: overdue (red), due today (amber), upcoming (muted).

Requires extending the `Todo` interface with `dueDate?: number | null`, updating the Zod schema, and adding a date picker to `TodoInput` and `TodoItem`.

**Key files:** `src/lib/types.ts`, `src/hooks/use-todos.ts`, `src/components/todo-input.tsx`, `src/components/todo-item.tsx`

**Depends on:** Schema Versioning (4.3)

---

### 1.4 Search and Filter

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | High   | 2    |

Add a search bar for real-time text filtering plus priority filter toggles (P1/P2/P3). Purely client-side — just `.filter()` on existing state.

Create a `SearchFilter` component with search input and toggle buttons. Derive `filteredActiveTodos` and pass to `TodoList`.

**Key files:** `src/app/page.tsx` (new state), new `src/components/search-filter.tsx`

---

### 1.5 Sort Options

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | Medium | 3    |

Sorting controls: by priority, due date, creation date, or alphabetical. When a sort is active, drag-drop handles are disabled.

Add `sortMode` state. When not "manual", sort the array before rendering and hide grip handles.

**Key files:** `src/app/page.tsx`, `src/components/todo-list.tsx`

---

### 1.6 Categories / Tags

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | Medium | 3    |

Allow users to assign text-based tags (e.g., "Work", "Personal") to tasks. Tags appear as colored chips. Include tag filter integration with the search/filter component.

Extend `Todo` type with `tags: string[]`. Create a `TagInput` component with autocomplete from known tags.

**Key files:** `src/lib/types.ts`, new `src/components/tag-input.tsx`, `src/components/todo-item.tsx`

**Depends on:** Schema Versioning (4.3)

---

### 1.7 Subtasks / Checklists

| Complexity | Impact | Tier |
|------------|--------|------|
| High       | Medium | 4    |

Each task can contain a list of sub-items with a progress indicator (e.g., "2/5"). Subtasks are visible when the parent is expanded. Parent auto-completes when all subtasks are done.

Add `subtasks: Array<{ id: string, text: string, completed: boolean }>` to `Todo` type.

**Key files:** `src/lib/types.ts`, `src/components/todo-item.tsx`

**Depends on:** Schema Versioning (4.3)

---

## Category 2: UI/UX & Visual Improvements

### 2.1 Dark Mode Toggle

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | High   | 1    |

Add a sun/moon toggle to the header. Dark mode CSS variables are **already fully defined** in `globals.css` (lines 46–78) and Tailwind is configured with `darkMode: ["class"]`. This only needs:

1. A `useTheme` hook that toggles `.dark` on `<html>` and persists to localStorage
2. A `ThemeToggle` component with `Sun`/`Moon` Lucide icons
3. Respect `prefers-color-scheme` as the initial default

**Key files:** `src/app/globals.css` (already done), `tailwind.config.ts` (already done), new `src/hooks/use-theme.ts`, `src/app/page.tsx`

---

### 2.2 Task Add/Remove Animations

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 2    |

Animate tasks on add (fade + slide in), complete (fade + slide out), and delete (collapse + fade). The `tailwindcss-animate` package is **already installed** and configured.

Use utility classes like `animate-in`, `fade-in`, `slide-in-from-top`. For exit animations, use `onAnimationEnd` to trigger state removal after the animation completes.

**Key files:** `src/components/todo-item.tsx`, `src/components/todo-list.tsx`

---

### 2.3 Progress Visualization

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 2    |

Display a progress bar at the top showing completed/total ratio (e.g., "5/12 — 42%"). Optionally break down by priority using existing color tokens.

`page.tsx` already computes `activeTodos` and `completedTodos` separately, so the data is ready.

**Key files:** `src/app/page.tsx`, new `src/components/progress-bar.tsx`

---

### 2.4 Task Counter Badges

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Low    | 3    |

Show counts next to "Active Tasks" heading and per priority level (e.g., "P1: 3 | P2: 5 | P3: 4"). Quick informational enhancement using existing priority color tokens.

**Key files:** `src/app/page.tsx`

---

### 2.5 Empty State Illustration

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Low    | 3    |

Replace the plain "No active tasks" text with a Lucide icon illustration, welcoming message, and call-to-action. The current empty state (page.tsx lines 42–48) is functional but plain.

**Key files:** `src/app/page.tsx`

---

### 2.6 Confirmation Dialogs for Destructive Actions

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 2    |

Show a confirmation dialog before "Clear All Completed" and bulk deletes. `@radix-ui/react-dialog` is **already installed but unused** — build an AlertDialog component on top of it.

**Key files:** `src/components/completed-section.tsx`, new `src/components/ui/alert-dialog.tsx`

---

### 2.7 Task Creation Date Display

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Low    | 3    |

Show a relative timestamp ("2h ago", "yesterday") on each task. The `createdAt` field already exists on every `Todo` but is never displayed. Show on hover to keep the row clean.

**Key files:** `src/components/todo-item.tsx`, new utility in `src/lib/utils.ts`

---

## Category 3: Productivity & Power Features

### 3.1 Keyboard Shortcuts

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | High   | 2    |

Global shortcuts: `N` to focus input, `Ctrl+Z` for undo, `Escape` to blur, `?` for help overlay. Create a `useKeyboardShortcuts` hook with a shortcut registry. Use `@radix-ui/react-dialog` for the help modal.

Ensure shortcuts don't fire when an input is focused.

**Key files:** new `src/hooks/use-keyboard-shortcuts.ts`, `src/app/page.tsx`

---

### 3.2 Undo / Redo

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | High   | 2    |

History stack of state snapshots. `Ctrl+Z` to undo, `Ctrl+Shift+Z` to redo. Show a toast notification on undo/redo.

Add `undoStack` and `redoStack` arrays to `useTodos`. Before each mutation, push current state onto the undo stack. Limit to ~20 entries.

**Key files:** `src/hooks/use-todos.ts`

**Depends on:** Task Deletion (1.2), Toast Notifications (3.4)

---

### 3.3 Quick Priority Cycling via Keyboard

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 3    |

When a task is focused, press `1`/`2`/`3` to set priority to P1/P2/P3 instantly. Builds on the keyboard shortcuts infrastructure.

**Key files:** `src/components/todo-item.tsx`

**Depends on:** Keyboard Shortcuts (3.1)

---

### 3.4 Toast Notifications

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 2    |

Brief auto-dismissing notifications for key actions: "Task added", "Task deleted — Undo", etc. Install `sonner` (~3KB) or build a minimal toast with Radix primitives.

For destructive action toasts, include an "Undo" button that triggers the undo function.

**Key files:** `src/app/layout.tsx`, `src/app/page.tsx`

---

### 3.5 Task Notes / Description

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | Medium | 3    |

Optional longer text description per task, viewable by expanding the row. Add `notes?: string` to the `Todo` type. Show a "has notes" indicator icon when collapsed.

**Key files:** `src/lib/types.ts`, `src/components/todo-item.tsx`

**Depends on:** Schema Versioning (4.3)

---

### 3.6 Recurring Tasks

| Complexity | Impact | Tier |
|------------|--------|------|
| High       | Medium | 4    |

Mark tasks as recurring (daily, weekly, custom). On completion, automatically re-create with the next due date. Add `recurrence` field to `Todo` type.

**Key files:** `src/lib/types.ts`, `src/hooks/use-todos.ts`

**Depends on:** Due Dates (1.3), Schema Versioning (4.3)

---

## Category 4: Data Management & Portability

### 4.1 Export / Import (JSON)

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | High   | 2    |

Export all tasks as a downloadable JSON file. Import from a previously exported file with Zod validation. Critical for data safety in a localStorage-only app.

Export: `Blob` + `URL.createObjectURL`. Import: `<input type="file">` + `FileReader`. Use the unused `@radix-ui/react-dropdown-menu` for a settings menu.

**Key files:** `src/app/page.tsx`, new `src/lib/export-import.ts`

---

### 4.2 Export as CSV / Markdown

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 3    |

Export tasks in CSV or Markdown format for use in spreadsheets or note-taking apps. Reuses the download mechanism from JSON export.

**Key files:** `src/lib/export-import.ts`

**Depends on:** Export/Import JSON (4.1)

---

### 4.3 LocalStorage Schema Versioning

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | High   | 1    |

Add a version number to the stored data so future schema changes (dueDate, tags, notes) can be migrated automatically. Store `{ version: number, todos: Todo[] }` instead of bare `Todo[]`.

Create a `migrations.ts` file with version-to-version transform functions. Run migrations on load before Zod validation.

**Key files:** `src/hooks/use-todos.ts`, new `src/lib/migrations.ts`

---

### 4.4 Storage Usage Indicator

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Low    | 3    |

Display localStorage usage percentage in a footer or settings panel. Warn when approaching the ~5MB limit. `getStorageUsage()` **already exists** in `storage.ts` — just needs to be wired to UI.

**Key files:** `src/lib/storage.ts` (already implemented), `src/app/page.tsx`

---

## Category 5: Technical & Infrastructure

### 5.1 Unit and Integration Tests

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | Very High | 1 |

Add a test suite with Vitest + React Testing Library. Focus on: `useTodos` hook (add, update, delete, toggle, reorder), `storage.ts` utilities, and critical user interactions.

Zero tests exist today. Every future feature risks regressions.

**Key files:** new `vitest.config.ts`, new `src/__tests__/` directory

---

### 5.2 Unique ID Generation

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 1    |

Replace `Date.now().toString()` with `crypto.randomUUID()` for task IDs. The current approach can produce duplicates if two tasks are created in the same millisecond (e.g., via import).

Single-line change — no dependencies needed.

**Key files:** `src/hooks/use-todos.ts` (line 59)

---

### 5.3 PWA / Offline Support

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | Medium | 3    |

Service worker, web manifest, and install prompt. The app is already fully client-side with localStorage, so it nearly works offline already. A PWA formalizes this and enables "Add to Home Screen".

**Key files:** new `public/manifest.json`, `src/app/layout.tsx`

---

### 5.4 Error Boundary

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 2    |

React error boundary component that catches rendering errors and shows fallback UI with a "Reset App" button. Prevents the app from going blank if corrupted data causes a hydration error.

**Key files:** new `src/components/error-boundary.tsx`, `src/app/layout.tsx`

---

### 5.5 Accessibility Audit & Improvements

| Complexity | Impact | Tier |
|------------|--------|------|
| Medium     | High   | 2    |

Priority colors are currently the **sole visual differentiator** for P1/P2/P3 — users with color vision deficiency cannot distinguish them. Add text labels or distinct icons alongside colors. Add `aria-live` regions for dynamic content changes. Verify focus management flows.

**Key files:** `src/components/priority-selector.tsx`, `src/components/todo-item.tsx`, `src/components/todo-list.tsx`

---

### 5.6 Virtualized List Rendering

| Complexity | Impact       | Tier |
|------------|--------------|------|
| High       | Low (now) / High (at scale) | 4 |

Only render visible task rows in the DOM using `@tanstack/react-virtual`. Not needed now but critical if users accumulate hundreds of tasks. Must be compatible with `@dnd-kit` SortableContext.

**Key files:** `src/components/todo-list.tsx`

---

### 5.7 Lint, Format & Pre-commit Hooks

| Complexity | Impact | Tier |
|------------|--------|------|
| Low        | Medium | 3    |

Configure Prettier, stricter ESLint rules, and Husky + lint-staged for pre-commit checks. ESLint is already configured but there are no pre-commit hooks.

**Key files:** new `.prettierrc`, `package.json`

---

## Priority Matrix

| #   | Feature                     | Complexity | Impact    | Tier |
|-----|-----------------------------|------------|-----------|------|
| 2.1 | Dark Mode Toggle            | Low        | High      | 1    |
| 1.1 | Inline Task Editing         | Low        | Very High | 1    |
| 1.2 | Task Deletion               | Low        | High      | 1    |
| 4.3 | Schema Versioning           | Low        | High      | 1    |
| 5.2 | Unique ID Generation        | Low        | Medium    | 1    |
| 5.1 | Unit/Integration Tests      | Medium     | Very High | 1    |
| 4.1 | Export/Import JSON          | Low        | High      | 2    |
| 1.4 | Search and Filter           | Medium     | High      | 2    |
| 3.1 | Keyboard Shortcuts          | Medium     | High      | 2    |
| 3.2 | Undo / Redo                 | Medium     | High      | 2    |
| 2.6 | Confirmation Dialogs        | Low        | Medium    | 2    |
| 1.3 | Due Dates                   | Medium     | High      | 2    |
| 2.2 | Task Animations             | Low        | Medium    | 2    |
| 2.3 | Progress Visualization      | Low        | Medium    | 2    |
| 3.4 | Toast Notifications         | Low        | Medium    | 2    |
| 5.4 | Error Boundary              | Low        | Medium    | 2    |
| 5.5 | Accessibility Audit         | Medium     | High      | 2    |
| 1.5 | Sort Options                | Medium     | Medium    | 3    |
| 1.6 | Categories / Tags           | Medium     | Medium    | 3    |
| 4.2 | Export CSV/Markdown          | Low        | Medium    | 3    |
| 2.4 | Task Counter Badges         | Low        | Low       | 3    |
| 2.7 | Creation Date Display       | Low        | Low       | 3    |
| 3.3 | Quick Priority Cycling      | Low        | Medium    | 3    |
| 3.5 | Task Notes                  | Medium     | Medium    | 3    |
| 5.3 | PWA / Offline               | Medium     | Medium    | 3    |
| 5.7 | Lint/Format/Hooks           | Low        | Medium    | 3    |
| 2.5 | Empty State Illustration    | Low        | Low       | 3    |
| 4.4 | Storage Usage Indicator     | Low        | Low       | 3    |
| 1.7 | Subtasks / Checklists       | High       | Medium    | 4    |
| 3.6 | Recurring Tasks             | High       | Medium    | 4    |
| 5.6 | Virtualized Lists           | High       | Low*      | 4    |

*Impact is low at current scale but becomes high at 100+ tasks.

---

## Recommended Implementation Phases

**Phase 1 — Foundation (Tier 1):**
Schema versioning, unique IDs, dark mode toggle, inline editing, task deletion, initial test suite. All low-to-medium complexity, remove the most critical gaps.

**Phase 2 — Productivity (Tier 2):**
Export/import, search/filter, undo/redo, keyboard shortcuts, confirmation dialogs, due dates, toast notifications, error boundary, accessibility fixes, animations, progress bar.

**Phase 3 — Power Features (Tier 3):**
Sort options, categories/tags, CSV/Markdown export, task notes, PWA support, counter badges, creation date display, developer tooling.

**Phase 4 — Advanced (Tier 4):**
Subtasks, recurring tasks, virtualized lists. High-complexity features for after the lower tiers are stable.

---

## Dependency Graph

```
Schema Versioning (4.3)
├── Due Dates (1.3) → Recurring Tasks (3.6)
├── Categories / Tags (1.6)
├── Task Notes (3.5)
└── Subtasks (1.7)

Task Deletion (1.2) → Undo/Redo (3.2)
Toast Notifications (3.4) → Undo/Redo (3.2)
Keyboard Shortcuts (3.1) → Quick Priority Cycling (3.3)
Export/Import JSON (4.1) → Export CSV/Markdown (4.2)
```

---

## Assets Already Available (Unused)

These dependencies are installed but not used — ready to leverage:

| Dependency                        | Useful For              |
|-----------------------------------|-------------------------|
| `@radix-ui/react-dialog`         | Confirmation dialogs, keyboard shortcut help modal |
| `@radix-ui/react-dropdown-menu`  | Settings menu (export/import, sort, theme) |
| `tailwindcss-animate`            | Task add/remove animations |
| `getStorageUsage()` in storage.ts | Storage usage indicator |
| `deleteTodo` in use-todos.ts     | Task deletion (already implemented, just unwired) |
| Dark mode CSS vars in globals.css | Dark mode toggle (fully defined) |
