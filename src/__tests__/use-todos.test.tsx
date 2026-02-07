import { act, renderHook } from "@testing-library/react"
import { useTodos } from "@/hooks/use-todos"

describe("useTodos", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("adds, updates and deletes a todo", () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo("Test task", "P2")
    })
    expect(result.current.todos).toHaveLength(1)
    const todoId = result.current.todos[0].id

    act(() => {
      result.current.updateTodo(todoId, { text: "Updated task", priority: "P1" })
    })
    expect(result.current.todos[0].text).toBe("Updated task")
    expect(result.current.todos[0].priority).toBe("P1")

    act(() => {
      result.current.deleteTodo(todoId)
    })
    expect(result.current.todos).toHaveLength(0)
  })

  it("supports undo and redo", () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo("A", "P2")
    })
    expect(result.current.todos).toHaveLength(1)

    act(() => {
      result.current.undo()
    })
    expect(result.current.todos).toHaveLength(0)

    act(() => {
      result.current.redo()
    })
    expect(result.current.todos).toHaveLength(1)
  })
})
