# Priority Todo App - Required Skills

## Overview

This document outlines the KiloCode skills that would be beneficial for implementing the Priority Todo App. These skills can be created to streamline development and provide reusable patterns for similar projects.

---

## Recommended Skills to Create

### 1. Next.js + Shadcn UI Project Setup Skill

**Skill Name:** `nextjs-shadcn-setup`

**Purpose:** Quickly scaffold a new Next.js project with Shadcn UI components pre-configured.

**Description:**
This skill automates the setup of a Next.js 14+ project with TypeScript, Tailwind CSS, and Shadcn UI. It handles all the initial configuration, dependency installation, and component initialization so developers can start building features immediately.

**When to Use:**
- Starting a new Next.js project that needs Shadcn UI components
- Creating a project with modern React UI patterns
- Setting up a project with TypeScript and Tailwind CSS

**What This Skill Does:**
1. Initializes a new Next.js project with TypeScript
2. Installs and configures Tailwind CSS
3. Installs Shadcn UI CLI and initializes it
4. Installs commonly used Shadcn UI components (Button, Input, Select, Checkbox, Collapsible)
5. Sets up project structure (components/, lib/, hooks/ directories)
6. Configures path aliases and TypeScript strict mode
7. Creates a basic layout and page structure

**Files Created/Modified:**
- `package.json` (with dependencies)
- `tailwind.config.ts` (with custom theme)
- `components.json` (Shadcn UI config)
- `components/ui/` (Shadcn UI components)
- `lib/utils.ts` (utility functions)
- `app/layout.tsx` (root layout)
- `app/page.tsx` (home page)
- `app/globals.css` (global styles)

**Commands Executed:**
```bash
npx create-next-app@latest --typescript --tailwind --eslint
npm install -D @types/node
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select checkbox collapsible
```

**Dependencies Added:**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "eslint": "^8.0.0"
  }
}
```

**User Interactions:**
- Project name (optional, defaults to current directory)
- TypeScript strict mode (default: yes)
- ESLint configuration (default: yes)

**Success Criteria:**
- Next.js project runs successfully with `npm run dev`
- Shadcn UI components are importable and functional
- Tailwind CSS is working
- TypeScript has no errors

---

### 2. Drag & Drop Implementation Skill

**Skill Name:** `drag-drop-sortable`

**Purpose:** Implement drag-and-drop reordering functionality using @dnd-kit/sortable.

**Description:**
This skill provides a complete implementation of drag-and-drop reordering for lists using the @dnd-kit library. It includes touch support for mobile devices, smooth animations, and accessibility features.

**When to Use:**
- Building a sortable list component
- Implementing reordering functionality
- Creating drag-and-drop interfaces with touch support

**What This Skill Does:**
1. Installs @dnd-kit dependencies (@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities)
2. Creates a reusable SortableList component
3. Creates a SortableItem component with drag handle
4. Implements drag overlay for visual feedback
5. Adds smooth animations and transitions
6. Configures accessibility attributes (ARIA roles, keyboard navigation)
7. Provides example usage and documentation

**Files Created:**
- `components/sortable-list.tsx` (main sortable list component)
- `components/sortable-item.tsx` (individual sortable item)
- `hooks/use-dnd-context.ts` (DnD context provider hook)

**Dependencies Added:**
```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2"
  }
}
```

**Component Interface:**
```typescript
interface SortableListProps {
  items: Array<{ id: string; [key: string]: any }>;
  onReorder: (oldIndex: number, newIndex: number) => void;
  renderItem: (item: any, index: number) => React.ReactNode;
  disabled?: boolean;
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}
```

**Example Usage:**
```tsx
<SortableList
  items={todos}
  onReorder={handleReorder}
  renderItem={(todo, index) => (
    <SortableItem id={todo.id}>
      <div>{todo.text}</div>
    </SortableItem>
  )}
/>
```

**Features:**
- Touch support for mobile devices
- Keyboard navigation (Arrow keys, Enter, Space)
- Drag handle for precise control
- Visual feedback during drag (overlay, placeholder)
- Smooth animations
- Accessibility (ARIA attributes, screen reader support)

**Success Criteria:**
- Items can be dragged and reordered
- Touch works on mobile devices
- Keyboard navigation functions correctly
- Animations are smooth (< 100ms)
- Accessibility audit passes

---

### 3. localStorage Persistence Pattern Skill

**Skill Name:** `localstorage-persistence`

**Purpose:** Implement robust localStorage persistence with error handling and data validation.

**Description:**
This skill provides a complete pattern for persisting application state to localStorage. It includes error handling, data validation, migration support, and TypeScript type safety.

**When to Use:**
- Building applications that need to persist data across sessions
- Implementing offline-first features
- Creating apps that work without a backend

**What This Skill Does:**
1. Creates a generic `useLocalStorage` hook for any data type
2. Creates a `storage.ts` utility module with helper functions
3. Implements error handling for quota exceeded, corrupted data, and disabled storage
4. Adds data validation using Zod schemas
5. Implements data versioning and migration
6. Provides TypeScript type inference
7. Includes unit tests for storage utilities

**Files Created:**
- `hooks/use-local-storage.ts` (generic localStorage hook)
- `lib/storage.ts` (storage utilities)
- `lib/storage-migrations.ts` (data migration logic)
- `lib/schemas.ts` (Zod validation schemas)

**Dependencies Added:**
```json
{
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

**Hook Interface:**
```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    validate?: (value: unknown) => value is T;
  }
): [T, (value: T | ((prev: T) => T)) => void, () => void];
```

**Example Usage:**
```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const [todos, setTodos, clearTodos] = useLocalStorage<Todo[]>(
  'todos',
  [],
  {
    validate: (value): value is Todo[] => {
      return Array.isArray(value) && value.every(isTodo);
    }
  }
);
```

**Features:**
- Type-safe with TypeScript generics
- Error handling for:
  - localStorage quota exceeded
  - Corrupted/invalid data
  - Storage disabled (privacy mode)
  - JSON parsing errors
- Data validation with Zod schemas
- Versioning and migration support
- SSR-safe (no localStorage access on server)
- Automatic cleanup on errors
- Unit tests included

**Storage Utilities:**
```typescript
// Save data to localStorage
function save<T>(key: string, value: T): boolean;

// Load data from localStorage
function load<T>(key: string, defaultValue: T): T;

// Remove data from localStorage
function remove(key: string): boolean;

// Clear all localStorage data
function clear(): void;

// Check if localStorage is available
function isAvailable(): boolean;

// Get storage usage
function getUsage(): { used: number; total: number; percentage: number };
```

**Success Criteria:**
- Data persists across page refreshes
- Errors are handled gracefully
- Invalid data falls back to default values
- TypeScript types are inferred correctly
- Unit tests pass
- Works in SSR environments (Next.js)

---

## Alternative Skills (Optional)

### 4. React State Management with useReducer Skill

**Skill Name:** `react-usereducer-pattern`

**Purpose:** Implement complex state management using React's useReducer hook.

**Description:**
This skill provides a pattern for managing complex application state using useReducer, with actions, reducers, and selectors.

**When to Use:**
- Managing complex state with multiple actions
- Need for predictable state updates
- Implementing undo/redo functionality

**What This Skill Does:**
1. Creates a generic useReducer hook setup
2. Implements action types and creators
3. Creates reducer function with type safety
4. Adds selector functions for derived state
5. Implements middleware pattern for side effects
6. Provides example usage patterns

---

### 5. Tailwind CSS Custom Theme Skill

**Skill Name:** `tailwind-custom-theme`

**Purpose:** Configure a custom Tailwind CSS theme with brand colors and design tokens.

**Description:**
This skill sets up a custom Tailwind CSS configuration with semantic color names, spacing scales, and design tokens.

**When to Use:**
- Creating a consistent design system
- Implementing custom color schemes
- Extending Tailwind with custom utilities

**What This Skill Does:**
1. Extends Tailwind config with custom colors
2. Adds custom spacing and typography scales
3. Creates CSS custom properties for theming
4. Adds dark mode support
5. Provides component-specific utility classes

---

### 6. Accessibility (A11y) Patterns Skill

**Skill Name:** `react-a11y-patterns`

**Purpose:** Implement accessible React components following WCAG guidelines.

**Description:**
This skill provides patterns and utilities for building accessible React applications with proper ARIA attributes, keyboard navigation, and screen reader support.

**When to Use:**
- Building accessible UI components
- Ensuring WCAG compliance
- Implementing keyboard navigation

**What This Skill Does:**
1. Creates accessible component wrappers
2. Implements keyboard navigation hooks
3. Adds ARIA attribute utilities
4. Creates focus management utilities
5. Provides screen reader announcements

---

## Skill Creation Priority

### High Priority (Create First)
1. **nextjs-shadcn-setup** - Foundation for the entire project
2. **drag-drop-sortable** - Core feature requiring specialized knowledge
3. **localstorage-persistence** - Critical for data persistence

### Medium Priority (Create if Time Permits)
4. **react-usereducer-pattern** - Useful for state management
5. **tailwind-custom-theme** - Nice to have for theming

### Low Priority (Optional)
6. **react-a11y-patterns** - Important but can be implemented manually

---

## Skill Dependencies

```
nextjs-shadcn-setup (Foundation)
    ├── drag-drop-sortable (depends on Next.js + React)
    ├── localstorage-persistence (depends on React hooks)
    └── tailwind-custom-theme (extends Tailwind config)

react-usereducer-pattern (standalone)
react-a11y-patterns (standalone)
```

---

## Implementation Order

1. **Create `nextjs-shadcn-setup` skill first**
   - This provides the project foundation
   - All other skills build on this base

2. **Create `drag-drop-sortable` skill second**
   - This is a complex feature that benefits from a reusable pattern
   - Touch support and accessibility require specialized knowledge

3. **Create `localstorage-persistence` skill third**
   - Critical for the app's functionality
   - Error handling and validation are important to get right

4. **Create remaining skills as needed**
   - Based on project requirements and time constraints

---

## Summary

Creating these three high-priority skills will significantly accelerate development of the Priority Todo App:

1. **nextjs-shadcn-setup** - Gets the project up and running in minutes
2. **drag-drop-sortable** - Handles the complex drag-and-drop feature with accessibility
3. **localstorage-persistence** - Provides robust data persistence with error handling

These skills are also reusable for future projects, providing long-term value beyond this specific application.
