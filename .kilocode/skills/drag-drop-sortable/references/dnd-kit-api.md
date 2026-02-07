# @dnd-kit API Reference

This document provides a quick reference for the @dnd-kit library API.

## Core API

### DndContext

The main context provider for drag-and-drop functionality.

```tsx
import { DndContext } from "@dnd-kit/core"

<DndContext
  sensors={sensors}
  collisionDetection={collisionDetection}
  onDragStart={handleDragStart}
  onDragMove={handleDragMove}
  onDragEnd={handleDragEnd}
  onDragCancel={handleDragCancel}
>
  {/* Draggable and droppable components */}
</DndContext>
```

#### Props

- `sensors`: Array of sensors (PointerSensor, KeyboardSensor, etc.)
- `collisionDetection`: Collision detection algorithm (closestCenter, etc.)
- `onDragStart`: Callback when drag starts
- `onDragMove`: Callback during drag
- `onDragEnd`: Callback when drag ends
- `onDragCancel`: Callback when drag is cancelled
- `autoScroll`: Enable auto-scrolling (default: true)
- `measuring`: Configuration for measuring elements

### useDraggable

Hook to make an element draggable.

```tsx
import { useDraggable } from "@dnd-kit/core"

function Draggable({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
```

#### Return Value

- `attributes`: ARIA attributes for accessibility
- `listeners`: Event listeners for drag operations
- `setNodeRef`: Ref callback to attach to the element
- `transform`: Current transform values
- `isDragging`: Boolean indicating if element is being dragged

### useDroppable

Hook to make an element droppable.

```tsx
import { useDroppable } from "@dnd-kit/core"

function Droppable({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className={isOver ? "bg-blue-100" : ""}>
      {children}
    </div>
  )
}
```

#### Return Value

- `setNodeRef`: Ref callback to attach to the element
- `isOver`: Boolean indicating if draggable is over this droppable
- `active`: The active draggable element

## Sortable API

### SortableContext

Context provider for sortable lists.

```tsx
import { SortableContext } from "@dnd-kit/sortable"

<SortableContext
  items={items.map((item) => item.id)}
  strategy={verticalListSortingStrategy}
>
  {/* Sortable items */}
</SortableContext>
```

#### Props

- `items`: Array of unique identifiers
- `strategy`: Sorting strategy (verticalListSortingStrategy, horizontalListSortingStrategy, rectSortingStrategy)
- `id`: Optional context ID

### useSortable

Hook to make an element sortable.

```tsx
import { useSortable } from "@dnd-kit/sortable"

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
```

#### Return Value

- `attributes`: ARIA attributes for accessibility
- `listeners`: Event listeners for drag operations
- `setNodeRef`: Ref callback to attach to the element
- `transform`: Current transform values
- `transition`: Transition styles
- `isDragging`: Boolean indicating if element is being dragged

### Sorting Strategies

```tsx
import {
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable"

// Vertical list
<SortableContext strategy={verticalListSortingStrategy}>

// Horizontal list
<SortableContext strategy={horizontalListSortingStrategy}>

// Grid layout
<SortableContext strategy={rectSortingStrategy}>
```

## Utilities API

### CSS.Transform

Utility for transforming CSS values.

```tsx
import { CSS } from "@dnd-kit/utilities"

const style = {
  transform: CSS.Transform.toString(transform),
}
```

### arrayMove

Utility for reordering arrays.

```tsx
import { arrayMove } from "@dnd-kit/sortable"

const newItems = arrayMove(items, oldIndex, newIndex)
```

### closestCenter

Collision detection algorithm.

```tsx
import { closestCenter } from "@dnd-kit/core"

<DndContext collisionDetection={closestCenter}>
```

## Sensors API

### PointerSensor

Sensor for pointer events (mouse, touch, pen).

```tsx
import { useSensor, PointerSensor } from "@dnd-kit/core"

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Pixels to move before drag starts
    },
  })
)
```

#### Options

- `activationConstraint`: Constraint for activation
  - `distance`: Minimum pixels to move
  - `delay`: Milliseconds to wait
  - `tolerance`: Tolerance for activation

### KeyboardSensor

Sensor for keyboard events.

```tsx
import { useSensor, KeyboardSensor, sortableKeyboardCoordinates } from "@dnd-kit/core"

const sensors = useSensors(
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
)
```

#### Options

- `coordinateGetter`: Function to get coordinates from keyboard events

## Collision Detection

### closestCenter

Finds the closest droppable to the center of the draggable.

```tsx
import { closestCenter } from "@dnd-kit/core"
```

### pointerWithin

Finds droppables that contain the pointer.

```tsx
import { pointerWithin } from "@dnd-kit/core"
```

### rectIntersection

Finds droppables that intersect with the draggable.

```tsx
import { rectIntersection } from "@dnd-kit/core"
```

## DragOverlay

Component to show a visual overlay during drag.

```tsx
import { DragOverlay } from "@dnd-kit/core"

<DragOverlay>
  {activeId ? <div>{activeItem}</div> : null}
</DragOverlay>
```

## Modifiers

Modifiers transform the drag coordinates.

```tsx
import { useSensor, PointerSensor } from "@dnd-kit/core"

const sensors = useSensors(
  useSensor(PointerSensor, {
    modifiers: [
      restrictToVerticalAxis,
      restrictToWindowEdges,
      restrictToParentElement,
    ],
  })
)
```

### Available Modifiers

```tsx
import {
  restrictToVerticalAxis,
  restrictToHorizontalAxis,
  restrictToWindowEdges,
  restrictToParentElement,
  createSnapModifier,
} from "@dnd-kit/modifiers"
```

## Accessibility

### ARIA Attributes

The library automatically adds ARIA attributes:

- `aria-grabbed`: Indicates if element is being dragged
- `aria-dropeffect`: Indicates the effect of dropping
- `role`: Sets appropriate roles (listitem, button, etc.)

### Keyboard Navigation

Default keyboard shortcuts:
- `Tab`: Focus on sortable items
- `Arrow keys`: Move between items
- `Space` or `Enter`: Start dragging
- `Arrow keys` (while dragging): Move the dragged item
- `Enter` or `Space` (while dragging): Drop the item

## Best Practices

1. **Use unique IDs**: Ensure all draggable items have unique IDs
2. **Memoize callbacks**: Use `useCallback` for drag event handlers
3. **Optimize rendering**: Use `React.memo` for complex items
4. **Handle errors**: Add error handling for edge cases
5. **Test on mobile**: Verify touch interactions work correctly
6. **Accessibility**: Ensure keyboard navigation works

## Resources

- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [@dnd-kit GitHub](https://github.com/clauderic/dnd-kit)
- [Sortable Examples](https://docs.dndkit.com/presets/sortable)
- [Draggable Examples](https://docs.dndkit.com/presets/draggable)
