# Rangein Task System

A task management tutorial project in pnpm monorepo format. The project includes a React client and a NestJS API with PostgreSQL, Prisma, JWT authentication, and Zod validation.

## Implemented

- Authorization: `POST /api/auth/register`, `POST /api/auth/login`.
- Secure CRUD for workspaces, boards, and tasks.
- Backend access check: the user only sees their own workspaces or those in which they are added as a member.
- Prisma models: `User`, `Workspace`, `WorkspaceMember`, `Board`, `Task`.
- The React client retrieves data via `axios` + React Query, not from mocks.
- Zustand is reserved only for the UI state: the selected workspace.

## Tech Stack

- Frontend: React, TypeScript, Vite, Zustand, React Query, Axios.
- Backend: NestJS, Prisma, PostgreSQL, Passport JWT, Zod.
- Infrastructure: pnpm workspaces, Docker Compose for PostgreSQL.

## Structure

```text
apps/api/src
  common/
    decorators/
    guards/
    pipes/
    prisma/
    schemas/
  modules/
    auth/
      dto/
      types/
    users/
      types/
    workspaces/
      dto/
    boards/
      dto/
    tasks/
      dto/
  prisma/

apps/client/src
  api/
  app/
  components/
  features/
    workspaces/
  store/
  types/
  validation/
```

The backend is split into domain modules. `common/` stores shared guards, decorators,
pipes, and Prisma helpers. `prisma/` stores the Prisma connection to NestJS. DTOs are located
within their modules because the workspace, board, and task creation schemas relate
to a specific business domain.

## Launch

Install dependencies:

```bash
pnpm install
```

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rangein_task_system?schema=public"
JWT_SECRET="change-me-before-development"
JWT_EXPIRES_IN="7d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

Optionally create `apps/client/.env` if the API is running on a non-default path URL:

```env
VITE_API_URL="http://localhost:3000/api"
VITE_DEMO_EMAIL="demo@example.com"
VITE_DEMO_PASSWORD="password123"
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Prepare the database:

```bash
pnpm --dir apps/api prisma:generate
pnpm --dir apps/api db:push
pnpm --dir apps/api db:seed
```

Start the API and client:

```bash
pnpm api:dev
pnpm client:dev
```

The client will be on `http://localhost:5173`, the API on `http://localhost:3000/api`.

## Frontend Data Flow

Previously, `useWorkspaceStore` stored `workspacesMock`. The mocks have now been removed:

- `apps/client/src/api/apiClient.ts` creates a generic Axios client;
- `apps/client/src/api/workspacesApi.ts` contains HTTP functions;
- `apps/client/src/features/workspaces/useWorkspacesQuery.ts` contains React
  Query hooks for loading and mutations;
- `apps/client/src/store/useWorkspaceStore.ts` only stores
  `selectedWorkspaceId`.
- Workspace task totals come from the API as `tasksCount`; the client only
  displays the value and does not recalculate it from nested boards.

For demo convenience, the client automatically logs in with the seed user
`demo@example.com/password123` and stores the JWT in `localStorage`. Therefore, it is important to run `db:seed` before
demonstrating.

Connected operations:

```http
GET /api/workspaces
POST /api/workspaces
PATCH /api/workspaces/:id
DELETE /api/workspaces/:id
POST /api/boards
PATCH /api/boards/:id
DELETE /api/boards/:id
POST /api/tasks
```

Singular aliases are also available to match the task definition:

```http
POST /api/workspace
DELETE /api/board/:id
```

The basic API style remains plural REST: `/workspaces`, `/boards`, `/tasks`.

## API

All endpoints except auth require:

```http
Authorization: Bearer <accessToken>
```

Auth:

```http
POST /api/auth/register
POST /api/auth/login
```

Workspaces:

```http
GET /api/workspaces
GET /api/workspaces/:id
POST /api/workspaces
PATCH /api/workspaces/:id
DELETE /api/workspaces/:id
GET /api/workspaces/:id/members
POST /api/workspaces/:id/members
```

Boards:

```http
GET /api/boards
GET /api/boards?workspaceId=:workspaceId
GET /api/boards/:id
POST /api/boards
PATCH /api/boards/:id
DELETE /api/boards/:id
```

Tasks:

```http
GET /api/tasks
GET /api/tasks?boardId=:boardId
GET /api/tasks/:id
POST /api/tasks
PATCH /api/tasks/:id
DELETE /api/tasks/:id
```

## Additionally

1. The backend is divided into modules: auth is responsible for JWTs, users for users,
   workspaces for workspaces and members, and boards/tasks for board entities.
2. Controllers receive HTTP requests, DTOs/Zods validate input data,
   services execute business logic and access Prisma.
3. `JwtAuthGuard` protects private endpoints, and `WorkspaceAccessService`
   checks permissions at the workspace level. Board endpoints attach dedicated
   guards so access checks stay outside `BoardsService`.
4. The frontend no longer creates ids via `createId` and doesn't read `workspacesMock`.
   Data comes from the backend, and after mutations, React Query invalidates the
   `workspaces` query and reloads the current state.
5. Zustand doesn't duplicate server data. It stores only the selected workspace,
   because this is UI state, not database state.

## Checks

```bash
pnpm client:build
pnpm api:build
pnpm lint
```

Limitation of the current version: Left/Right buttons only change the column order in
React Query cache. The database doesn't yet have a `position` field, so after a restart
the order will revert to `createdAt`.
