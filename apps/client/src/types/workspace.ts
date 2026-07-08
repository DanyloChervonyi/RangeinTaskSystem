import { type ComponentProps } from "react";

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
export type CreateWorkspaceInput = Pick<Workspace, "name">;
export type CreateBoardInput = Pick<Board, "name">;
export type CreateTaskInput = Pick<Task, "title">;
export type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;
