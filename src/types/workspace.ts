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
