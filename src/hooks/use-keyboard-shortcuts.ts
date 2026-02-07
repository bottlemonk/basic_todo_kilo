"use client"

import { useEffect } from "react"

interface KeyboardShortcutHandlers {
  onNewTask: () => void
  onUndo: () => void
  onRedo: () => void
  onBlur: () => void
  onToggleHelp: () => void
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tag = target.tagName.toLowerCase()
  return (
    tag === "input" ||
    tag === "textarea" ||
    target.isContentEditable
  )
}

export function useKeyboardShortcuts({
  onNewTask,
  onUndo,
  onRedo,
  onBlur,
  onToggleHelp,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const editable = isEditableElement(event.target)

      if (event.key === "?" && !editable) {
        event.preventDefault()
        onToggleHelp()
        return
      }

      if ((event.key === "n" || event.key === "N") && !editable && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        onNewTask()
        return
      }

      if (event.key === "Escape") {
        onBlur()
        return
      }

      const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && !event.shiftKey
      if (isUndo) {
        event.preventDefault()
        onUndo()
        return
      }

      const isRedo =
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "z") ||
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y")
      if (isRedo) {
        event.preventDefault()
        onRedo()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onBlur, onNewTask, onRedo, onToggleHelp, onUndo])
}
