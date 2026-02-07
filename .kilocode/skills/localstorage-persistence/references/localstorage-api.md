# localStorage API Reference

This document provides a comprehensive reference for the localStorage API.

## Overview

The localStorage API provides a way to store key-value pairs in a web browser with no expiration time. Data stored in localStorage persists even after the browser is closed and reopened.

## Browser Support

localStorage is supported in all modern browsers:
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge (all versions)
- Opera 10.5+
- IE 8+

## API Methods

### setItem(key, value)

Stores a value with the specified key.

```javascript
localStorage.setItem("username", "john_doe")
localStorage.setItem("preferences", JSON.stringify({ theme: "dark" }))
```

**Parameters:**
- `key` (string): The name of the key to create or update
- `value` (string): The value to store

**Note:** Values are always stored as strings. Use `JSON.stringify()` for objects and arrays.

### getItem(key)

Retrieves the value for the specified key.

```javascript
const username = localStorage.getItem("username") // "john_doe"
const preferences = JSON.parse(localStorage.getItem("preferences") || "{}")
```

**Parameters:**
- `key` (string): The name of the key to retrieve

**Returns:** The value as a string, or `null` if the key doesn't exist.

### removeItem(key)

Removes the specified key from storage.

```javascript
localStorage.removeItem("username")
```

**Parameters:**
- `key` (string): The name of the key to remove

### clear()

Removes all keys from storage.

```javascript
localStorage.clear()
```

**Warning:** This removes all data for your domain, not just your app's data.

### key(index)

Gets the name of the key at the specified index.

```javascript
const firstKey = localStorage.key(0) // Gets the first key
```

**Parameters:**
- `index` (number): The index of the key to retrieve (0-based)

**Returns:** The name of the key, or `null` if the index doesn't exist.

### length

Returns the number of items in storage.

```javascript
const itemCount = localStorage.length
```

## Properties

### length

Returns the number of key-value pairs currently in storage.

```javascript
console.log(localStorage.length) // e.g., 5
```

## Storage Events

The `storage` event fires when a storage area (localStorage or sessionStorage) is modified in the context of another document.

```javascript
window.addEventListener("storage", (event) => {
  console.log("Key changed:", event.key)
  console.log("Old value:", event.oldValue)
  console.log("New value:", event.newValue)
  console.log("URL:", event.url)
  console.log("Storage area:", event.storageArea)
})
```

**Event Properties:**
- `key`: The key that was changed (null if clear() was called)
- `oldValue`: The previous value (null if key was added)
- `newValue`: The new value (null if key was removed)
- `url`: The URL of the document that made the change
- `storageArea`: The localStorage or sessionStorage object

**Note:** The storage event only fires in other windows/tabs of the same domain, not in the window that made the change.

## Storage Limits

### Quota

- **Typical limit:** ~5MB per domain
- **Varies by browser:** Some browsers allow more
- **Per-origin:** Shared across all pages on the same domain

### Checking Available Space

```javascript
function getStorageUsage() {
  let used = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length
    }
  }
  const total = 5 * 1024 * 1024 // 5MB
  return {
    used,
    total,
    available: total - used,
    percentage: (used / total) * 100,
  }
}

const usage = getStorageUsage()
console.log(`Used: ${(usage.used / 1024).toFixed(2)} KB`)
console.log(`Available: ${(usage.available / 1024).toFixed(2)} KB`)
```

## Error Handling

### Common Errors

1. **QuotaExceededError:** Storage limit reached
2. **SecurityError:** Storage disabled (e.g., privacy mode)
3. **InvalidAccessError:** Invalid key name

### Error Handling Pattern

```javascript
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.error("Storage quota exceeded")
      // Implement cleanup logic
    } else if (error.name === "SecurityError") {
      console.error("Storage is disabled")
    } else {
      console.error("Storage error:", error)
    }
    return false
  }
}

function safeGetItem(key, defaultValue = null) {
  try {
    return localStorage.getItem(key) ?? defaultValue
  } catch (error) {
    console.error("Failed to read from storage:", error)
    return defaultValue
  }
}
```

## Best Practices

### 1. Always Check for Availability

```javascript
function isStorageAvailable() {
  try {
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

if (isStorageAvailable()) {
  // Use localStorage
} else {
  // Fallback to memory storage
}
```

### 2. Use JSON for Complex Data

```javascript
// Storing
const data = {
  user: { name: "John", age: 30 },
  preferences: { theme: "dark", notifications: true },
}
localStorage.setItem("data", JSON.stringify(data))

// Retrieving
const stored = localStorage.getItem("data")
const data = stored ? JSON.parse(stored) : null
```

### 3. Handle Null Values

```javascript
// Bad
const value = JSON.parse(localStorage.getItem("data")) // Error if null

// Good
const stored = localStorage.getItem("data")
const value = stored ? JSON.parse(stored) : defaultValue
```

### 4. Use Namespaced Keys

```javascript
// Prefix keys to avoid conflicts
const PREFIX = "myapp_"

function setItem(key, value) {
  localStorage.setItem(`${PREFIX}${key}`, value)
}

function getItem(key, defaultValue = null) {
  return localStorage.getItem(`${PREFIX}${key}`) ?? defaultValue
}

// Usage
setItem("user", JSON.stringify(user))
const user = JSON.parse(getItem("user", "{}"))
```

### 5. Implement Versioning

```javascript
const STORAGE_VERSION = "1.0.0"
const VERSION_KEY = "myapp_version"

function checkVersion() {
  const currentVersion = localStorage.getItem(VERSION_KEY)
  if (currentVersion !== STORAGE_VERSION) {
    // Run migrations
    migrateData(currentVersion)
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION)
  }
}
```

## Security Considerations

### XSS Vulnerabilities

Data in localStorage is accessible to JavaScript on the same domain. Be careful with:

- **User input:** Never store untrusted user input
- **Sensitive data:** Avoid storing passwords, tokens, or PII
- **Sanitization:** Always validate and sanitize data before storing

### Same-Origin Policy

localStorage follows the same-origin policy:
- **Protocol:** Must match (http vs https)
- **Domain:** Must match (example.com vs www.example.com)
- **Port:** Must match (80 vs 8080)

### Clearing Data

Users can clear localStorage:
- Browser settings (clear browsing data)
- Incognito/private mode (cleared when closed)
- Browser extensions

## Performance Tips

### 1. Minimize Writes

```javascript
// Bad - writes on every change
input.addEventListener("input", (e) => {
  localStorage.setItem("value", e.target.value)
})

// Good - debounced writes
const debouncedSave = debounce((value) => {
  localStorage.setItem("value", value)
}, 500)

input.addEventListener("input", (e) => {
  debouncedSave(e.target.value)
})
```

### 2. Batch Operations

```javascript
// Bad - multiple writes
localStorage.setItem("name", "John")
localStorage.setItem("age", "30")
localStorage.setItem("city", "NYC")

// Good - single write
const data = { name: "John", age: 30, city: "NYC" }
localStorage.setItem("user", JSON.stringify(data))
```

### 3. Use Efficient Data Structures

```javascript
// Bad - storing large arrays
const items = Array(10000).fill({ id: 1, name: "Item" })
localStorage.setItem("items", JSON.stringify(items))

// Good - use IndexedDB for large datasets
```

## Debugging

### Inspect localStorage in DevTools

1. Open DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. Select your domain
5. View/edit key-value pairs

### Console Debugging

```javascript
// List all keys
Object.keys(localStorage).forEach((key) => {
  console.log(key, localStorage.getItem(key))
})

// Clear all keys
Object.keys(localStorage).forEach((key) => {
  localStorage.removeItem(key)
})

// Export all data
const exportData = {}
Object.keys(localStorage).forEach((key) => {
  exportData[key] = localStorage.getItem(key)
})
console.log(JSON.stringify(exportData, null, 2))
```

## Alternatives to localStorage

### sessionStorage

Similar to localStorage but data is cleared when the page session ends.

```javascript
sessionStorage.setItem("temp", "value")
```

### IndexedDB

For larger datasets and complex queries.

```javascript
const request = indexedDB.open("myDatabase", 1)
```

### Cookies

For server-side storage and HTTP requests.

```javascript
document.cookie = "username=John; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/"
```

## Browser-Specific Issues

### Private/Incognito Mode

Some browsers disable localStorage in private mode:

```javascript
function isStorageAvailable() {
  try {
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
```

### Safari ITP

Intelligent Tracking Prevention may limit localStorage usage.

### Mobile Browsers

Mobile browsers may have stricter storage limits and more aggressive cleanup.

## Resources

- [MDN Web Docs - localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Web Storage API Specification](https://html.spec.whatwg.org/multipage/webstorage.html)
- [Browser Storage Limits](https://stackoverflow.com/questions/2928274/what-is-the-max-size-of-localstorage-values)
