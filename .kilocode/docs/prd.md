# **Product Requirements Document (PRD)**

**Project Name:** Priority Todo App
**Version:** 1.0
**Status:** Draft

---

## **1. Overview**

A lightweight, single-page web application designed for task management with an emphasis on priority levels and manual ordering. The application will allow users to quickly add tasks, categorize them by visual priority, manage their order, and clear them from the main view upon completion.

## **2. User Stories**

1. As a user, I want to add a task to a list so I don't forget it.
2. As a user, I want to assign a priority (P1, P2, P3) to a task so I know what to focus on.
3. As a user, I want the row color to reflect the priority for quick visual scanning.
4. As a user, I want to manually drag and drop tasks to arrange them in my preferred order.
5. As a user, I want to mark a task as done so it moves out of my way.
6. As a user, I want to see completed tasks in a collapsed section at the bottom in case I need to reference them.

## **3. Functional Requirements**

### **3.1 Adding Todos**

- **Input Field:** A text input field must be present at the top of the app.
- **Priority Selector:** A dropdown or radio group must accompany the input field to set the priority upon creation (Default: P2).
- **Add Action:** A button or "Enter" key action creates the new todo.

### **3.2 The Active Todo List**

- **Display:** All uncompleted todos must be displayed in a vertical list.
- **Row Content:** Each row must display the text content and the priority indicator.
- **Priority Logic:**
    - **P1:** High Priority
    - **P2:** Medium Priority
    - **P3:** Low Priority

### **3.3 Row Visuals & Priority**

- **Dynamic Coloring:** The background color of the todo row must change based on the selected priority tag.
    - *Suggested Scheme:*
        - P1: Light Red / Salmon
        - P2: Light Yellow / Cream
        - P3: Light Green / Mint

### **3.4 Reordering**

- **Drag and Drop:** Users must be able to drag a row up or down to change its position in the active list.
- **Persistence:** The new order must be maintained immediately after the drop action.

### **3.5 Completion & Collapsed List**

- **Completion Action:** Each row must have a checkbox or button to mark the item as complete.
- **Behavior:** Upon clicking complete:
    1. The item is removed from the active list.
    2. The item is moved to the "Completed" section.
    3. The "Completed" section expands momentarily (or updates a counter) to indicate activity, then remains collapsed based on user preference.
- **Completed Section:** Located below the active list.
    - **Default State:** Collapsed (Hidden). Displays a header text (e.g., "Completed Tasks (3)").
    - **Expanded State:** Shows a list of completed tasks (strikethrough text).
    - **Restore:** Allow clicking a completed item to move it back to the active list (Optional but recommended).

### **3.6 Editing Priority**

- Users must be able to change the priority of an existing todo in the list (e.g., via a dropdown within the row or a cycle button). The row color must update immediately.

## **4. Non-Functional Requirements**

- **Platform:** Single Page Application (SPA) running in a standard web browser (Chrome, Firefox, Safari, Edge).
- **Performance:** UI updates (adding, reordering, coloring) must be instant (< 100ms).
- **Data Persistence:** Data should be saved to **`localStorage`** so that todos remain after a page refresh.
- **Responsiveness:** The interface must be usable on mobile devices (touch support for dragging/reordering).

## **5. UI/UX Wireframe Description**

1. **Header:** App Title ("Priority Todo").
2. **Input Area (Top):**
    - [ Text Input Field................... ] [Priority: v] [Add Button]
3. **Active List (Middle):**
    - [Drag Handle] [Checkbox] [Todo Text.....................] [P1 Selector]
    - *(Row is Red)*
    - [Drag Handle] [Checkbox] [Buy Groceries.................] [P3 Selector]
    - *(Row is Green)*
4. **Completed Section (Bottom):**
    - ▼ Completed Tasks (2) <-- Clickable to Expand/Collapse
    - [Hidden List of finished items]

## **6. Technical Considerations**

- **Tech Stack:** Next.js, Shadcn UI, Tailwind CSS, TypeScript
- **Drag & Drop Library:** Use a library like **`SortableJS`** or HTML5 Native Drag and Drop API for the reordering feature.
- **State Management:** Select the best state management solution for the application.

## **7. Success Metrics**

- Users can successfully add and reorder 10 items without lag.
- Priority colors are distinct and accessible.
- Completed items are successfully moved to the collapsed section.