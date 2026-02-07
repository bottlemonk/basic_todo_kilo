# Mobile Touch Support Enhancement Plan

## Problem

Drag-and-drop functionality is not working properly on Android tablets and phones.

## Root Cause Analysis

The current implementation uses `@dnd-kit/sortable` with `PointerSensor`. While `@dnd-kit` supports touch events, there may be compatibility issues on certain Android devices or browsers.

## Solution Plan

### 1. Enhance PointerSensor Configuration

**Current Configuration:**
```tsx
useSensor(PointerSensor, {
  activationConstraint: {
    distance: 8, // 8px movement before drag starts
  },
})
```

**Enhanced Configuration:**
```tsx
useSensor(PointerSensor, {
  activationConstraint: {
    distance: 8,
    delay: 0, // No delay for touch
    tolerance: 5, // Allow some movement before drag starts
  },
})
```

### 2. Add Touch-Specific Sensors

Add `TouchSensor` from `@dnd-kit/core` for better touch handling:

```tsx
import { TouchSensor } from "@dnd-kit/core"

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
      delay: 0,
      tolerance: 5,
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5, // Lower threshold for touch
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
)
```

### 3. Improve Touch Target Sizing

Ensure touch targets meet WCAG AA guidelines (minimum 44x44 pixels):

**Current TodoItem:**
```tsx
<button
  {...attributes}
  {...listeners}
  className="cursor-grab active:cursor-grabbing text-priority-p1-text/70 hover:text-priority-p1-text transition-colors p-1"
  aria-label="Drag to reorder"
>
  <GripVertical className="h-5 w-5" />
</button>
```

**Enhanced TodoItem:**
```tsx
<button
  {...attributes}
  {...listeners}
  className="cursor-grab active:cursor-grabbing text-priority-p1-text/70 hover:text-priority-p1-text transition-colors p-2"
  style={{ touchAction: "none" }} // Prevent default touch actions
  aria-label="Drag to reorder"
>
  <GripVertical className="h-6 w-6" /> // Larger touch target
</button>
```

### 4. Prevent Scrolling During Drag

Add `modifiers` to prevent page scrolling while dragging on mobile:

```tsx
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
    modifiers: [restrictToVerticalAxis], // Restrict to vertical axis
  }),
  // ... other sensors
)
```

### 5. Add Touch Feedback

Add visual feedback when touch drag starts:

```tsx
const [isTouchActive, setIsTouchActive] = useState(false)

const handleDragStart = (event: DragStartEvent) => {
  setActiveId(event.active.id as string)
  setIsTouchActive(true) // Track touch state
}

const handleDragEnd = (event: DragEndEvent) => {
  // ... existing logic
  setIsTouchActive(false) // Reset touch state
}

// Add visual feedback
<div className={cn(
  "relative flex items-center gap-3 rounded-lg p-3",
  priorityColors[todo.priority],
  isDragging && "shadow-lg z-50",
  isTouchActive && "ring-2 ring-ring", // Add ring when touch dragging
  !disabled && "hover:shadow-md"
)}>
```

### 6. Add Fallback for Mobile Browsers

Add detection for mobile browsers and provide alternative interaction:

```tsx
import { useEffect, useState } from "react"

const [isMobile, setIsMobile] = useState(false)
const [useFallback, setUseFallback] = useState(false)

useEffect(() => {
  // Detect mobile device
  const userAgent = navigator.userAgent
  const isAndroid = /Android/i.test(userAgent)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  setIsMobile(isTouchDevice)
  setUseFallback(isAndroid && isTouchDevice)
}, [])

// Add long-press fallback for mobile
const handleLongPress = (todo: Todo) => {
  if (useFallback) {
    // Show menu with options
    alert(`Actions for: ${todo.text}`)
  }
}

// Add long-press handler
<div
  onContextMenu={(e) => {
    e.preventDefault()
    handleLongPress(todo)
  }}
>
```

### 7. Test on Real Devices

Test the following scenarios:

1. **Touch drag on Android Chrome** - Primary target
2. **Touch drag on Android Firefox** - Secondary target
3. **Touch drag on iOS Safari** - Reference for comparison
4. **Desktop mouse drag** - Ensure no regression
5. **Keyboard navigation** - Ensure accessibility works

## Implementation Order

1. Update `src/components/todo-list.tsx` - Add TouchSensor and modifiers
2. Update `src/components/todo-item.tsx` - Improve touch targets
3. Add visual feedback for touch dragging
4. Test on actual mobile devices
5. Add fallback for problematic browsers

## Success Criteria

- Drag-and-drop works on Android tablets
- Drag-and-drop works on Android phones
- Touch targets are at least 44x44 pixels
- Visual feedback during touch drag
- No scrolling conflicts during drag
- Keyboard navigation still works
- Desktop mouse drag still works

## Alternative: Use Native HTML5 Drag and Drop

If `@dnd-kit` continues to have issues, consider using native HTML5 Drag and Drop API:

```tsx
import { useState } from "react"

const [draggedItem, setDraggedItem] = useState<Todo | null>(null)

const handleDragStart = (todo: Todo) => {
  setDraggedItem(todo)
}

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: React.DragEvent, targetIndex: number) => {
  e.preventDefault()
  if (draggedItem) {
    onReorder(todos.indexOf(draggedItem), targetIndex)
    setDraggedItem(null)
  }
}

// In TodoItem
<div
  draggable
  onDragStart={() => handleDragStart(todo)}
  onDragOver={handleDragOver}
  onDrop={(e) => handleDrop(e, index)}
  className="cursor-move"
>
  {/* content */}
</div>
```

## Resources

- [@dnd-kit Documentation - Touch Sensors](https://docs.dndkit.com/presets/sortable/touch-sensors)
- [Web Accessibility Initiative - Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size)
- [MDN - Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
