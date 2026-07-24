# Rangein Task System

A task management tutorial project in pnpm monorepo format. The project includes a React client and a NestJS API with PostgreSQL, Prisma, JWT authentication, Zod validation, RabbitMQ message transport, and Redis caching.

## Implemented

- Authorization: `POST /api/auth/register`, `POST /api/auth/login`.
- Secure CRUD for workspaces, boards, and tasks.
- RabbitMQ-based backend command flow: REST controllers act as an API gateway and send commands to NestJS microservice message handlers.
- Redis caching for workspace, board, and task read models with cache invalidation after mutations.
- Backend access check: the user only sees their own workspaces or those in which they are added as a member.
- Prisma models: `User`, `Workspace`, `WorkspaceMember`, `Board`, `Task`.
- The React client retrieves data via `axios` + React Query, not from mocks.
- Zustand is reserved only for the UI state: the selected workspace.

## Tech Stack

- Frontend: React, TypeScript, Vite, Zustand, React Query, Axios.
- Backend: NestJS, NestJS Microservices, Prisma, PostgreSQL, RabbitMQ, Redis, Passport JWT, Zod.
- Infrastructure: pnpm workspaces, Docker Compose for PostgreSQL, Redis, and RabbitMQ.

## Structure

```text
apps/api/src
  common/
    decorators/
    guards/
    pipes/
    prisma/
    schemas/
  infrastructure/
    rabbitmq/
    redis/
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
pipes, and Prisma helpers. `infrastructure/` stores RabbitMQ and Redis integration.
`prisma/` stores the Prisma connection to NestJS. DTOs are located within their modules
because the workspace, board, and task creation schemas relate to a specific business domain.

## Backend Architecture

The public HTTP API is intentionally unchanged for the frontend:

```text
React client
  -> REST endpoint /api/...
  -> NestJS HTTP controller
  -> RabbitMQ ClientProxy command
  -> @MessagePattern handler
  -> domain service
  -> Prisma/PostgreSQL
```

The REST controllers now work as a lightweight API gateway. They validate HTTP input,
run guards, read the current JWT user, and send a RabbitMQ message using
`RabbitmqClientService`.

Message handlers are located next to their domain modules:

```text
auth/auth.messages.ts
users/users.messages.ts
workspaces/workspaces.messages.ts
boards/boards.messages.ts
tasks/tasks.messages.ts
```

RabbitMQ message names are centralized in
`apps/api/src/infrastructure/rabbitmq/rabbitmq.constants.ts`.

Redis is used as a read cache for frequently requested entities:

- `workspaces:*`
- `boards:*`
- `tasks:*`

Mutations clear the affected read caches so the next request reloads fresh data from
PostgreSQL.

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
RABBITMQ_URL="amqp://rabbit:rabbit@localhost:5672"
RABBITMQ_QUEUE="rangein.task-system"
RABBITMQ_REQUEST_TIMEOUT_MS=5000
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_DB=0
```

Optionally create `apps/client/.env` if the API is running on a non-default path URL:

```env
VITE_API_URL="http://localhost:3000/api"
VITE_DEMO_EMAIL="demo@example.com"
VITE_DEMO_PASSWORD="password123"
```

Start PostgreSQL, Redis, and RabbitMQ:

```bash
docker compose up -d postgres redis rabbitmq
```

RabbitMQ Management UI is available at `http://localhost:15672`.

Default RabbitMQ credentials:

```text
login: rabbit
password: rabbit
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
The API requires RabbitMQ to be running because the HTTP controllers call the backend
message handlers through RabbitMQ.

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
2. Controllers receive HTTP requests, DTOs/Zods validate input data, and guards check access.
   Then controllers send RabbitMQ commands to module message handlers.
3. `JwtAuthGuard` protects private endpoints, and `WorkspaceAccessService`
   checks permissions at the workspace level. Board endpoints attach dedicated
   guards so access checks stay outside `BoardsService`.
4. Message handlers call domain services. Services execute business logic, use Redis for
   read caching where useful, and access PostgreSQL through Prisma.
5. The frontend no longer creates ids via `createId` and doesn't read `workspacesMock`.
   Data comes from the backend, and after mutations, React Query invalidates the
   `workspaces` query and reloads the current state.
6. Zustand doesn't duplicate server data. It stores only the selected workspace,
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
