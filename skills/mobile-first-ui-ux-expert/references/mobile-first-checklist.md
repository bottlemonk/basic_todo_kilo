# Mobile-First UI/UX Checklist

## Core Rules
- Build default styles for mobile; add `sm`, `md`, `lg` only for enhancements.
- Keep tap targets >= 44px and spacing between adjacent actions >= 8px.
- Prevent accidental horizontal scroll (`overflow-x-hidden` only when necessary and safe).
- Ensure text remains readable at 320px width without truncating critical labels.

## Layout Prompts
- Ask: what is the single primary action on mobile for this screen?
- Collapse secondary controls behind progressive disclosure (drawer, accordion, details).
- Prefer one-column flow first; move metadata below primary content on mobile.

## Interaction Prompts
- Ask: does drag conflict with vertical scrolling?
- Ask: can destructive actions be reversed or confirmed?
- Use clear pressed/active states and visible focus states.

## Accessibility Baseline
- Preserve semantic headings and landmark structure.
- Add `aria-label` for icon-only buttons.
- Verify keyboard reachability for all controls.
- Ensure status updates and dynamic content are announced when needed.

## Performance Baseline
- Avoid large visual effects on low-end mobile devices.
- Keep animation durations short (150-250ms) for utility interactions.
- Avoid layout thrash from repeated measurement and sync DOM writes.

## Breakpoint Validation
- Validate: 320x568, 375x667, 390x844, 768x1024, 1280x800.
- Validate both portrait and landscape for interaction-heavy screens.
- Validate with browser zoom / larger text settings.
