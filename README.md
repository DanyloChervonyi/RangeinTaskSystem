# Rangein Task System

A task management project in pnpm monorepo format. The project includes a React client, a NestJS API Gateway, dedicated NestJS RabbitMQ microservices, PostgreSQL, Prisma, JWT authentication, Zod validation, and Redis caching.

## Implemented

- Authorization: `POST /api/auth/register`, `POST /api/auth/login`.
- Secure CRUD for workspaces, boards, and tasks.
- RabbitMQ-based backend command flow: REST controllers act as an API Gateway and send commands to dedicated NestJS microservices.
- Redis caching for workspace, board, and task read models with cache invalidation after mutations.
- Backend access check: the user only sees their own workspaces or those in which they are added as a member.
- Prisma models: `User`, `Workspace`, `WorkspaceMember`, `Board`, `Task`.
- The React client retrieves data via `axios` + React Query, not from mocks.
- Zustand is reserved only for the UI state: the selected workspace.

## Tech Stack

- Frontend: React, TypeScript, Vite, Zustand, React Query, Axios.
- Backend: NestJS API Gateway, NestJS Microservices, Prisma, PostgreSQL, RabbitMQ, Redis, Passport JWT, Zod.
- Infrastructure: pnpm workspaces, Docker Compose for PostgreSQL, Redis, and RabbitMQ.

## Structure

```text
apps/api/src
  common/
    guards/
  infrastructure/
    rabbitmq/
  modules/
    auth/
    users/
    workspaces/
    boards/
    tasks/

apps/auth-service/src
  modules/
    auth/

apps/users-service/src
  common/
    prisma/
  modules/
    users/
  prisma/

apps/workspace-service/src
  common/
    prisma/
  infrastructure/
    redis/
  modules/
    workspaces/
    boards/
    tasks/
  prisma/

apps/files-service/
  README.md

apps/notifications-service/
  README.md

clients/web/src
  api/
  app/
  components/
  features/
    workspaces/
  store/
  types/
  validation/

libs/common/src
  decorators/
  dto/
  pipes/
  rabbitmq/
  schemas/
  types/
```

The backend is split into four running processes:

- `apps/api` is the public HTTP API Gateway. It validates input, verifies JWTs, and sends RabbitMQ commands.
- `apps/auth-service` owns login/register orchestration and JWT creation.
- `apps/users-service` owns user persistence and user lookup logic.
- `apps/workspace-service` owns workspaces, boards, tasks, Prisma access checks, and Redis read caching.
- `libs/common` stores shared DTOs, schemas, decorators, RabbitMQ constants/options, and shared types.
- `apps/files-service` and `apps/notifications-service` are reserved service boundaries for future features.

The monorepo uses pnpm workspaces. Every runnable app has its own `package.json`,
`tsconfig`, lint config, and local `node_modules` layout, but dependencies are still
installed through the root workspace and pnpm store.

## Backend Architecture

The public HTTP API is intentionally unchanged for the frontend:

```text
React client
  -> REST endpoint /api/...
  -> apps/api HTTP controller
  -> RabbitMQ command
  -> apps/auth-service, apps/users-service, or apps/workspace-service @MessagePattern handler
  -> domain service
  -> Redis cache when applicable
  -> Prisma/PostgreSQL
```

The REST controllers work as a lightweight API Gateway. They validate HTTP input,
run HTTP/JWT guards, read the current JWT user, and send a RabbitMQ message using
`RabbitmqClientService`.

RabbitMQ queues are separated by service:

```text
rangein.auth       -> apps/auth-service
rangein.users      -> apps/users-service
rangein.workspace  -> apps/workspace-service
```

Message handlers are located next to their domain modules:

```text
apps/auth-service/src/modules/auth/auth.messages.ts
apps/users-service/src/modules/users/users.messages.ts
apps/workspace-service/src/modules/workspaces/workspaces.messages.ts
apps/workspace-service/src/modules/boards/boards.messages.ts
apps/workspace-service/src/modules/tasks/tasks.messages.ts
```

`auth-service` also uses RabbitMQ internally: registration and login call
`users-service` through the `rangein.users` queue instead of importing user logic
directly.

RabbitMQ message names and queue options are centralized in
`libs/common/src/rabbitmq` so producers and consumers use the same command names.

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

Create root `.env` from `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rangein_task_system?schema=public"
JWT_SECRET="change-me-before-development"
JWT_EXPIRES_IN="7d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
RABBITMQ_URL="amqp://rabbit:rabbit@localhost:5672"
RABBITMQ_AUTH_QUEUE="rangein.auth"
RABBITMQ_USERS_QUEUE="rangein.users"
RABBITMQ_WORKSPACE_QUEUE="rangein.workspace"
RABBITMQ_REQUEST_TIMEOUT_MS=5000
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_DB=0
```

For backward compatibility, backend services can still read `apps/api/.env`, but the
preferred setup is a single root `.env`.

Optionally create `clients/web/.env` if the API is running on a non-default path URL:

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

Start the backend services and client:

```bash
pnpm backend:dev
pnpm client:dev
```

Or run backend processes separately:

```bash
pnpm api:dev
pnpm auth:dev
pnpm users:dev
pnpm workspace:dev
```

The client will be on `http://localhost:5173`, the API on `http://localhost:3000/api`.
The API Gateway requires RabbitMQ plus auth, users, and workspace microservices to be running.

## Frontend Data Flow

Previously, `useWorkspaceStore` stored `workspacesMock`. The mocks have now been removed:

- `clients/web/src/api/apiClient.ts` creates a generic Axios client;
- `clients/web/src/api/workspacesApi.ts` contains HTTP functions;
- `clients/web/src/features/workspaces/useWorkspacesQuery.ts` contains React
  Query hooks for loading and mutations;
- `clients/web/src/store/useWorkspaceStore.ts` only stores
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

1. The backend is divided into an API Gateway and RabbitMQ microservices.
2. Gateway controllers receive HTTP requests, DTOs/Zods validate input data, and
   `JwtAuthGuard` protects private endpoints.
3. The gateway sends commands to RabbitMQ. Auth commands go to `rangein.auth`;
   user commands go to `rangein.users`; workspace/board/task commands go to
   `rangein.workspace`.
4. Microservice handlers call domain services. Services execute business logic,
   check workspace/board/task access, use Redis for read caching where useful,
   and access PostgreSQL through Prisma.
5. The frontend no longer creates ids via `createId` and doesn't read `workspacesMock`.
   Data comes from the backend, and after mutations, React Query invalidates the
   `workspaces` query and reloads the current state.
6. Zustand doesn't duplicate server data. It stores only the selected workspace,
   because this is UI state, not database state.

## Checks

```bash
pnpm client:build
pnpm backend:build
pnpm backend:lint
```

Limitation of the current version: Left/Right buttons only change the column order in
React Query cache. The database doesn't yet have a `position` field, so after a restart
the order will revert to `createdAt`.
