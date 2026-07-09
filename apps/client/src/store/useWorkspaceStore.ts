import { useState } from "react";
import { workspacesMock } from "../mocks/workspaces";
import type {
  Board,
  Task,
  Workspace,
  WorkspaceInput,
  BoardInput,
  TaskInput,
} from "../types/workspace";
import { createId } from "../utils/createId";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() =>
    structuredClone(workspacesMock.workspaces),
  );

  function addWorkspace({ name }: WorkspaceInput) {
    const workspace: Workspace = {
      id: createId("workspace"),
      name,
      boards: [],
    };
    setWorkspaces((currentWorkspaces) => [...currentWorkspaces, workspace]);
    return workspace.id;
  }
  function addBoard(workspaceId: Workspace["id"], { name }: BoardInput) {
    const board: Board = {
      id: createId("board"),
      name,
      tasks: [],
    };
    setWorkspaces((currentWorkspaces) =>
      currentWorkspaces.map((workspace) =>
        workspace.id === workspaceId
          ? { ...workspace, boards: [...workspace.boards, board] }
          : workspace,
      ),
    );
    return board.id;
  }
  function addTask(
    workspaceId: Workspace["id"],
    boardId: Board["id"],
    { title }: TaskInput,
  ) {
    const task: Task = {
      id: createId("task"),
      title,
    };
    setWorkspaces((currentWorkspaces) =>
      currentWorkspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.map((board) =>
                board.id === boardId
                  ? { ...board, tasks: [...board.tasks, task] }
                  : board,
              ),
            }
          : workspace,
      ),
    );
    return task.id;
  }

  function updateWorkspace(
    workspaceId: Workspace["id"],
    { name }: WorkspaceInput,
  ) {
    setWorkspaces((currentWorkspaces) =>
      currentWorkspaces.map((workspace) =>
        workspace.id === workspaceId ? { ...workspace, name } : workspace,
      ),
    );
  }
  function updateBoard(
    workspaceId: Workspace["id"],
    boardId: Board["id"],
    { name }: BoardInput,
  ) {
    setWorkspaces((currentWorkspaces) =>
      currentWorkspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.map((board) =>
                board.id === boardId ? { ...board, name } : board,
              ),
            }
          : workspace,
      ),
    );
  }

  function deleteWorkspace(workspaceId: Workspace["id"]) {
    setWorkspaces((currentWorkspaces) =>
      currentWorkspaces.filter((workspace) => workspace.id !== workspaceId),
    );
  }
  function deleteBoard(workspaceId: Workspace["id"], boardId: Board["id"]) {
    setWorkspaces((currentWorkspaces) =>
      currentWorkspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.filter((board) => board.id !== boardId),
            }
          : workspace,
      ),
    );
  }

  function reorderBoard(
    workspaceId: Workspace["id"],
    boardId: Board["id"],
    direction: -1 | 1,
  ) {
    setWorkspaces((currentWorkspaces) =>
      currentWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId) return workspace;

        const currentIndex = workspace.boards.findIndex(
          (board) => board.id === boardId,
        );
        const nextIndex = currentIndex + direction;
        if (
          currentIndex < 0 ||
          nextIndex < 0 ||
          nextIndex >= workspace.boards.length
        )
          return workspace;

        const reorderedBoards = [...workspace.boards];
        const [board] = reorderedBoards.splice(currentIndex, 1);
        if (!board) return workspace;
        reorderedBoards.splice(nextIndex, 0, board);

        return { ...workspace, boards: reorderedBoards };
      }),
    );
  }

  return {
    addBoard,
    addTask,
    addWorkspace,
    deleteBoard,
    deleteWorkspace,
    reorderBoard,
    updateBoard,
    updateWorkspace,
    workspaces,
  };
}
