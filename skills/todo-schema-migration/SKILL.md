---
name: todo-schema-migration
description: Evolve Todo data models stored in localStorage using explicit schema versions and deterministic migrations. Use when changing Todo fields, altering persisted structure, or adding backward-compatible loading for older saved data.
---

# Todo Schema Migration

Apply this workflow for safe data-shape changes.

1. Define schema target:
- update TypeScript types in `src/lib/types.ts`
- update Zod validation in `src/hooks/use-todos.ts`

2. Version storage envelope:
- store `{ version, todos }` instead of raw `Todo[]`
- keep a single constant for `CURRENT_VERSION`

3. Add migrations:
- create version-to-version functions in `src/lib/migrations.ts`
- make each migration pure and idempotent for its input version
- chain migrations until `CURRENT_VERSION`

4. Load path requirements:
- parse stored envelope safely
- migrate before strict validation
- fallback to empty state on unrecoverable payloads

5. Save path requirements:
- always write latest version envelope
- avoid mutating migration inputs
- keep migration logic independent from UI components

## Validation Checklist

- verify old payloads migrate successfully
- verify new writes use latest version
- run build/type checks after migration changes
