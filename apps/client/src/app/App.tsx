import { useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { TextEntityModal } from "../components/TextEntityModal";
import { WorkspaceView } from "../features/workspaces";
import { useWorkspaces } from "../hooks/useWorkspaces";
import type { Board, Workspace } from "../types/workspace";
import { validateWorkspaceName } from "../utils/validateWorkspaceName";

type TextModalState =
  | { type: "create-workspace" }
  | { type: "edit-workspace"; workspace: Workspace }
  | { type: "create-board"; workspace: Workspace }
  | { type: "edit-board"; board: Board; workspace: Workspace }
  | { type: "create-task"; board: Board; workspace: Workspace };

interface ConfirmState {
  confirmLabel: string;
  message: string;
  title: string;
  onConfirm: () => void;
}

export function App() {
  const {
    addBoard,
    addTask,
    addWorkspace,
    deleteBoard,
    deleteWorkspace,
    reorderBoard,
    updateBoard,
    updateWorkspace,
    workspaces,
  } = useWorkspaces();
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<
    string | undefined
  >(workspaces[0]?.id);
  const [textModalState, setTextModalState] = useState<TextModalState | null>(
    null,
  );
  const selectedWorkspace =
    workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ??
    workspaces[0];

  function closeConfirm() {
    setConfirmState(null);
  }
  function requestCloseTextModal() {
    setConfirmState({
      confirmLabel: "Close",
      message: "Close this form? Entered changes will be lost.",
      onConfirm: () => {
        setTextModalState(null);
        setConfirmState(null);
      },
      title: "Close form?",
    });
  }
  function requestActionConfirmation(confirmState: ConfirmState) {
    setConfirmState(confirmState);
  }
  function handleDeleteWorkspace(workspace: Workspace) {
    requestActionConfirmation({
      confirmLabel: "Delete",
      message: `Delete workspace "${workspace.name}" and all its columns?`,
      onConfirm: () => {
        const nextWorkspace = workspaces.find(({ id }) => id !== workspace.id);
        deleteWorkspace(workspace.id);
        if (selectedWorkspaceId === workspace.id)
          setSelectedWorkspaceId(nextWorkspace?.id);
        setConfirmState(null);
      },
      title: "Delete workspace?",
    });
  }
  function handleDeleteBoard(workspace: Workspace, board: Board) {
    requestActionConfirmation({
      confirmLabel: "Delete",
      message: `Delete column "${board.name}" and all its tasks?`,
      onConfirm: () => {
        deleteBoard(workspace.id, board.id);
        setConfirmState(null);
      },
      title: "Delete column?",
    });
  }
  function renderTextModal() {
    if (!textModalState) return null;

    if (textModalState.type === "create-workspace") {
      return (
        <TextEntityModal
          inputLabel="Workspace name"
          onRequestClose={requestCloseTextModal}
          onSubmit={(name) =>
            requestActionConfirmation({
              confirmLabel: "Create",
              message: `Create workspace "${name}"?`,
              onConfirm: () => {
                setSelectedWorkspaceId(addWorkspace({ name }));
                setTextModalState(null);
                setConfirmState(null);
              },
              title: "Create workspace?",
            })
          }
          placeholder="example"
          submitLabel="Create workspace"
          title="Create workspace"
          validate={validateWorkspaceName}
        />
      );
    }

    if (textModalState.type === "edit-workspace") {
      const { workspace } = textModalState;
      return (
        <TextEntityModal
          initialValue={workspace.name}
          inputLabel="Workspace name"
          onRequestClose={requestCloseTextModal}
          onSubmit={(name) =>
            requestActionConfirmation({
              confirmLabel: "Save",
              message: `Rename workspace "${workspace.name}" to "${name}"?`,
              onConfirm: () => {
                updateWorkspace(workspace.id, { name });
                setTextModalState(null);
                setConfirmState(null);
              },
              title: "Edit workspace?",
            })
          }
          submitLabel="Save workspace"
          title="Edit workspace"
          validate={validateWorkspaceName}
        />
      );
    }
    if (textModalState.type === "create-board") {
      const { workspace } = textModalState;

      return (
        <TextEntityModal
          inputLabel="Column name"
          onRequestClose={requestCloseTextModal}
          onSubmit={(name) =>
            requestActionConfirmation({
              confirmLabel: "Create",
              message: `Create column "${name}" in "${workspace.name}"?`,
              onConfirm: () => {
                addBoard(workspace.id, { name });
                setTextModalState(null);
                setConfirmState(null);
              },
              title: "Create column?",
            })
          }
          placeholder="QA"
          submitLabel="Create column"
          title="Create column"
        />
      );
    }

    if (textModalState.type === "edit-board") {
      const { board, workspace } = textModalState;

      return (
        <TextEntityModal
          initialValue={board.name}
          inputLabel="Column name"
          onRequestClose={requestCloseTextModal}
          onSubmit={(name) =>
            requestActionConfirmation({
              confirmLabel: "Save",
              message: `Rename column "${board.name}" to "${name}"?`,
              onConfirm: () => {
                updateBoard(workspace.id, board.id, { name });
                setTextModalState(null);
                setConfirmState(null);
              },
              title: "Edit column?",
            })
          }
          submitLabel="Save column"
          title="Edit column"
        />
      );
    }

    const { board, workspace } = textModalState;
    return (
      <TextEntityModal
        inputLabel="Task title"
        onRequestClose={requestCloseTextModal}
        onSubmit={(title) =>
          requestActionConfirmation({
            confirmLabel: "Create",
            message: `Create task "${title}" in "${board.name}"?`,
            onConfirm: () => {
              addTask(workspace.id, board.id, { title });
              setTextModalState(null);
              setConfirmState(null);
            },
            title: "Create task?",
          })
        }
        placeholder="Task title"
        submitLabel="Create task"
        title="Create task"
      />
    );
  }
  function renderConfirmDialog() {
    if (!confirmState) return null;
    return (
      <ConfirmDialog
        confirmLabel={confirmState.confirmLabel}
        message={confirmState.message}
        onCancel={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
      />
    );
  }

  return (
    <main className="app-shell">
      <aside className="workspace-sidebar" aria-labelledby="workspaces-title">
        <p className="app-kicker">Rangein Task System</p>
        <div className="sidebar-heading">
          <h1 id="workspaces-title">Workspaces</h1>
          <button
            className="button-primary"
            onClick={() => setTextModalState({ type: "create-workspace" })}
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
                onClick={() => setSelectedWorkspaceId(workspace.id)}
                type="button"
              >
                <span>{workspace.name}</span>
                <small>{workspace.boards.length} boards</small>
              </button>
              <div className="item-actions">
                <button
                  className="button-secondary"
                  onClick={() =>
                    setTextModalState({ type: "edit-workspace", workspace })
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
          onCreateBoard={(workspace) =>
            setTextModalState({ type: "create-board", workspace })
          }
          onCreateTask={(workspace, board) =>
            setTextModalState({ board, type: "create-task", workspace })
          }
          onDeleteBoard={handleDeleteBoard}
          onDeleteWorkspace={handleDeleteWorkspace}
          onEditBoard={(workspace, board) =>
            setTextModalState({ board, type: "edit-board", workspace })
          }
          onEditWorkspace={(workspace) =>
            setTextModalState({ type: "edit-workspace", workspace })
          }
          onMoveBoard={(workspace, board, direction) =>
            reorderBoard(workspace.id, board.id, direction)
          }
          workspace={selectedWorkspace}
        />
      ) : (
        <section className="workspace-view empty-state">
          <h2>No workspaces</h2>
          <p>Create a workspace to continue.</p>
        </section>
      )}

      {renderTextModal()}
      {renderConfirmDialog()}
    </main>
  );
}
