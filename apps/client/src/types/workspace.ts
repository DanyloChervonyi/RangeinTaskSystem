export interface Task {
  id: string;
  title: string;
}
export interface Board {
  id: string;
  name: string;
  tasks: Task[];
}
export interface Workspace {
  id: string;
  name: string;
  boards: Board[];
}
export interface WorkspacesMock {
  workspaces: Workspace[];
}
export type WorkspaceInput = Pick<Workspace, "name">;
export type BoardInput = Pick<Board, "name">;
export type TaskInput = Pick<Task, "title">;
