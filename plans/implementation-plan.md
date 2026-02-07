# Priority Todo App - Implementation Plan

## Executive Summary

This document outlines the implementation plan for the Priority Todo App, a lightweight single-page web application built with Next.js, Shadcn UI, Tailwind CSS, and TypeScript. The app focuses on task management with priority levels, visual categorization, manual drag-and-drop reordering, and a collapsed completed tasks section.

---

## Architecture Overview

### Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **UI Components:** Shadcn UI
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Drag & Drop:** SortableJS (via @dnd-kit/sortable or react-beautiful-dnd)
- **State Management:** React Hooks (useState, useReducer) or Zustand
- **Data Persistence:** localStorage API
- **Icons:** Lucide React (included with Shadcn UI)

### Project Structure

```
basic_todo_kilo/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main todo app page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── todo-input.tsx      # Input field with priority selector
│   ├── todo-list.tsx       # Active todos list with drag-drop
│   ├── todo-item.tsx       # Individual todo row component
│   ├── completed-section.tsx # Collapsed completed tasks
│   └── priority-selector.tsx # Priority dropdown/cycle button
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── storage.ts          # localStorage utilities
│   └── utils.ts            # Helper functions
├── hooks/
│   ├── useTodos.ts         # Todo state management hook
│   └── useLocalStorage.ts  # localStorage persistence hook
└── public/
    └── (assets)
```

---

## Implementation Phases

### Phase 1: Project Setup & Foundation

**Objective:** Initialize Next.js project with required dependencies and configure Shadcn UI.

#### Tasks:
1. Initialize Next.js project with TypeScript
2. Install and configure Tailwind CSS
3. Install Shadcn UI and initialize components
4. Install additional dependencies:
   - `@dnd-kit/core` and `@dnd-kit/sortable` (or `react-beautiful-dnd`)
   - `lucide-react` (if not included)
   - `clsx` and `tailwind-merge` (for class utilities)
5. Configure project structure and directories
6. Set up TypeScript strict mode and path aliases

**Deliverables:**
- Functional Next.js project
- Shadcn UI configured with base components (Button, Input, Select, Checkbox, Collapsible)
- Tailwind CSS configured with custom color scheme for priorities

---

### Phase 2: Core Data Models & State Management

**Objective:** Define data structures and implement state management with persistence.

#### Tasks:
1. Define TypeScript interfaces:
   ```typescript
   interface Todo {
     id: string;
     text: string;
     priority: 'P1' | 'P2' | 'P3';
     completed: boolean;
     createdAt: number;
   }

   interface TodoState {
     todos: Todo[];
     addTodo: (text: string, priority: Priority) => void;
     updateTodo: (id: string, updates: Partial<Todo>) => void;
     deleteTodo: (id: string) => void;
     toggleComplete: (id: string) => void;
     reorderTodos: (oldIndex: number, newIndex: number) => void;
     clearCompleted: () => void;
   }
   ```

2. Implement localStorage utilities:
   - `saveTodos(todos: Todo[]): void`
   - `loadTodos(): Todo[]`
   - Handle serialization/deserialization errors

3. Create `useTodos` hook with state management:
   - Use `useReducer` for complex state logic
   - Integrate localStorage persistence
   - Implement optimistic updates

4. Create `useLocalStorage` generic hook for reusable persistence

**Deliverables:**
- TypeScript type definitions
- State management hooks with localStorage integration
- Unit tests for state management logic

---

### Phase 3: UI Components Development

**Objective:** Build reusable UI components following Shadcn UI patterns.

#### Tasks:

1. **Priority Selector Component** (`priority-selector.tsx`)
   - Dropdown or cycle button for P1/P2/P3
   - Visual indicator of current priority
   - Accessible keyboard navigation

2. **Todo Input Component** (`todo-input.tsx`)
   - Text input field
   - Priority selector integrated
   - Add button with Enter key support
   - Form validation (non-empty text)

3. **Todo Item Component** (`todo-item.tsx`)
   - Drag handle (grip icon)
   - Checkbox for completion
   - Todo text display
   - Priority selector inline
   - Dynamic background color based on priority
   - Strikethrough style for completed items

4. **Todo List Component** (`todo-list.tsx`)
   - Container for active todos
   - Drag and drop integration
   - Empty state message
   - Smooth animations for reordering

5. **Completed Section Component** (`completed-section.tsx`)
   - Collapsible header with counter
   - List of completed items
   - Restore functionality (optional)
   - Clear all completed button (optional)

6. **Main Page Component** (`page.tsx`)
   - Compose all components
   - Header with app title
   - Responsive layout

**Deliverables:**
- All UI components implemented
- Components follow Shadcn UI design system
- Responsive design for mobile/desktop

---

### Phase 4: Drag & Drop Implementation

**Objective:** Implement smooth drag-and-drop reordering with touch support.

#### Tasks:

1. Choose drag-and-drop library:
   - **Option A:** `@dnd-kit/core` + `@dnd-kit/sortable` (Recommended)
     - Better accessibility
     - Touch support out of the box
     - Smoother animations
   - **Option B:** `react-beautiful-dnd`
     - More mature library
     - Good documentation
   - **Option C:** HTML5 Native Drag & Drop
     - No dependencies
     - Requires more custom code
     - Limited touch support

2. Implement drag-and-drop logic:
   - Wrap todo list with DndContext
   - Add useSortable hook to todo items
   - Implement drag handles
   - Handle onDragEnd events
   - Update state with new order

3. Add visual feedback:
   - Drag overlay for lifted item
   - Placeholder for drop position
   - Smooth animations

4. Ensure mobile touch support:
   - Test on touch devices
   - Adjust touch targets for mobile
   - Prevent scrolling while dragging

**Deliverables:**
- Functional drag-and-drop reordering
- Touch support for mobile devices
- Smooth animations and visual feedback

---

### Phase 5: Styling & Theming

**Objective:** Apply Tailwind CSS styling with priority-based color scheme.

#### Tasks:

1. Define priority color scheme in Tailwind config:
   ```javascript
   colors: {
     priority: {
       p1: 'var(--color-priority-p1)', // Light Red/Salmon
       p2: 'var(--color-priority-p2)', // Light Yellow/Cream
       p3: 'var(--color-priority-p3)', // Light Green/Mint
     }
   }
   ```

2. Apply CSS variables for accessibility:
   ```css
   :root {
     --color-priority-p1: #fecaca;
     --color-priority-p2: #fef3c7;
     --color-priority-p3: #d1fae5;
   }
   ```

3. Style components:
   - Todo rows with dynamic background colors
   - Hover states for interactive elements
   - Focus states for accessibility
   - Responsive breakpoints for mobile

4. Add animations:
   - Fade in/out for adding/removing todos
   - Slide animations for reordering
   - Expand/collapse animations for completed section

5. Ensure accessibility:
   - Sufficient color contrast ratios
   - Keyboard navigation support
   - ARIA labels and roles
   - Screen reader announcements

**Deliverables:**
- Fully styled application
- Priority-based color scheme
- Accessible design (WCAG AA compliant)
- Responsive layout

---

### Phase 6: Data Persistence & Edge Cases

**Objective:** Implement robust localStorage persistence and handle edge cases.

#### Tasks:

1. Implement localStorage persistence:
   - Save todos on every state change
   - Load todos on app initialization
   - Handle quota exceeded errors
   - Handle corrupted data

2. Handle edge cases:
   - Empty todo list state
   - Very long todo text (truncate with ellipsis)
   - Special characters in todo text
   - Duplicate todos (allow or prevent?)
   - Browser storage disabled

3. Add data migration strategy:
   - Version localStorage data
   - Handle schema changes in future updates

4. Implement undo functionality (optional):
   - Last action history
   - Undo button for recent actions

**Deliverables:**
- Robust localStorage persistence
- Error handling for edge cases
- Data migration strategy

---

### Phase 7: Testing & Quality Assurance

**Objective:** Ensure application works correctly across browsers and devices.

#### Tasks:

1. **Unit Testing:**
   - Test state management hooks
   - Test localStorage utilities
   - Test helper functions

2. **Integration Testing:**
   - Test component interactions
   - Test drag-and-drop functionality
   - Test form submissions

3. **Manual Testing:**
   - Add, edit, complete, delete todos
   - Drag and drop reordering
   - Priority color changes
   - Completed section expand/collapse
   - localStorage persistence (refresh page)
   - Mobile touch interactions

4. **Cross-Browser Testing:**
   - Chrome
   - Firefox
   - Safari
   - Edge

5. **Cross-Device Testing:**
   - Desktop (1920x1080, 1366x768)
   - Tablet (768x1024)
   - Mobile (375x667, 414x896)

6. **Performance Testing:**
   - Add 10+ todos and verify no lag
   - Measure UI update times (< 100ms target)

7. **Accessibility Testing:**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast verification

**Deliverables:**
- Test suite with passing tests
- Cross-browser compatibility verified
- Mobile responsiveness verified
- Accessibility audit passed

---

### Phase 8: Deployment & Documentation

**Objective:** Deploy application and create documentation.

#### Tasks:

1. **Deployment:**
   - Build production bundle: `npm run build`
   - Test production build locally
   - Deploy to Vercel (recommended for Next.js)
   - Configure custom domain (optional)

2. **Documentation:**
   - Create README.md with:
     - Project overview
     - Installation instructions
     - Development setup
     - Usage guide
     - Tech stack details
   - Add inline code comments
   - Document component props and hooks

3. **Final Review:**
   - Verify all PRD requirements met
   - Check for any bugs or issues
   - Performance optimization
   - Code cleanup and refactoring

**Deliverables:**
- Deployed application
- Complete documentation
- Final code review completed

---

## Technical Decisions & Rationale

### 1. State Management: React Hooks (useReducer)

**Decision:** Use `useReducer` for complex state logic instead of external libraries like Zustand.

**Rationale:**
- Application complexity is low-medium
- No need for global state across multiple pages
- React hooks are built-in and sufficient
- Reduces bundle size and dependencies
- Easier to understand and maintain

**Alternative:** Zustand could be used if the application grows in complexity or needs more advanced features like time-travel debugging.

---

### 2. Drag & Drop: @dnd-kit/sortable

**Decision:** Use `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop functionality.

**Rationale:**
- Modern, actively maintained library
- Excellent accessibility support
- Built-in touch support for mobile
- Smooth animations out of the box
- Smaller bundle size than react-beautiful-dnd
- Better TypeScript support

**Alternative:** HTML5 Native Drag & Drop API could be used to reduce dependencies, but would require more custom code and has limited touch support.

---

### 3. Styling: Tailwind CSS with Shadcn UI

**Decision:** Use Tailwind CSS for styling and Shadcn UI for component primitives.

**Rationale:**
- Tailwind CSS enables rapid development
- Shadcn UI provides accessible, customizable components
- Both have excellent TypeScript support
- Consistent design system
- Easy to customize and extend

---

### 4. Data Persistence: localStorage

**Decision:** Use localStorage for data persistence as specified in PRD.

**Rationale:**
- Simple and sufficient for this use case
- No backend required
- Fast and reliable for small datasets
- Works offline
- Meets PRD requirements

**Considerations:**
- localStorage has ~5MB limit (sufficient for todos)
- Data is not synced across devices
- Consider adding export/import functionality for backup

---

## Priority Color Scheme

### Recommended Colors (Tailwind)

```css
/* P1: High Priority - Light Red/Salmon */
--color-priority-p1: #fecaca; /* red-200 */
--color-priority-p1-hover: #fca5a5; /* red-300 */
--color-priority-p1-text: #991b1b; /* red-800 */

/* P2: Medium Priority - Light Yellow/Cream */
--color-priority-p2: #fef3c7; /* amber-100 */
--color-priority-p2-hover: #fde68a; /* amber-200 */
--color-priority-p2-text: #92400e; /* amber-800 */

/* P3: Low Priority - Light Green/Mint */
--color-priority-p3: #d1fae5; /* emerald-100 */
--color-priority-p3-hover: #a7f3d0; /* emerald-200 */
--color-priority-p3-text: #065f46; /* emerald-800 */
```

### Accessibility Considerations

- Ensure text contrast ratio meets WCAG AA (4.5:1 for normal text)
- Use darker text colors on light backgrounds
- Test with color blindness simulators
- Provide alternative indicators (icons, patterns) in addition to color

---

## Component Architecture

### Component Hierarchy

```
page.tsx (Main Page)
├── Header
├── TodoInput
│   ├── Input (Shadcn)
│   ├── PrioritySelector
│   └── Button (Shadcn)
├── TodoList
│   └── TodoItem (repeated)
│       ├── DragHandle
│       ├── Checkbox (Shadcn)
│       ├── TodoText
│       └── PrioritySelector
└── CompletedSection
    ├── Collapsible (Shadcn)
    │   ├── CollapsibleTrigger
    │   └── CollapsibleContent
    └── CompletedTodoItem (repeated)
```

### Data Flow

```
User Action → Component → useTodos Hook → State Update → localStorage Save → Re-render
```

### Props Interface Examples

```typescript
// TodoInput.tsx
interface TodoInputProps {
  onAdd: (text: string, priority: Priority) => void;
}

// TodoItem.tsx
interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onToggleComplete: (id: string) => void;
}

// TodoList.tsx
interface TodoListProps {
  todos: Todo[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onToggleComplete: (id: string) => void;
}
```

---

## Success Metrics & Validation

### PRD Requirements Checklist

- [x] Input field at top of app
- [x] Priority selector (dropdown/radio) with default P2
- [x] Add button or Enter key action
- [x] Vertical list of uncompleted todos
- [x] Row displays text and priority indicator
- [x] Dynamic background color based on priority (P1: Red, P2: Yellow, P3: Green)
- [x] Drag and drop reordering
- [x] Order maintained immediately after drop
- [x] Checkbox/button to mark complete
- [x] Item moves to "Completed" section
- [x] Completed section collapsed by default
- [x] Completed section shows counter
- [x] Completed section expandable
- [x] Strikethrough text for completed items
- [x] Ability to edit priority of existing todo
- [x] Single Page Application
- [x] UI updates < 100ms
- [x] localStorage persistence
- [x] Responsive/mobile support with touch for drag-drop
- [x] Cross-browser compatible (Chrome, Firefox, Safari, Edge)

### Performance Targets

- **Add Todo:** < 50ms
- **Complete Todo:** < 50ms
- **Reorder Todo:** < 100ms
- **Change Priority:** < 50ms
- **Initial Load:** < 500ms (including localStorage read)
- **Page Refresh:** < 100ms (restore from localStorage)

### Quality Metrics

- **Code Coverage:** > 80% for critical paths
- **Accessibility Score:** > 90 (Lighthouse)
- **Performance Score:** > 90 (Lighthouse)
- **Best Practices Score:** > 90 (Lighthouse)
- **SEO Score:** > 90 (Lighthouse)

---

## Risk Assessment & Mitigation

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Drag-drop library deprecation | Low | Medium | Choose stable, well-maintained library (@dnd-kit) |
| localStorage quota exceeded | Low | Medium | Implement error handling and cleanup |
| Mobile touch issues | Medium | Medium | Thorough mobile testing, use @dnd-kit |
| Browser compatibility issues | Low | Low | Cross-browser testing, polyfills if needed |
| Performance degradation with many todos | Low | Medium | Virtualization if > 100 items (not in scope) |
| Accessibility issues | Medium | High | Follow WCAG guidelines, use ARIA attributes |

---

## Future Enhancements (Out of Scope)

1. **User Accounts & Cloud Sync**
   - Backend API
   - User authentication
   - Cross-device sync

2. **Advanced Features**
   - Due dates and reminders
   - Tags and categories
   - Search and filter
   - Bulk actions
   - Undo/redo history
   - Export/import (JSON, CSV)

3. **Collaboration**
   - Share lists with others
   - Real-time updates
   - Comments on todos

4. **Analytics**
   - Task completion statistics
   - Productivity insights

5. **Themes**
   - Dark mode
   - Custom color schemes

---

## Development Workflow

### Branch Strategy

```
main (production)
  └── develop (integration)
      ├── feature/setup
      ├── feature/state-management
      ├── feature/ui-components
      ├── feature/drag-drop
      ├── feature/styling
      ├── feature/persistence
      ├── feature/testing
      └── feature/deployment
```

### Commit Convention

```
feat: add todo input component
fix: resolve drag-drop touch issues
style: apply priority color scheme
refactor: extract localStorage utilities
test: add unit tests for useTodos hook
docs: update README with deployment steps
chore: upgrade Next.js to v14
```

---

## Summary

This implementation plan provides a comprehensive roadmap for building the Priority Todo App as specified in the PRD. The plan is organized into 8 phases, covering project setup, data modeling, UI development, drag-and-drop functionality, styling, persistence, testing, and deployment.

The recommended tech stack (Next.js, Shadcn UI, Tailwind CSS, TypeScript, @dnd-kit) provides a modern, maintainable foundation with excellent developer experience and performance.

Key technical decisions prioritize simplicity, accessibility, and user experience while ensuring all PRD requirements are met.
