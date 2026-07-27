import type { Prisma } from "@prisma/client";

export const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const workspaceOwnerSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect;

export const workspaceSummarySelect = {
  id: true,
  name: true,
  ownerId: true,
} satisfies Prisma.WorkspaceSelect;

export const boardSummarySelect = {
  id: true,
  name: true,
  workspaceId: true,
} satisfies Prisma.BoardSelect;

export const taskCreatedAscOrder = {
  createdAt: "asc",
} satisfies Prisma.TaskOrderByWithRelationInput;

export const boardCreatedAscOrder = {
  createdAt: "asc",
} satisfies Prisma.BoardOrderByWithRelationInput;

export const workspaceInclude = {
  boards: {
    include: {
      tasks: {
        orderBy: taskCreatedAscOrder,
      },
    },
    orderBy: boardCreatedAscOrder,
  },
  members: {
    include: {
      user: {
        select: workspaceOwnerSelect,
      },
    },
  },
  owner: {
    select: workspaceOwnerSelect,
  },
} satisfies Prisma.WorkspaceInclude;

export const workspaceMemberInclude = {
  user: {
    select: workspaceOwnerSelect,
  },
} satisfies Prisma.WorkspaceMemberInclude;

export const boardInclude = {
  tasks: {
    orderBy: taskCreatedAscOrder,
  },
  workspace: {
    select: workspaceSummarySelect,
  },
} satisfies Prisma.BoardInclude;

export const taskInclude = {
  board: {
    select: boardSummarySelect,
  },
} satisfies Prisma.TaskInclude;
