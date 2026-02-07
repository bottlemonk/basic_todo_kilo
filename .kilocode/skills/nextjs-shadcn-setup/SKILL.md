---
name: nextjs-shadcn-setup
description: Initialize a Next.js 14+ project with TypeScript, Tailwind CSS, and Shadcn UI components pre-configured. This skill should be used when starting a new Next.js project that needs Shadcn UI components, creating a project with modern React UI patterns, or setting up a project with TypeScript and Tailwind CSS.
license: Complete terms in LICENSE.txt
metadata:
  category: development
  source:
    repository: https://github.com/ComposioHQ/awesome-claude-skills
    path: nextjs-shadcn-setup
---

# Next.js + Shadcn UI Setup

This skill automates the setup of a Next.js 16 project with TypeScript, Tailwind CSS, and Shadcn UI. It handles all the initial configuration, dependency installation, and component initialization so developers can start building features immediately.

## Purpose

Quickly scaffold a new Next.js project with Shadcn UI components pre-configured, eliminating the need for manual setup steps.

## When to Use

- Starting a new Next.js project that needs Shadcn UI components
- Creating a project with modern React UI patterns
- Setting up a project with TypeScript and Tailwind CSS
- Initializing a project with accessible, customizable UI components

## Setup Process

### Step 1: Initialize Next.js Project

Create a new Next.js project with TypeScript and Tailwind CSS:

```bash
npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Accept all defaults or customize as needed:
- Project name: (defaults to current directory)
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- Src Directory: Yes
- Import Alias: @/*

### Step 2: Install Additional Dependencies

Install utility libraries for class name management and icons:

```bash
npm install clsx tailwind-merge lucide-react
```

### Step 3: Initialize Shadcn UI

Initialize Shadcn UI in the project:

```bash
npx shadcn-ui@latest init
```

When prompted, use the following configuration:
- Style: Default
- Base color: Slate
- CSS variables: Yes

### Step 4: Add Common Shadcn UI Components

Add the most commonly used components for a typical project:

```bash
npx shadcn-ui@latest add button input select checkbox collapsible card
```

Additional components can be added as needed:
```bash
npx shadcn-ui@latest add dialog dropdown-menu label scroll-area separator switch tabs toast
```

### Step 5: Create Project Structure

Create the following directory structure:

```bash
mkdir -p components/ui
mkdir -p hooks
mkdir -p lib
```

### Step 6: Create Utility Functions

Create `lib/utils.ts` for class name utilities:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Step 7: Configure Tailwind CSS (if needed)

Update `tailwind.config.ts` to include custom theme colors or utilities if required:

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

### Step 8: Update Global CSS

Ensure `app/globals.css` contains the Shadcn UI CSS variables:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Step 9: Verify Setup

Start the development server to verify everything works:

```bash
npm run dev
```

Open `http://localhost:3000` in a browser to confirm the Next.js app is running.

## Files Created

After completing the setup process, the following files and directories will be created:

- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - Shadcn UI configuration
- `components/ui/` - Shadcn UI components (Button, Input, Select, etc.)
- `lib/utils.ts` - Utility functions (cn helper)
- `app/layout.tsx` - Root layout with providers
- `app/page.tsx` - Home page
- `app/globals.css` - Global styles with CSS variables

## Dependencies Added

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-select": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

## Usage Example

After setup, use Shadcn UI components like this:

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      <Input placeholder="Enter text..." />
      <Button className="mt-4">Click me</Button>
    </div>
  )
}
```

## Success Criteria

- Next.js project runs successfully with `npm run dev`
- Shadcn UI components are importable and functional
- Tailwind CSS is working (classes apply correctly)
- TypeScript has no errors
- Development server starts without errors

## Common Issues and Solutions

### Issue: Shadcn UI components not found

**Solution:** Ensure `components.json` exists and components are in `components/ui/` directory. Re-run `npx shadcn-ui@latest init` if needed.

### Issue: Tailwind classes not applying

**Solution:** Check that `tailwind.config.ts` includes all content paths and `globals.css` is imported in `layout.tsx`.

### Issue: TypeScript errors with Shadcn components

**Solution:** Ensure `@types/react` and `@types/react-dom` are installed and `tsconfig.json` includes proper path aliases.

## Next Steps

After completing the setup:
1. Add additional Shadcn UI components as needed
2. Create custom components in `components/` directory
3. Set up state management (hooks, Zustand, Redux, etc.)
4. Configure routing and layouts
5. Add testing setup (Jest, Vitest, Playwright, etc.)
