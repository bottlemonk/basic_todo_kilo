---
name: todo-roadmap-orchestrator
description: Plan and execute a multi-feature todo roadmap with dependency-aware sequencing, phased delivery, and low-regression implementation slices. Use when working from a feature plan (for example plans/*.md), deciding implementation order, or implementing one roadmap item while preserving build stability.
---

# Todo Roadmap Orchestrator

Follow this workflow to ship roadmap items safely and predictably.

1. Read the roadmap file and extract:
- feature ID
- dependencies
- impacted files
- verification needs

2. Choose the smallest viable slice:
- implement only one feature ID at a time unless explicitly asked for a batch
- include required prerequisite wiring only if missing
- avoid speculative refactors outside the selected slice

3. Define acceptance checks before coding:
- functional behavior for the feature
- regression checks for adjacent behavior
- build/type checks to run after changes

4. Implement in file-local edits first:
- patch only files named in the roadmap item
- keep API shapes stable unless the item requires changes
- preserve existing interaction patterns and component contracts

5. Validate and report:
- run build/type checks
- note any toolchain issues separately from feature changes
- summarize files changed and the exact roadmap ID delivered

## Output Checklist

- confirm dependency assumptions
- confirm exact feature ID completed
- confirm verification command results
