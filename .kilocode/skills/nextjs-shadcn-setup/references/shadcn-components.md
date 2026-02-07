# Shadcn UI Components Reference

This document provides a quick reference for commonly used Shadcn UI components.

## Available Components

### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Input
```tsx
import { Input } from "@/components/ui/input"

<Input type="text" placeholder="Enter text..." />
```

### Select
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox
```tsx
import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="terms" />
<label htmlFor="terms">Accept terms and conditions</label>
```

### Collapsible
```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

<Collapsible>
  <CollapsibleTrigger>Click to expand</CollapsibleTrigger>
  <CollapsibleContent>
    <p>This content is collapsible</p>
  </CollapsibleContent>
</Collapsible>
```

### Card
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Label
```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

### Tabs
```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Content for tab 1</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Content for tab 2</p>
  </TabsContent>
</Tabs>
```

### Switch
```tsx
import { Switch } from "@/components/ui/switch"

<Switch id="notifications" />
<Label htmlFor="notifications">Enable notifications</Label>
```

## Adding More Components

To add more Shadcn UI components:

```bash
npx shadcn-ui@latest add [component-name]
```

Available components include:
- accordion
- alert
- alert-dialog
- avatar
- badge
- breadcrumb
- calendar
- carousel
- chart
- checkbox
- collapsible
- command
- context-menu
- data-table
- date-picker
- dialog
- dropdown-menu
- form
- hover-card
- input
- input-otp
- label
- menubar
- navigation-menu
- pagination
- popover
- progress
- radio-group
- resizable
- scroll-area
- select
- separator
- sheet
- skeleton
- slider
- sonner
- switch
- table
- tabs
- textarea
- toast
- toggle
- toggle-group
- tooltip

## Customizing Components

Shadcn UI components are fully customizable. Components are copied to your project, so you can modify them directly in `components/ui/`.

### Example: Custom Button Variant

```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        // Add custom variant
        custom: "bg-purple-500 text-white hover:bg-purple-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Utility Functions

### cn() Helper

The `cn()` function combines `clsx` and `tailwind-merge` for conditional class names:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class",
  isActive && "active-class",
  "another-class"
)} />
```

## Dark Mode

Shadcn UI supports dark mode out of the box. Toggle dark mode using:

```tsx
"use client"

import { useEffect } from "react"

export function ThemeToggle() {
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark"
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }

  return (
    <button onClick={toggleTheme}>
      Toggle Theme
    </button>
  )
}
```

## Resources

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
