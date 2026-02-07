---
name: todo-testing-and-quality-gates
description: Define and enforce reliable quality gates for the todo app, including test coverage targets and repeatable verification commands. Use when adding features, fixing regressions, or setting up testing infrastructure for safe delivery.
---

# Todo Testing And Quality Gates

Use this process to keep feature work shippable.

1. Pick verification scope by change type:
- UI-only small change: build + targeted interaction test
- state/data change: unit tests for hook/utilities + build
- infra/tooling change: full test run + build + lint/type

2. Prioritize tests for high-risk surfaces:
- `useTodos` mutation behavior
- storage parsing/validation fallback behavior
- drag/drop and editing interactions that can regress UX

3. Keep gates consistent:
- run `npm run build` as baseline compile/type gate
- run project test command when available
- report command failures separately from feature logic

4. Add tests with behavior focus:
- assert outcomes, not implementation details
- include edge cases for empty/invalid input
- keep fixtures minimal and deterministic

5. Return concise release signal:
- what changed
- what commands passed
- what remains unverified and why

## Minimum Gates

- feature implementation: `npm run build` passes
- if tests exist: relevant tests pass
- no obvious UX regression in touched interaction paths
