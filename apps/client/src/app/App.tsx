import { useCallback, useMemo } from "react";
import { PopupRoot } from "../components/PopupRoot";
import { WorkspaceView } from "../features/workspaces";
import { usePopupStore } from "../store/usePopupStore";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import type { Board, Workspace } from "../types/workspace";
import { PopupType } from "../types/popup";

export function App() {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const deleteBoard = useWorkspaceStore((state) => state.deleteBoard);
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);
  const reorderBoard = useWorkspaceStore((state) => state.reorderBoard);
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const openConfirm = usePopupStore((state) => state.openConfirm);
  const openTextPopup = usePopupStore((state) => state.openTextPopup);
  const closeConfirm = usePopupStore((state) => state.closeConfirm);

  const selectedWorkspace = useMemo(
    () =>
      workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ??
      workspaces[0],
    [selectedWorkspaceId, workspaces],
  );

  const handleDeleteWorkspace = useCallback(
    (workspace: Workspace) => {
      openConfirm(
        {
          confirmLabel: "Delete",
          message: `Delete workspace "${workspace.name}" and all its columns?`,
          title: "Delete workspace?",
        },
        () => {
          deleteWorkspace(workspace.id);
          closeConfirm();
        },
      );
    },
    [closeConfirm, deleteWorkspace, openConfirm],
  );

  const handleDeleteBoard = useCallback(
    (workspace: Workspace, board: Board) => {
      openConfirm(
        {
          confirmLabel: "Delete",
          message: `Delete column "${board.name}" and all its tasks?`,
          title: "Delete column?",
        },
        () => {
          deleteBoard(workspace.id, board.id);
          closeConfirm();
        },
      );
    },
    [closeConfirm, deleteBoard, openConfirm],
  );

  const handleCreateBoard = useCallback(
    (workspace: Workspace) => {
      openTextPopup({ type: PopupType.CREATE_BOARD, workspace });
    },
    [openTextPopup],
  );

  const handleCreateTask = useCallback(
    (workspace: Workspace, board: Board) => {
      openTextPopup({ board, type: PopupType.CREATE_TASK, workspace });
    },
    [openTextPopup],
  );

  const handleEditBoard = useCallback(
    (workspace: Workspace, board: Board) => {
      openTextPopup({ board, type: PopupType.EDIT_BOARD, workspace });
    },
    [openTextPopup],
  );

  const handleEditWorkspace = useCallback(
    (workspace: Workspace) => {
      openTextPopup({ type: PopupType.EDIT_WORKSPACE, workspace });
    },
    [openTextPopup],
  );

  const handleMoveBoard = useCallback(
    (workspace: Workspace, board: Board, direction: -1 | 1) => {
      reorderBoard(workspace.id, board.id, direction);
    },
    [reorderBoard],
  );

  return (
    <main className="app-shell">
      <aside className="workspace-sidebar" aria-labelledby="workspaces-title">
        <p className="app-kicker">Rangein Task System</p>
        <div className="sidebar-heading">
          <h1 id="workspaces-title">Workspaces</h1>
          <button
            className="button-primary"
            onClick={() => openTextPopup({ type: PopupType.CREATE_WORKSPACE })}
            type="button"
          >
            Add
          </button>
        </div>

        <ul className="workspace-list">
          {workspaces.map((workspace) => (
            <li className="workspace-list-item" key={workspace.id}>
              <button
                aria-current={
                  selectedWorkspace?.id === workspace.id ? "page" : undefined
                }
                className="workspace-button"
                onClick={() => selectWorkspace(workspace.id)}
                type="button"
              >
                <span>{workspace.name}</span>
                <small>{workspace.boards.length} boards</small>
              </button>
              <div className="item-actions">
                <button
                  className="button-secondary"
                  onClick={() =>
                    openTextPopup({
                      type: PopupType.EDIT_WORKSPACE,
                      workspace,
                    })
                  }
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="button-danger"
                  onClick={() => handleDeleteWorkspace(workspace)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {selectedWorkspace ? (
        <WorkspaceView
          onCreateBoard={handleCreateBoard}
          onCreateTask={handleCreateTask}
          onDeleteBoard={handleDeleteBoard}
          onDeleteWorkspace={handleDeleteWorkspace}
          onEditBoard={handleEditBoard}
          onEditWorkspace={handleEditWorkspace}
          onMoveBoard={handleMoveBoard}
          workspace={selectedWorkspace}
        />
      ) : (
        <section className="workspace-view empty-state">
          <h2>No workspaces</h2>
          <p>Create a workspace to continue.</p>
        </section>
      )}

      <PopupRoot />
    </main>
  );
}
