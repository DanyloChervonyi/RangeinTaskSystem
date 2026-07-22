import { apiClient } from "./apiClient";
import type {
  Board,
  BoardInput,
  Task,
  TaskInput,
  Workspace,
  WorkspaceInput,
} from "../types/workspace";

const API_ENDPOINTS = {
  BOARDS: "/boards",
  TASKS: "/tasks",
  WORKSPACES: "/workspaces",
} as const;

export async function getWorkspaces() {
  const { data } = await apiClient.get<Workspace[]>(API_ENDPOINTS.WORKSPACES);
  return data;
}
export async function createWorkspace(input: WorkspaceInput) {
  const { data } = await apiClient.post<Workspace>(
    API_ENDPOINTS.WORKSPACES,
    input,
  );
  return data;
}
export async function updateWorkspace(
  id: Workspace["id"],
  input: WorkspaceInput,
) {
  const { data } = await apiClient.patch<Workspace>(
    `${API_ENDPOINTS.WORKSPACES}/${id}`,
    input,
  );
  return data;
}
export async function deleteWorkspace(id: Workspace["id"]) {
  const { data } = await apiClient.delete<Workspace>(
    `${API_ENDPOINTS.WORKSPACES}/${id}`,
  );
  return data;
}
export async function createBoard(input: BoardInput) {
  const { data } = await apiClient.post<Board>(API_ENDPOINTS.BOARDS, input);
  return data;
}
export async function updateBoard(
  id: Board["id"],
  input: Pick<BoardInput, "name">,
) {
  const { data } = await apiClient.patch<Board>(
    `${API_ENDPOINTS.BOARDS}/${id}`,
    input,
  );
  return data;
}
export async function deleteBoard(id: Board["id"]) {
  const { data } = await apiClient.delete<Board>(
    `${API_ENDPOINTS.BOARDS}/${id}`,
  );
  return data;
}
export async function createTask(input: TaskInput) {
  const { data } = await apiClient.post<Task>(API_ENDPOINTS.TASKS, input);
  return data;
}
