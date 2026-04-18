# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev       # Start development server
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

No test runner is configured yet.

## Architecture

This is a Next.js 16 project using the **App Router** with React 19 and TypeScript.

- `app/` — All routes and layouts. Server Components by default; add `"use client"` only when needed.
- `app/layout.tsx` — Root layout with metadata, fonts (Geist/Geist Mono via `next/font`), and global CSS.
- `app/page.tsx` — Home route (`/`).
- `app/globals.css` — Global styles including Tailwind CSS v4 directives.

**Key conventions:**
- Tailwind CSS v4 — uses `@tailwindcss/postcss` plugin; no `tailwind.config.*` file (config lives in CSS).
- ESLint v9 flat config (`eslint.config.mjs`).
- Path alias `@/` maps to the project root.
- Package manager: **pnpm**.

> **Important:** Next.js 16 has breaking changes from prior versions. Before writing any code, consult `node_modules/next/dist/docs/` for current APIs and conventions.
