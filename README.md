# Rangein Task System

Rangein Task System is a training task-management application built as a pnpm
monorepo. The frontend is a React/Vite app, and the backend is a NestJS API with
PostgreSQL, Prisma, Passport JWT auth, and Zod request validation.

The current backend domain contains users, workspaces, workspace members, boards,
and tasks. Workspaces have owners and members, and protected endpoints enforce
JWT authentication plus workspace access checks on the backend.

## Apps

- `apps/client` - React, TypeScript, Vite frontend.
- `apps/api` - NestJS, PostgreSQL, Prisma backend.

## Requirements

- Node.js
- pnpm
- Docker Desktop or another running PostgreSQL server

## Environment

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rangein_task_system?schema=public"
JWT_SECRET="change-me-before-development"
JWT_EXPIRES_IN="7d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

Start PostgreSQL with Docker:

```bash
docker compose up -d postgres
```

Prepare Prisma:

```bash
pnpm --dir apps/api prisma:generate
pnpm --dir apps/api db:push
pnpm --dir apps/api db:seed
```

If Docker Desktop is not available, run any PostgreSQL server and update
`DATABASE_URL`.

## Scripts

Root scripts:

```bash
pnpm dev
pnpm build
pnpm lint
```

Client scripts:

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
pnpm --dir apps/api db:push
pnpm --dir apps/api db:seed
```

## API

Base URL:

```text
http://localhost:3000/api
```

All endpoints except `/auth/register` and `/auth/login` require:

```http
Authorization: Bearer <accessToken>
```

Access rules:

- workspace owners can read and mutate workspace data;
- workspace owners can add members;
- workspace members can read workspace, board, and task data;
- users without workspace access receive `403 Forbidden`;
- missing resources still return `404 Not Found`;
- client-provided ownership is ignored.

Auth:

```http
POST /auth/register
POST /auth/login
```

Register body:

```json
{
  "email": "demo@example.com",
  "name": "Demo User",
  "password": "password123"
}
```

Login body:

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

Auth response:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "demo@example.com",
    "name": "Demo User"
  }
}
```

Users:

```http
GET /users
GET /users/:id
```

Requires JWT.

Workspaces:

```http
GET /workspaces
GET /workspaces/:id
POST /workspaces
PATCH /workspaces/:id
DELETE /workspaces/:id
GET /workspaces/:id/members
POST /workspaces/:id/members
```

Requires JWT. `GET /workspaces` returns only workspaces owned by the current user
or workspaces where the current user is a member.

Create workspace body:

```json
{
  "name": "Work"
}
```

The owner is always taken from the JWT user id.

Update workspace body:

```json
{
  "name": "Updated workspace"
}
```

Only the workspace owner can update or delete a workspace.

Add workspace member body:

```json
{
  "email": "member@example.com"
}
```

or:

```json
{
  "userId": "user-uuid"
}
```

Only the workspace owner can add members. The API stores this in the
`WorkspaceMember` join table.

Boards:

```http
GET /boards
GET /boards?workspaceId=:workspaceId
GET /boards/:id
POST /boards
PATCH /boards/:id
DELETE /boards/:id
```

Requires JWT. Read endpoints return only boards from accessible workspaces.
Create/update/delete require workspace owner access.

Create board body:

```json
{
  "name": "Development",
  "workspaceId": "workspace-uuid"
}
```

Update board body:

```json
{
  "name": "Updated board"
}
```

Tasks:

```http
GET /tasks
GET /tasks?boardId=:boardId
GET /tasks/:id
POST /tasks
PATCH /tasks/:id
DELETE /tasks/:id
```

Requires JWT. Read endpoints return only tasks from accessible workspaces.
Create/update/delete require owner access to the task's workspace.

Create task body:

```json
{
  "title": "Setup project",
  "boardId": "board-uuid"
}
```

Update task body:

```json
{
  "title": "Updated task"
}
```

## Validation And Checks

Incoming request bodies, route params, and supported query ids are validated with
Zod schemas. Invalid values return `400 Bad Request` with a structured validation
error.

Useful checks:

```bash
pnpm --dir apps/api prisma:generate
pnpm --dir apps/api build
pnpm --dir apps/api lint
pnpm --dir apps/api db:push
```

Manual API checks:

```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"demo@example.com\",\"name\":\"Demo User\",\"password\":\"password123\"}"

curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"demo@example.com\",\"password\":\"password123\"}"

curl http://localhost:3000/api/workspaces ^
  -H "Authorization: Bearer <accessToken>"

curl -X POST http://localhost:3000/api/workspaces ^
  -H "Authorization: Bearer <accessToken>" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Work\"}"
```

Security status:

- JWT issuing is implemented with Passport/JWT.
- CRUD controllers are protected by `JwtAuthGuard`.
- Passwords are stored as hashes.
- DTO validation is implemented for auth, CRUD bodies, route params, and query ids.
- Backend services enforce workspace access before returning data.
- Workspace, board, and task mutations require workspace owner access.
- Owners can add existing users to a workspace through `WorkspaceMember`.

## Project Structure

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
  app/
  components/
  features/
  mocks/
  store/
  types/
  utils/
  validation/
```
