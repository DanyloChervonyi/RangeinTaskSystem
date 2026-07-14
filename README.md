# Rangein Task System

Учебный task-management проект в формате pnpm monorepo. В проекте есть React
клиент и NestJS API с PostgreSQL, Prisma, JWT-авторизацией и Zod-валидацией.

## Что Уже Реализовано

- Авторизация: `POST /api/auth/register`, `POST /api/auth/login`.
- Защищенный CRUD для workspaces, boards и tasks.
- Проверка доступа на backend: пользователь видит только свои workspace или те,
  куда он добавлен участником.
- Prisma-модели: `User`, `Workspace`, `WorkspaceMember`, `Board`, `Task`.
- React клиент получает данные через `axios` + React Query, а не из моков.
- Zustand оставлен только для UI-состояния: выбранный workspace.

## Стек

- Frontend: React, TypeScript, Vite, Zustand, React Query, axios.
- Backend: NestJS, Prisma, PostgreSQL, Passport JWT, Zod.
- Инфраструктура: pnpm workspaces, Docker Compose для PostgreSQL.

## Структура

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
  utils/
  validation/
```

Backend разложен по доменным модулям. `common/` хранит общие guards, decorators,
pipes и Prisma helpers. `prisma/` хранит подключение Prisma к NestJS. DTO лежат
внутри своих модулей, потому что схемы создания workspace, board и task относятся
к конкретной бизнес-области.

## Запуск

Установить зависимости:

```bash
pnpm install
```

Создать `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rangein_task_system?schema=public"
JWT_SECRET="change-me-before-development"
JWT_EXPIRES_IN="7d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

Опционально создать `apps/client/.env`, если API запущен не на стандартном URL:

```env
VITE_API_URL="http://localhost:3000/api"
VITE_DEMO_EMAIL="demo@example.com"
VITE_DEMO_PASSWORD="password123"
```

Поднять PostgreSQL:

```bash
docker compose up -d postgres
```

Подготовить базу:

```bash
pnpm --dir apps/api prisma:generate
pnpm --dir apps/api db:push
pnpm --dir apps/api db:seed
```

Запустить API и клиент:

```bash
pnpm api:dev
pnpm client:dev
```

Клиент будет на `http://localhost:5173`, API на `http://localhost:3000/api`.

## Frontend Data Flow

Раньше `useWorkspaceStore` хранил `workspacesMock`. Сейчас моки удалены:

- `apps/client/src/api/apiClient.ts` создает общий axios client;
- `apps/client/src/api/workspacesApi.ts` содержит HTTP-функции;
- `apps/client/src/features/workspaces/useWorkspacesQuery.ts` содержит React
  Query hooks для загрузки и mutations;
- `apps/client/src/store/useWorkspaceStore.ts` хранит только
  `selectedWorkspaceId`.

Для удобства демо клиент автоматически логинится под seed-пользователем
`demo@example.com / password123` и кладет JWT в `localStorage`. Поэтому перед
демонстрацией важно выполнить `db:seed`.

Подключенные операции:

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

Для соответствия формулировке задания также доступны singular aliases:

```http
POST /api/workspace
DELETE /api/board/:id
```

Основной стиль API остается plural REST: `/workspaces`, `/boards`, `/tasks`.

## API

Все endpoints, кроме auth, требуют:

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

## Что Объяснять Ментору

1. Backend разделен по модулям: auth отвечает за JWT, users за пользователей,
   workspaces за рабочие пространства и участников, boards/tasks за сущности
   доски.
2. Контроллеры принимают HTTP-запросы, DTO/Zod валидируют входные данные,
   сервисы выполняют бизнес-логику и обращаются к Prisma.
3. `JwtAuthGuard` защищает приватные endpoints, а `WorkspaceAccessService`
   проверяет права на уровне workspace.
4. Frontend больше не создает id через `createId` и не читает `workspacesMock`.
   Данные приходят из backend, а после mutations React Query инвалидирует
   `workspaces` query и перезагружает актуальное состояние.
5. Zustand не дублирует серверные данные. Он хранит только выбранный workspace,
   потому что это UI-состояние, а не состояние базы.

## Проверки

```bash
pnpm client:build
pnpm api:build
pnpm lint
```

Ограничение текущей версии: кнопки Left/Right меняют порядок колонок только в
React Query cache. В базе пока нет поля `position`, поэтому после перезагрузки
порядок вернется к `createdAt`.
