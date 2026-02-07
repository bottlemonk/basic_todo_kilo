---
name: drag-drop-sortable
description: Implement drag-and-drop reordering functionality using @dnd-kit/sortable. This skill should be used when building sortable list components, implementing reordering functionality, or creating drag-and-drop interfaces with touch support.
license: Complete terms in LICENSE.txt
metadata:
  category: development
  source:
    repository: https://github.com/ComposioHQ/awesome-claude-skills
    path: drag-drop-sortable
---

# Drag & Drop Sortable

This skill provides a complete implementation of drag-and-drop reordering for lists using the @dnd-kit library. It includes touch support for mobile devices, smooth animations, and accessibility features.

## Purpose

Implement drag-and-drop reordering functionality with @dnd-kit/sortable, providing touch support, smooth animations, and accessibility features.

## When to Use

- Building a sortable list component
- Implementing reordering functionality
- Creating drag-and-drop interfaces with touch support
- Adding drag handles to list items

## Setup Process

### Step 1: Install Dependencies

Install @dnd-kit packages:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Step 2: Create SortableList Component

Create `components/sortable-list.tsx`:

```tsx
"use client"

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableListProps<T> {
  items: T[]
  onReorder: (oldIndex: number, newIndex: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
  disabled?: boolean
  idKey?: keyof T
}

export function SortableList<T>({
  items,
  onReorder,
  renderItem,
  disabled = false,
  idKey = "id" as keyof T,
}: SortableListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => (item[idKey] as string) === active.id)
      const newIndex = items.findIndex((item) => (item[idKey] as string) === over.id)

      onReorder(oldIndex, newIndex)
    }

    setActiveId(null)
  }

  const activeItem = items.find((item) => (item[idKey] as string) === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => (item[idKey] as string))}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((item, index) => (
            <SortableItem
              key={item[idKey] as string}
              id={item[idKey] as string}
              disabled={disabled}
            >
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem ? (
          <div className="bg-background border shadow-lg rounded-lg p-4">
            {renderItem(activeItem, items.indexOf(activeItem))}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

interface SortableItemProps {
  id: string
  children: React.ReactNode
  disabled?: boolean
}

function SortableItem({ id, children, disabled = false }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex items-center gap-3 bg-card border rounded-lg p-3 transition-shadow",
        isDragging && "shadow-lg z-50",
        !disabled && "hover:shadow-md"
      )}
    >
      {!disabled && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1">{children}</div>
    </div>
  )
}
```

### Step 3: Create Usage Example

Create a simple example component to demonstrate usage:

```tsx
"use client"

import { useState } from "react"
import { SortableList } from "@/components/sortable-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Todo {
  id: string
  text: string
}

export function TodoListExample() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Learn Next.js" },
    { id: "2", text: "Build a todo app" },
    { id: "3", text: "Deploy to production" },
  ])

  const [newTodo, setNewTodo] = useState("")

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo }])
      setNewTodo("")
    }
  }

  const handleReorder = (oldIndex: number, newIndex: number) => {
    setTodos((prev) => {
      const newItems = [...prev]
      return arrayMove(newItems, oldIndex, newIndex)
    })
  }

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sortable Todo List</h1>

      <div className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          placeholder="Add a new todo..."
        />
        <Button onClick={handleAddTodo}>Add</Button>
      </div>

      <SortableList
        items={todos}
        onReorder={handleReorder}
        renderItem={(todo, index) => (
          <div className="flex items-center justify-between gap-2">
            <span className="flex-1">
              {index + 1}. {todo.text}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </Button>
          </div>
        )}
      />
    </div>
  )
}
```

### Step 4: Add Horizontal Sorting (Optional)

For horizontal lists, modify the `SortableList` component to support horizontal sorting:

```tsx
import { horizontalListSortingStrategy } from "@dnd-kit/sortable"

// In SortableList component, change the strategy:
<SortableContext
  items={items.map((item) => (item[idKey] as string))}
  strategy={horizontalListSortingStrategy}
>
  <div className="flex gap-2">
    {items.map((item, index) => (
      <SortableItem
        key={item[idKey] as string}
        id={item[idKey] as string}
        disabled={disabled}
        className="flex-shrink-0"
      >
        {renderItem(item, index)}
      </SortableItem>
    ))}
  </div>
</SortableContext>
```

### Step 5: Add Grid Sorting (Optional)

For grid layouts, create a grid sortable component:

```tsx
import { rectSortingStrategy } from "@dnd-kit/sortable"

<SortableContext
  items={items.map((item) => (item[idKey] as string))}
  strategy={rectSortingStrategy}
>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {items.map((item, index) => (
      <SortableItem
        key={item[idKey] as string}
        id={item[idKey] as string}
        disabled={disabled}
      >
        {renderItem(item, index)}
      </SortableItem>
    ))}
  </div>
</SortableContext>
```

## Features

### Touch Support

The implementation includes touch support out of the box:
- Works on mobile devices and tablets
- Activation constraint prevents accidental drags
- Smooth touch interactions

### Keyboard Navigation

Users can navigate and reorder items using the keyboard:
- Tab to focus on sortable items
- Arrow keys to move between items
- Space or Enter to start dragging
- Arrow keys to move the dragged item
- Enter or Space to drop

### Accessibility Features

- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Semantic HTML structure
- Drag handles with clear labels

### Visual Feedback

- Drag overlay shows the item being dragged
- Shadow and z-index changes during drag
- Smooth transitions and animations
- Hover states for interactive elements

## Advanced Features

### Multiple Lists

To implement dragging between multiple lists:

```tsx
import { DndContext, DragOverlay, useDroppable } from "@dnd-kit/core"

function DroppableList({ id, items, onReorder, renderItem }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="min-h-[200px] p-4 border rounded-lg">
      <SortableList items={items} onReorder={onReorder} renderItem={renderItem} />
    </div>
  )
}

function MultiListExample() {
  const [lists, setLists] = useState({
    todo: [{ id: "1", text: "Task 1" }],
    done: [{ id: "2", text: "Task 2" }],
  })

  const handleDragEnd = (event) => {
    const { active, over } = event
    // Handle moving between lists
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4">
        <DroppableList id="todo" items={lists.todo} />
        <DroppableList id="done" items={lists.done} />
      </div>
    </DndContext>
  )
}
```

### Animations

Add custom animations using CSS:

```css
/* In globals.css */
.sortable-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sortable-item.dragging {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.sortable-item.drag-ghost {
  opacity: 0.5;
  background: #f0f0f0;
}
```

### Constraints

Restrict dragging to specific axes or directions:

```tsx
import { useSensor, PointerSensor } from "@dnd-kit/core"

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
    modifiers: [
      // Restrict to vertical movement
      ({ transform }) => ({
        ...transform,
        x: 0,
      }),
    ],
  })
)
```

## Dependencies Added

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "lucide-react": "^0.300.0"
  }
}
```

## Common Issues and Solutions

### Issue: Drag doesn't start on mobile

**Solution:** Check that the activation constraint is set. Increase the distance if needed:

```tsx
useSensor(PointerSensor, {
  activationConstraint: {
    distance: 10, // Increase from 8 to 10
  },
})
```

### Issue: Items jump when dragging

**Solution:** Ensure the `transform` style is applied correctly and CSS transitions are set:

```tsx
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
}
```

### Issue: Keyboard navigation doesn't work

**Solution:** Make sure the `KeyboardSensor` is configured with the coordinate getter:

```tsx
useSensor(KeyboardSensor, {
  coordinateGetter: sortableKeyboardCoordinates,
})
```

### Issue: Drag overlay doesn't show

**Solution:** Ensure the `DragOverlay` component is a direct child of `DndContext` and that `activeId` is being set correctly.

## Performance Tips

1. **Memoize render items:** Use `useMemo` to prevent unnecessary re-renders:

```tsx
const renderItems = useMemo(() =>
  items.map((item, index) => (
    <SortableItem key={item.id} id={item.id}>
      {renderItem(item, index)}
    </SortableItem>
  ))
, [items, renderItem])
```

2. **Optimize item rendering:** Use `React.memo` for complex item components:

```tsx
const TodoItem = React.memo(({ todo, index }) => {
  return <div>{todo.text}</div>
})
```

3. **Virtualization:** For large lists (100+ items), consider using a virtualization library like `react-window` or `react-virtual`.

## Success Criteria

- Items can be dragged and reordered
- Touch works on mobile devices
- Keyboard navigation functions correctly
- Animations are smooth (< 100ms)
- Accessibility audit passes
- No console errors during drag operations

## Next Steps

After implementing drag-and-drop:
1. Add undo/redo functionality for reordering
2. Implement drag between multiple lists
3. Add animations and transitions
4. Test on various devices and browsers
5. Optimize performance for large lists
