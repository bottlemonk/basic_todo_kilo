/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Get storage usage information
 */
export function getStorageUsage(): { used: number; total: number; percentage: number } {
  if (!isStorageAvailable()) {
    return { used: 0, total: 0, percentage: 0 }
  }

  let used = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length
    }
  }

  // localStorage typically has ~5MB limit
  const total = 5 * 1024 * 1024
  return {
    used,
    total,
    percentage: (used / total) * 100,
  }
}

/**
 * Save data to localStorage
 */
export function save<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available")
    return false
  }

  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error(`Failed to save to localStorage (key: ${key}):`, error)
    return false
  }
}

/**
 * Load data from localStorage
 */
export function load<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) {
    return defaultValue
  }

  try {
    const serialized = localStorage.getItem(key)
    if (serialized === null) {
      return defaultValue
    }
    return JSON.parse(serialized) as T
  } catch (error) {
    console.error(`Failed to load from localStorage (key: ${key}):`, error)
    return defaultValue
  }
}

/**
 * Remove data from localStorage
 */
export function remove(key: string): boolean {
  if (!isStorageAvailable()) {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Failed to remove from localStorage (key: ${key}):`, error)
    return false
  }
}

/**
 * Clear all localStorage data
 */
export function clear(): boolean {
  if (!isStorageAvailable()) {
    return false
  }

  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error("Failed to clear localStorage:", error)
    return false
  }
}
