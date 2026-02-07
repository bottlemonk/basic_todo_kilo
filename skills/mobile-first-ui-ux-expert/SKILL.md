---
name: mobile-first-ui-ux-expert
description: Design and implement mobile-first UI/UX for web apps with responsive layouts, touch-first interactions, accessibility, and performance-aware frontend decisions. Use when building new screens, redesigning components for phones first, fixing mobile usability issues, or reviewing UI behavior across breakpoints.
---

# Mobile First UI UX Expert

Follow this workflow when shipping mobile-first interfaces.

1. Start from the smallest viewport:
- define base styles for mobile first
- use progressive enhancement for larger breakpoints
- avoid desktop-first overrides that fight the cascade

2. Prioritize touch ergonomics:
- keep hit targets at least 44x44 px
- preserve spacing between interactive controls
- ensure drag, swipe, and scroll do not conflict

3. Build responsive structure intentionally:
- stack primary content by default
- promote to multi-column only when width allows
- avoid horizontal overflow at all breakpoints

4. Keep mobile interactions clear:
- use concise labels and visible action hierarchy
- support keyboard focus and screen-reader semantics
- provide safe affordances for destructive actions

5. Validate before completion:
- verify layouts at common widths (320, 375, 390, 768, 1024+)
- verify text scaling and safe wrapping
- verify touch interactions on real mobile behavior

## Deliverable Format

- state mobile-first decisions made
- list affected files/components
- summarize verified breakpoints and interaction checks

For practical checks and implementation prompts, read `references/mobile-first-checklist.md`.
