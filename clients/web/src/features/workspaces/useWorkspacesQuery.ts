import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import {
  createBoard,
  createTask,
  createWorkspace,
  deleteBoard,
  deleteWorkspace,
  getWorkspaces,
  updateBoard,
  updateWorkspace,
} from "../../api/workspacesApi";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import type { Board, Workspace } from "../../types/workspace";

export const workspacesQueryKey = ["workspaces"] as const;
const emptyWorkspaces: Workspace[] = [];

export function useWorkspacesQuery() {
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const query = useQuery({
    queryKey: workspacesQueryKey,
    queryFn: getWorkspaces,
  });
  const workspaces = query.data ?? emptyWorkspaces;

  const selectedWorkspace = useMemo(
    () =>
      workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ??
      workspaces[0],
    [selectedWorkspaceId, workspaces],
  );

  useEffect(() => {
    if (query.isSuccess && selectedWorkspace?.id !== selectedWorkspaceId) {
      selectWorkspace(selectedWorkspace?.id);
    }
  }, [query.isSuccess, selectWorkspace, selectedWorkspace?.id, selectedWorkspaceId]);

  return {
    ...query,
    selectedWorkspace,
    workspaces,
  };
}

export function useWorkspaceMutations() {
  const queryClient = useQueryClient();
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const invalidateWorkspaces = () =>
    queryClient.invalidateQueries({ queryKey: workspacesQueryKey });

  const addWorkspace = useMutation({
    mutationFn: createWorkspace,
    onSuccess: async (workspace) => {
      selectWorkspace(workspace.id);
      await invalidateWorkspaces();
    },
  });
  const editWorkspace = useMutation({
    mutationFn: ({ id, name }: Pick<Workspace, "id" | "name">) =>
      updateWorkspace(id, { name }),
    onSuccess: invalidateWorkspaces,
  });
  const removeWorkspace = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: async (_workspace, deletedWorkspaceId) => {
      const workspaces =
        queryClient.getQueryData<Workspace[]>(workspacesQueryKey) ?? [];
      selectWorkspace(
        workspaces.find((workspace) => workspace.id !== deletedWorkspaceId)?.id,
      );
      await invalidateWorkspaces();
    },
  });
  const addBoard = useMutation({
    mutationFn: createBoard,
    onSuccess: invalidateWorkspaces,
  });
  const editBoard = useMutation({
    mutationFn: ({ id, name }: Pick<Board, "id" | "name">) =>
      updateBoard(id, { name }),
    onSuccess: invalidateWorkspaces,
  });
  const removeBoard = useMutation({
    mutationFn: deleteBoard,
    onSuccess: invalidateWorkspaces,
  });
  const addTask = useMutation({
    mutationFn: createTask,
    onSuccess: invalidateWorkspaces,
  });
  const reorderBoard = (
    workspaceId: Workspace["id"],
    boardId: Board["id"],
    direction: -1 | 1,
  ) => {
    queryClient.setQueryData<Workspace[]>(workspacesQueryKey, (workspaces) =>
      workspaces?.map((workspace) => {
        if (workspace.id !== workspaceId) return workspace;

        const currentIndex = workspace.boards.findIndex(
          (board) => board.id === boardId,
        );
        const nextIndex = currentIndex + direction;
        if (
          currentIndex < 0 ||
          nextIndex < 0 ||
          nextIndex >= workspace.boards.length
        ) {
          return workspace;
        }

        const boards = [...workspace.boards];
        const [board] = boards.splice(currentIndex, 1);
        if (!board) return workspace;
        boards.splice(nextIndex, 0, board);

        return {
          ...workspace,
          boards,
        };
      }),
    );
  };

  return {
    addBoard: addBoard.mutateAsync,
    addTask: addTask.mutateAsync,
    addWorkspace: addWorkspace.mutateAsync,
    deleteBoard: removeBoard.mutateAsync,
    deleteWorkspace: removeWorkspace.mutateAsync,
    reorderBoard,
    updateBoard: editBoard.mutateAsync,
    updateWorkspace: editWorkspace.mutateAsync,
  };
}
