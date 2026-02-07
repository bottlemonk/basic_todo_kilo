# Priority Todo App

A lightweight, single-page web application designed for task management with an emphasis on priority levels and manual ordering.

## Features

- ✅ Add tasks with priority levels (P1, P2, P3)
- 🎨 Visual priority coloring (P1: Red, P2: Yellow, P3: Green)
- 🔄 Drag-and-drop reordering with touch support
- ✅ Mark tasks as complete (moves to collapsed section)
- 📦 localStorage persistence (data survives page refresh)
- 📱 Responsive design for mobile and desktop
- ♿ Accessible with keyboard navigation
- 🌙 Dark mode support

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **UI Components:** Shadcn UI
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Drag & Drop:** @dnd-kit/sortable
- **State Management:** React Hooks (useState, useReducer)
- **Data Persistence:** localStorage API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Todos

1. Type your task in the input field
2. Select a priority level (P1, P2, or P3)
3. Click the Add button or press Enter

### Managing Todos

- **Drag and drop:** Use the grip handle to reorder tasks
- **Mark complete:** Click the checkbox to move to completed section
- **Change priority:** Click the priority buttons to update
- **Restore completed:** Click on a completed task to restore it

### Priority Levels

- **P1 (High):** Light Red/Salmon background
- **P2 (Medium):** Light Yellow/Cream background
- **P3 (Low):** Light Green/Mint background

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── select.tsx
│   │   ├── label.tsx
│   │   └── collapsible.tsx
│   ├── todo-input.tsx      # Input component
│   ├── todo-list.tsx       # List with drag-drop
│   ├── todo-item.tsx       # Individual todo row
│   ├── priority-selector.tsx # Priority selector
│   └── completed-section.tsx # Collapsed completed tasks
├── hooks/
│   └── use-todos.ts       # Todo state management
└── lib/
    ├── types.ts            # TypeScript types
    ├── storage.ts          # localStorage utilities
    └── utils.ts            # Helper functions
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- UI updates: < 100ms
- Initial load: < 500ms
- Page refresh: < 100ms

## Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Screen reader compatible
- ARIA attributes
- Focus management

## License

MIT License - see LICENSE file for details
