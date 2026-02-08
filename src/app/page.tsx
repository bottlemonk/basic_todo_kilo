"use client"

import { useMemo, useState } from "react"
import { ClipboardList, Download, Keyboard, Redo2, Settings2, Undo2, Upload } from "lucide-react"
import { toast } from "sonner"
import { useTodos } from "@/hooks/use-todos"
import { TodoInput } from "@/components/todo-input"
import { TodoList } from "@/components/todo-list"
import { CompletedSection } from "@/components/completed-section"
import { SearchFilter } from "@/components/search-filter"
import { ThemeToggle } from "@/components/theme-toggle"
import { PwaInstallPrompt } from "@/components/pwa-install-prompt"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { getStorageUsage } from "@/lib/storage"
import {
  exportTodosAsCsv,
  exportTodosAsJson,
  exportTodosAsMarkdown,
  parseImportedTodos,
} from "@/lib/export-import"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Priority, SortMode, Todo } from "@/lib/types"

function sortTodos(todos: Todo[], sortMode: SortMode): Todo[] {
  if (sortMode === "manual") {
    return todos
  }

  const sorted = [...todos]
  if (sortMode === "priority") {
    const rank: Record<Priority, number> = { P1: 0, P2: 1, P3: 2 }
    return sorted.sort((a, b) => rank[a.priority] - rank[b.priority])
  }

  if (sortMode === "dueDate") {
    return sorted.sort((a, b) => {
      const aDue = a.dueDate ?? Number.MAX_SAFE_INTEGER
      const bDue = b.dueDate ?? Number.MAX_SAFE_INTEGER
      return aDue - bDue
    })
  }

  if (sortMode === "alphabetical") {
    return sorted.sort((a, b) => a.text.localeCompare(b.text))
  }

  return sorted.sort((a, b) => b.createdAt - a.createdAt)
}

export default function HomePage() {
  const {
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
    canUndo,
    canRedo,
  } = useTodos()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(["P1", "P2", "P3"])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortMode, setSortMode] = useState<SortMode>("manual")
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [storageUsage, setStorageUsage] = useState(() => getStorageUsage())

  const fileInputId = "import-todos-file-input"

  const activeTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)
  const availableTags = useMemo(
    () =>
      Array.from(new Set(todos.flatMap((todo) => todo.tags)))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [todos]
  )

  const filteredActiveTodos = useMemo(() => {
    return activeTodos.filter((todo) => {
      const query = searchQuery.trim().toLowerCase()
      const queryMatch =
        query.length === 0 ||
        todo.text.toLowerCase().includes(query) ||
        todo.tags.some((tag) => tag.toLowerCase().includes(query))

      const priorityMatch = selectedPriorities.includes(todo.priority)
      const tagsMatch = selectedTags.length === 0 || selectedTags.every((tag) => todo.tags.includes(tag))
      return queryMatch && priorityMatch && tagsMatch
    })
  }, [activeTodos, searchQuery, selectedPriorities, selectedTags])

  const visibleActiveTodos = useMemo(
    () => sortTodos(filteredActiveTodos, sortMode),
    [filteredActiveTodos, sortMode]
  )
  const activePriorityCounts = useMemo(
    () =>
      (["P1", "P2", "P3"] as Priority[]).reduce((acc, priority) => {
        acc[priority] = activeTodos.filter((todo) => todo.priority === priority).length
        return acc
      }, {} as Record<Priority, number>),
    [activeTodos]
  )

  const handleRestore = (id: string) => {
    handleUpdateTodo(id, { completed: false })
  }

  const togglePriorityFilter = (priority: Priority) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(priority)) {
        return prev.length === 1 ? prev : prev.filter((item) => item !== priority)
      }
      return [...prev, priority]
    })
  }

  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    )
  }

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJson = () => {
    downloadFile("priority-todos.json", exportTodosAsJson(todos), "application/json")
    toast.success("Exported JSON")
  }

  const handleExportCsv = () => {
    downloadFile("priority-todos.csv", exportTodosAsCsv(todos), "text/csv")
    toast.success("Exported CSV")
  }

  const handleExportMarkdown = () => {
    downloadFile("priority-todos.md", exportTodosAsMarkdown(todos), "text/markdown")
    toast.success("Exported Markdown")
  }

  const handleImportJson = async (file: File | null) => {
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const imported = parseImportedTodos(text)
      importTodos(imported)
      setStorageUsage(getStorageUsage())
      toast.success(`Imported ${imported.length} task(s)`)
    } catch (error) {
      console.error(error)
      toast.error("Import failed. Please use a valid export file.")
    }
  }

  useKeyboardShortcuts({
    onNewTask: () => {
      const input = document.querySelector<HTMLInputElement>("[data-todo-input='true']")
      input?.focus()
    },
    onUndo: () => {
      if (canUndo) {
        undo()
        setStorageUsage(getStorageUsage())
        toast.message("Undo")
      }
    },
    onRedo: () => {
      if (canRedo) {
        redo()
        setStorageUsage(getStorageUsage())
        toast.message("Redo")
      }
    },
    onBlur: () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    },
    onToggleHelp: () => setIsHelpOpen((prev) => !prev),
  })

  const handleAddTodo = (...args: Parameters<typeof addTodo>) => {
    addTodo(...args)
    setStorageUsage(getStorageUsage())
    toast.success("Task added")
  }

  const handleUpdateTodo = (...args: Parameters<typeof updateTodo>) => {
    updateTodo(...args)
    setStorageUsage(getStorageUsage())
  }

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id)
    setStorageUsage(getStorageUsage())
    toast("Task deleted", {
      action: {
        label: "Undo",
        onClick: () => undo(),
      },
    })
  }

  const handleToggleComplete = (id: string) => {
    toggleComplete(id)
    setStorageUsage(getStorageUsage())
  }

  const handleReorderTodos = (activeId: string, overId: string) => {
    reorderTodos(activeId, overId)
    setStorageUsage(getStorageUsage())
  }

  const handleClearCompleted = () => {
    clearCompleted()
    setStorageUsage(getStorageUsage())
    toast.success("Cleared completed tasks")
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <div className="container mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-8">
        <header className="mb-8 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Priority Todo</h1>
            <p className="text-muted-foreground mt-2">
              Manage your tasks with priority levels and drag-and-drop reordering
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11" aria-label="Open settings menu">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Data</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleExportJson}>
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCsv}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportMarkdown}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Markdown
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.getElementById(fileInputId)?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsHelpOpen(true)}>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </header>

        <input
          id={fileInputId}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => handleImportJson(event.target.files?.[0] ?? null)}
        />

        <section className="mb-8">
          <TodoInput onAdd={handleAddTodo} availableTags={availableTags} />
        </section>

        <section className="mb-6">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedPriorities={selectedPriorities}
            onTogglePriority={togglePriorityFilter}
            selectedTags={selectedTags}
            onToggleTag={toggleTagFilter}
            availableTags={availableTags}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
          />
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center gap-2" aria-live="polite">
            <h2 className="text-xl font-semibold">Active Tasks ({visibleActiveTodos.length})</h2>
            <span className="rounded-md bg-priority-p1/20 px-2 py-1 text-xs text-priority-p1-text">
              P1: {activePriorityCounts.P1}
            </span>
            <span className="rounded-md bg-priority-p2/20 px-2 py-1 text-xs text-priority-p2-text">
              P2: {activePriorityCounts.P2}
            </span>
            <span className="rounded-md bg-priority-p3/20 px-2 py-1 text-xs text-priority-p3-text">
              P3: {activePriorityCounts.P3}
            </span>
          </div>
          {visibleActiveTodos.length === 0 ? (
            <div className="rounded-xl border border-dashed py-14 text-center text-muted-foreground">
              <ClipboardList className="mx-auto mb-3 h-10 w-10 opacity-60" />
              <p className="text-lg font-medium">You are all caught up</p>
              <p className="mt-2 text-sm">Create a task above to start your next sprint.</p>
            </div>
          ) : (
            <TodoList
              todos={visibleActiveTodos}
              onReorder={handleReorderTodos}
              onUpdate={handleUpdateTodo}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
              tagSuggestions={availableTags}
              disabled={sortMode !== "manual"}
            />
          )}
        </section>

        <CompletedSection
          completedTodos={completedTodos}
          onRestore={handleRestore}
          onClear={handleClearCompleted}
        />

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs text-muted-foreground">
          <span>Local storage usage: {storageUsage.percentage.toFixed(2)}%</span>
          <PwaInstallPrompt />
        </footer>
      </div>

      <AlertDialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keyboard Shortcuts</AlertDialogTitle>
            <AlertDialogDescription>
              N: focus add task input. Ctrl/Cmd+Z: undo. Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y: redo.
              Escape: blur focus. ?: open this help.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
