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

export interface WorkspaceStore {
  workspaces: Workspace[];
  selectedWorkspaceId?: Workspace["id"];
  addBoard: (workspaceId: Workspace["id"], input: BoardInput) => Board["id"];
  addTask: (
    workspaceId: Workspace["id"],
    boardId: Board["id"],
    input: TaskInput,
  ) => Task["id"];
  addWorkspace: (input: WorkspaceInput) => Workspace["id"];
  deleteBoard: (workspaceId: Workspace["id"], boardId: Board["id"]) => void;
  deleteWorkspace: (workspaceId: Workspace["id"]) => void;
  reorderBoard: (
    workspaceId: Workspace["id"],
    boardId: Board["id"],
    direction: -1 | 1,
  ) => void;
  selectWorkspace: (workspaceId?: Workspace["id"]) => void;
  updateBoard: (
    workspaceId: Workspace["id"],
    boardId: Board["id"],
    input: BoardInput,
  ) => void;
  updateWorkspace: (
    workspaceId: Workspace["id"],
    input: WorkspaceInput,
  ) => void;
}
