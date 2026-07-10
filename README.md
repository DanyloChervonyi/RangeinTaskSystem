# Rangein Task System

Training project organized as a pnpm monorepo.

## Apps

- `apps/client` - React, TypeScript, Vite frontend.
- `apps/api` - NestJS, PostgreSQL, Prisma backend.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
```

These root scripts run workspace packages through pnpm.

Client-only scripts:

```bash
pnpm client:dev
pnpm client:build
pnpm client:lint
pnpm client:preview
```

API scripts:

```bash
pnpm api:dev
pnpm api:build
pnpm api:lint
pnpm api:prisma:generate
pnpm api:prisma:migrate
pnpm api:prisma:studio
```

PostgreSQL for local development with Docker:

```bash
docker compose up -d postgres
```

Copy `apps/api/.env.example` to `apps/api/.env` before running Prisma commands
or the API locally. Then prepare the database:

```bash
pnpm --dir apps/api db:push
pnpm --dir apps/api db:seed
```

The first backend check endpoint is:

```bash
GET http://localhost:3000/api/workspaces
```

If Docker Desktop is not available, a PostgreSQL desktop UI is still not required.
Use any running PostgreSQL server and put its connection string into
`apps/api/.env` as `DATABASE_URL`. Good options are a locally installed
PostgreSQL service, Neon, Supabase, Railway, or another hosted PostgreSQL
database. Prisma Studio can be used as the database UI:

```bash
pnpm api:prisma:studio
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
