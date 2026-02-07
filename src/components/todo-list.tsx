"use client"

import { useRef, useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { useVirtualizer } from "@tanstack/react-virtual"
import { GripVertical } from "lucide-react"
import { TodoItem } from "@/components/todo-item"
import { cn } from "@/lib/utils"
import type { Todo } from "@/lib/types"

interface TodoListProps {
  todos: Todo[]
  onReorder: (activeId: string, overId: string) => void
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  tagSuggestions?: string[]
  disabled?: boolean
}

export function TodoList({
  todos,
  onReorder,
  onUpdate,
  onToggleComplete,
  onDelete,
  tagSuggestions = [],
  disabled = false,
}: TodoListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [lastOverId, setLastOverId] = useState<string | null>(null)
  const [isTouchActive, setIsTouchActive] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)
  const shouldVirtualize = disabled && todos.length > 100

  const virtualizer = useVirtualizer({
    count: shouldVirtualize ? todos.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130,
    overscan: 5,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setLastOverId(event.active.id as string)
    setIsTouchActive(true)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (event.over?.id) {
      setLastOverId(event.over.id as string)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const overId = (over?.id as string | undefined) ?? lastOverId

    if (overId && active.id !== overId) {
      onReorder(active.id as string, overId)
    }

    setActiveId(null)
    setLastOverId(null)
    setIsTouchActive(false) // Reset touch state
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setLastOverId(null)
    setIsTouchActive(false)
  }

  const activeTodo = todos.find((todo) => todo.id === activeId)
  const priorityColors: Record<Todo["priority"], string> = {
    P1: "bg-priority-p1 text-priority-p1-text",
    P2: "bg-priority-p2 text-priority-p2-text",
    P3: "bg-priority-p3 text-priority-p3-text",
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
        {shouldVirtualize ? (
          <div ref={parentRef} className="max-h-[70vh] overflow-auto">
            <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const todo = todos[virtualItem.index]
                return (
                  <div
                    key={todo.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <TodoItem
                      todo={todo}
                      onUpdate={onUpdate}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      tagSuggestions={tagSuggestions}
                      dragDisabled={disabled}
                      isTouchActive={isTouchActive && activeId === todo.id}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2" role="list" aria-label="Active task list">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                tagSuggestions={tagSuggestions}
                dragDisabled={disabled}
                isTouchActive={isTouchActive && activeId === todo.id}
              />
            ))}
          </div>
        )}
      </SortableContext>

      <DragOverlay
        modifiers={[restrictToVerticalAxis]}
        dropAnimation={null}
        style={{ pointerEvents: "none" }}
      >
        {activeTodo ? (
          <div
            className={cn(
              "relative flex items-center gap-3 rounded-lg p-3 shadow-lg",
              priorityColors[activeTodo.priority]
            )}
          >
            <GripVertical className="h-6 w-6 text-priority-p1-text/70" />
            <span
              className={cn(
                "flex-1 text-sm",
                activeTodo.completed && "line-through opacity-50"
              )}
            >
              {activeTodo.text}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
