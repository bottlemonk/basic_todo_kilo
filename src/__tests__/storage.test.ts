import { clear, isStorageAvailable, load, save } from "@/lib/storage"

describe("storage utilities", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("saves and loads values", () => {
    const payload = { message: "hello" }
    expect(save("test-key", payload)).toBe(true)
    expect(load("test-key", { message: "" })).toEqual(payload)
  })

  it("returns default value for missing keys", () => {
    expect(load("missing", "fallback")).toBe("fallback")
  })

  it("clears storage", () => {
    save("a", 1)
    expect(clear()).toBe(true)
    expect(load("a", 0)).toBe(0)
  })

  it("detects storage availability", () => {
    expect(isStorageAvailable()).toBe(true)
  })
})
