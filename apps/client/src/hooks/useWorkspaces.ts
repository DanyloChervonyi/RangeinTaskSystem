import { useState } from "react";
import { workspacesMock } from "../mocks/workspaces";
import type {
  Board,
  Task,
  Workspace,
  CreateWorkspaceInput,
  CreateBoardInput,
  CreateTaskInput,
} from "../types/workspace";
import { createId } from "../utils/getWorkspaceTasksCount";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    structuredClone(workspacesMock.workspaces),
  );
  function addWorkspace({ name }: CreateWorkspaceInput) {
    const workspace: Workspace = {
      id: createId("workspace"),
      name,
      boards: [],
    };
    setWorkspaces((currentWorkspaces) => [...currentWorkspaces, workspace]);

    return workspace.id;
  }

  function addBoard(workspaceId: Workspace["id"], { name }: CreateBoardInput) {
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
    { title }: CreateTaskInput,
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

  return {
    addBoard,
    addTask,
    addWorkspace,
    workspaces,
  };
}
