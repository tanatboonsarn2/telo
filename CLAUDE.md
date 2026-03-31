# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # TypeScript check + production build (tsc && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

No test runner is configured in this project.

## Environment Setup

Copy `.env.example` to `.env.local` and set:
```
GEMINI_API_KEY=your_key_here
```
Vite injects this at build time via the `define` config option in [vite.config.ts](vite.config.ts).

## Architecture

**TaskFlow** is a Google AI Studio-generated React SPA — a collaborative project management tool. There is no backend; all data is mock.

### State Management

Three React Context providers in [src/context/](src/context/):
- **AppContext** — projects, tasks, notifications with full CRUD operations
- **AuthContext** — authentication state persisted to localStorage (mock users from `src/data/mockData.ts`)
- **ThemeContext** — light/dark theme persisted to localStorage

All pages consume these contexts. No Redux or Zustand.

### Routing

Defined in [src/App.tsx](src/App.tsx) using React Router v7. A `ProtectedRoute` wrapper redirects unauthenticated users to `/login`. Public routes: `/`, `/login`, `/register`, `/reset-password`.

### Key Pages

| Page | Route | Notes |
|------|-------|-------|
| Landing | `/` | Public marketing page |
| Dashboard | `/dashboard` | Overview widgets, activity feed |
| Projects | `/projects` | Project list with create/edit modals |
| ProjectDetail | `/projects/:id` | Kanban board with drag-and-drop (`@hello-pangea/dnd`) |
| MyTasks | `/tasks` | Personal task list |
| Settings | `/settings` | User settings |

### Component Organization

- `src/components/ui/` — Generic primitives (Button, Input, Modal, Badge, Toast)
- `src/components/layout/` — AppLayout, Sidebar, TopNav, mobile menu
- `src/components/dashboard/` — Dashboard-specific widgets and modals
- `src/components/tasks/` — CreateTaskModal, TaskDetailModal

### Styling

Tailwind CSS v4 with custom CSS properties for theming in [src/index.css](src/index.css). Theme variables like `--primary`, `--surface`, `--background` switch between light/dark values. Use the `cn` utility from `src/utils/cn.ts` (clsx + tailwind-merge) for conditional class merging.

### Path Alias

`@` maps to `./src` (configured in both `tsconfig.json` and `vite.config.ts`).