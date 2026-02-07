"use client"

import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Todo } from "@/lib/types"

interface CompletedSectionProps {
  completedTodos: Todo[]
  onRestore: (id: string) => void
  onClear: () => void
}

export function CompletedSection({
  completedTodos,
  onRestore,
  onClear,
}: CompletedSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (completedTodos.length === 0) {
    return null
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="mt-8 border-t pt-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            <span className="font-medium">
              Completed Tasks ({completedTodos.length})
            </span>
            <ChevronsUpDown className="h-4 w-4 transition-transform" />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => onRestore(todo.id)}
                className="flex items-center gap-3 rounded-lg p-3 bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              >
                <span className="flex-1 text-sm line-through opacity-50">
                  {todo.text}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {todo.priority}
                </span>
              </div>
            ))}
          </div>

          {completedTodos.length > 0 && (
            <div className="mt-4 flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    Clear All Completed
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear completed tasks?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes {completedTodos.length} completed task(s).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClear}>Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
