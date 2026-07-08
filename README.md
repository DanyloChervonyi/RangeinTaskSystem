# Rangein Task System

Training project organized as a pnpm monorepo.

## Apps

- `apps/client` - React, TypeScript, Vite frontend.
- `apps/api` - placeholder for the future NestJS, PostgreSQL, Prisma backend.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
```

These root scripts currently proxy to `apps/client`.

Client-only scripts:

```bash
pnpm client:dev
pnpm client:build
pnpm client:lint
pnpm client:preview
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

- `apps/client/src/app` - root frontend app component and future app-level providers.
- `apps/client/src/features/workspaces` - workspace feature components.
- `apps/client/src/mocks` - temporary mock data for frontend-only tasks.
- `apps/client/src/types` - shared frontend TypeScript domain types.
- `apps/api/src/modules` - future backend modules: auth, users, workspaces, boards, tasks.
- `apps/api/prisma` - future Prisma schema and migrations.
