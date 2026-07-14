export interface Task {
  boardId?: string;
  id: string;
  title: string;
}
export interface Board {
  id: string;
  name: string;
  tasks: Task[];
  workspaceId?: string;
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
export interface BoardInput {
  name: string;
  workspaceId: Workspace["id"];
}
export interface TaskInput {
  boardId: Board["id"];
  title: string;
}

export interface WorkspaceStore {
  selectedWorkspaceId?: Workspace["id"];
  selectWorkspace: (workspaceId?: Workspace["id"]) => void;
}
