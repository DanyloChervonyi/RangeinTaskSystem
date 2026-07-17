import { apiClient } from "./apiClient";
import type {
  Board,
  BoardInput,
  Task,
  TaskInput,
  Workspace,
  WorkspaceInput,
} from "../types/workspace";

export async function getWorkspaces() {
  const { data } = await apiClient.get<Workspace[]>("/workspaces");
  return data;
}

export async function createWorkspace(input: WorkspaceInput) {
  const { data } = await apiClient.post<Workspace>("/workspaces", input);
  return data;
}

export async function updateWorkspace(id: Workspace["id"], input: WorkspaceInput) {
  const { data } = await apiClient.patch<Workspace>(`/workspaces/${id}`, input);
  return data;
}

export async function deleteWorkspace(id: Workspace["id"]) {
  const { data } = await apiClient.delete<Workspace>(`/workspaces/${id}`);
  return data;
}

export async function createBoard(input: BoardInput) {
  const { data } = await apiClient.post<Board>("/boards", input);
  return data;
}

export async function updateBoard(id: Board["id"], input: Pick<BoardInput, "name">) {
  const { data } = await apiClient.patch<Board>(`/boards/${id}`, input);
  return data;
}

export async function deleteBoard(id: Board["id"]) {
  const { data } = await apiClient.delete<Board>(`/boards/${id}`);
  return data;
}

export async function createTask(input: TaskInput) {
  const { data } = await apiClient.post<Task>("/tasks", input);
  return data;
}
