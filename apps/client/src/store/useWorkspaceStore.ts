import { create } from "zustand";
import { workspacesMock } from "../mocks/workspaces";
import type {
  Board,
  Task,
  Workspace,
  WorkspaceStore,
} from "../types/workspace";
import { createId } from "../utils/createId";

const initialWorkspaces = structuredClone(workspacesMock.workspaces);

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  selectedWorkspaceId: initialWorkspaces[0]?.id,
  workspaces: initialWorkspaces,

  addWorkspace: ({ name }) => {
    const workspace: Workspace = {
      boards: [],
      id: createId("workspace"),
      name,
    };
    set(({ workspaces }) => ({
      selectedWorkspaceId: workspace.id,
      workspaces: [...workspaces, workspace],
    }));
    return workspace.id;
  },
  addBoard: (workspaceId, { name }) => {
    const board: Board = {
      id: createId("board"),
      name,
      tasks: [],
    };
    set(({ workspaces }) => ({
      workspaces: workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? { ...workspace, boards: [...workspace.boards, board] }
          : workspace,
      ),
    }));
    return board.id;
  },
  addTask: (workspaceId, boardId, { title }) => {
    const task: Task = {
      id: createId("task"),
      title,
    };
    set(({ workspaces }) => ({
      workspaces: workspaces.map((workspace) =>
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
    }));
    return task.id;
  },

  updateWorkspace: (workspaceId, { name }) => {
    set(({ workspaces }) => ({
      workspaces: workspaces.map((workspace) =>
        workspace.id === workspaceId ? { ...workspace, name } : workspace,
      ),
    }));
  },
  updateBoard: (workspaceId, boardId, { name }) => {
    set(({ workspaces }) => ({
      workspaces: workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.map((board) =>
                board.id === boardId ? { ...board, name } : board,
              ),
            }
          : workspace,
      ),
    }));
  },

  deleteWorkspace: (workspaceId) => {
    const { selectedWorkspaceId, workspaces } = get();
    const nextWorkspace = workspaces.find(({ id }) => id !== workspaceId);
    set({
      selectedWorkspaceId:
        selectedWorkspaceId === workspaceId
          ? nextWorkspace?.id
          : selectedWorkspaceId,
      workspaces: workspaces.filter(
        (workspace) => workspace.id !== workspaceId,
      ),
    });
  },
  deleteBoard: (workspaceId, boardId) => {
    set(({ workspaces }) => ({
      workspaces: workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.filter((board) => board.id !== boardId),
            }
          : workspace,
      ),
    }));
  },

  reorderBoard: (workspaceId, boardId, direction) => {
    set(({ workspaces }) => ({
      workspaces: workspaces.map((workspace) => {
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
    }));
  },
  selectWorkspace: (workspaceId) => {
    set({ selectedWorkspaceId: workspaceId });
  },
}));
