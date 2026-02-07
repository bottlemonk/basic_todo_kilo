# Task Details Modal Replacement Plan

## Objective

Replace the current per-row accordion details interaction with a modal edit flow:
- Replace row expand/chevron action with an edit icon button.
- Open a task details modal when edit is triggered.
- Move all existing expanded controls (due date, priority, recurrence, tags, subtasks, notes, delete) into the modal.

This plan focuses on implementation sequencing, regression safety, and mobile-first behavior.

## Current Behavior

- Task row shows chevron button.
- Clicking chevron expands inline details under the row.
- Inline area currently includes due date, priority selector, recurrence options, tags, subtasks, notes, and delete action.

## Target Behavior

- Task row shows an edit icon button (`Pencil`/`SquarePen`) instead of chevron.
- Clicking edit opens a modal (`Dialog`) centered on screen.
- Modal title identifies task being edited.
- Modal body contains all detail controls currently in accordion.
- Modal has explicit close control and closes on overlay click / Escape.
- Row stays compact; no inline expansion state.

## UX Requirements

1. Keep row scanability high:
- No multiline detail controls in list rows.
- Keep row actions minimal: drag, complete, edit.

2. Mobile-first modal behavior:
- Full-width modal on small screens (`max-w-none`, margins/padding tuned for touch).
- Internal scroll for long content (subtasks/tags/notes).
- Touch targets >= 44px.

3. Accessibility:
- Edit icon button has `aria-label="Edit task"`.
- Dialog has title and description for screen readers.
- Focus trap and focus return to triggering edit button on close.

4. Data behavior:
- Existing update handlers and undo/redo continue to work.
- No data model changes required for this swap.

## Implementation Scope

### Files to Update

- `src/components/todo-item.tsx`
- `src/components/todo-list.tsx` (only if props/interaction wiring changes)
- `src/components/ui/dialog.tsx` (new, if needed)
- `src/components/task-edit-modal.tsx` (new recommended extraction)

### Optional Supporting Updates

- `src/components/ui/button.tsx` (only if icon button sizing tweaks needed)
- `src/app/globals.css` (only for modal-overflow edge styling)

## Recommended Architecture

### Option A (Preferred): Extract Modal Component

Create `TaskEditModal`:
- Props:
  - `todo: Todo`
  - `open: boolean`
  - `onOpenChange: (open: boolean) => void`
  - `onUpdate: (id, updates) => void`
  - `onDelete: (id) => void`
  - `tagSuggestions?: string[]`
  - `readOnly?: boolean`
- Contains all former expanded UI sections.

`TodoItem` then:
- Holds `isEditOpen` local state.
- Renders compact row + edit icon.
- Renders `<TaskEditModal ... />`.

Benefits:
- Keeps row component lean.
- Isolates modal UI complexity.
- Easier testing and future reuse.

### Option B: Keep Modal Inline in `TodoItem`

- Faster, fewer files.
- Higher component complexity and harder maintenance.

## Detailed Implementation Steps

### Phase 1: Modal Primitive Setup

1. Add `src/components/ui/dialog.tsx` if not already available.
2. Use Radix dialog primitives with shadcn-style wrappers.
3. Support content scrolling and responsive widths.

Exit criteria:
- Dialog opens/closes correctly and traps focus.

### Phase 2: Move Expanded Controls Into Modal

1. Create `TaskEditModal` and copy controls from current expanded block:
- due date
- priority
- recurrence + custom days
- tags
- subtasks
- notes
- delete action + confirmation

2. Keep existing handlers unchanged where possible:
- `onUpdate(todo.id, {...})`
- subtask add/toggle/remove helpers

Exit criteria:
- Modal edits persist exactly like previous accordion behavior.

### Phase 3: Replace Row Expand Action

1. Remove `isExpanded` state and chevron button from `TodoItem`.
2. Add edit icon button and open-modal state.
3. Remove inline expanded section rendering.

Exit criteria:
- No accordion rendering remains.
- Edit icon opens modal for corresponding task.

### Phase 4: Polish + Mobile QA

1. Ensure modal layout on 320/375/390 widths.
2. Make modal body scrollable for long subtasks/notes.
3. Verify keyboard behavior:
- Escape closes modal.
- Focus returns to edit icon.

Exit criteria:
- Mobile interaction is smooth and no horizontal overflow.

## Regression Risks and Mitigation

1. Risk: Lost edit functionality during extraction.
- Mitigation: migrate controls section-by-section and verify each before removing accordion.

2. Risk: Drag interactions conflict with modal trigger.
- Mitigation: keep drag handle separate; edit button isolated.

3. Risk: Delete flow changes behavior.
- Mitigation: retain current AlertDialog confirmation in modal.

4. Risk: Accessibility regressions.
- Mitigation: run keyboard-only pass and screen reader label checks.

## Validation Checklist

Functional:
- Edit icon opens correct task modal.
- Due date, priority, tags, subtasks, notes, recurrence all editable.
- Delete from modal works with confirmation.
- Completing/deleting tasks still triggers current animation/undo behavior.

UX:
- Rows are compact and readable.
- Modal usable on mobile portrait.
- Long content scrolls inside modal.

Accessibility:
- `aria-label` on edit icon.
- Dialog title and description present.
- Escape close and focus restoration confirmed.

Build/quality:
- `npm run lint`
- `npm run build`
- `npm run test`

## Rollout Strategy

1. Implement behind direct swap (no feature flag needed unless requested).
2. Verify all checklist items.
3. If regressions appear, temporarily keep both paths and guard with prop flag (`useModalEditor`) during transition.

## Out of Scope

- Changing task data model.
- Redesigning list sorting/filtering behavior.
- Rewriting drag-and-drop architecture.
- Adding brand-new controls beyond what accordion already exposed.
