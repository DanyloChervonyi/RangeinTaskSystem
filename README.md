# Rangein Task System

Frontend training project built with React, TypeScript, and Vite.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
```

## Current Scope

Task 1 starts with read-only rendering from mock data:

- workspaces
- boards / columns
- tasks
- optional workspace switching

Keep the first implementation small and avoid adding extra technologies before
approval.

## Project Structure

- `src/app` - root app component and future app-level providers.
- `src/features/workspaces` - workspace feature components.
- `src/mocks` - temporary mock data for frontend-only tasks.
- `src/types` - shared TypeScript domain types.
- `src/pages` - route/page-level components if pages become necessary later.
- `src/hooks` - reusable hooks only when duplication appears.
- `src/utils` - small pure helpers only when they are used by more than one place.
- `src/styles` - shared style files if global styling grows.
