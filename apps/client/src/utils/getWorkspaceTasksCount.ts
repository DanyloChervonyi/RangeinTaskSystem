import type { Workspace } from "../types/workspace";

export function getWorkspaceTasksCount(workspace: Workspace): number {
  return workspace.boards.reduce(
    (tasksCount, board) => tasksCount + board.tasks.length,
    0,
  );
}
export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
