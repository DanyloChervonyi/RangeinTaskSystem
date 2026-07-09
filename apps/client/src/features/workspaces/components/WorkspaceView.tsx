import type { Board, Workspace } from "../../../types/workspace";
import { getWorkspaceTasksCount } from "../../../utils/getWorkspaceTasksCount";
import { BoardColumn } from "./BoardColumn";

interface WorkspaceViewProps {
  onCreateBoard: (workspace: Workspace) => void;
  onCreateTask: (workspace: Workspace, board: Board) => void;
  onDeleteBoard: (workspace: Workspace, board: Board) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
  onEditBoard: (workspace: Workspace, board: Board) => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onMoveBoard: (workspace: Workspace, board: Board, direction: -1 | 1) => void;
  workspace: Workspace;
}

export function WorkspaceView({
  onCreateBoard,
  onCreateTask,
  onDeleteBoard,
  onDeleteWorkspace,
  onEditBoard,
  onEditWorkspace,
  onMoveBoard,
  workspace,
}: WorkspaceViewProps) {
  return (
    <section className="workspace-view" aria-labelledby="workspace-title">
      <header className="workspace-header">
        <div>
          <p className="section-label">Current workspace</p>
          <h2 id="workspace-title">{workspace.name}</h2>
        </div>
        <p className="workspace-summary">
          {workspace.boards.length} boards - {getWorkspaceTasksCount(workspace)} tasks
        </p>
        <div className="item-actions">
          <button
            className="button-secondary"
            onClick={() => onEditWorkspace(workspace)}
            type="button"
          >
            Edit
          </button>
          <button
            className="button-danger"
            onClick={() => onDeleteWorkspace(workspace)}
            type="button"
          >
            Delete
          </button>
        </div>
      </header>

      <div className="workspace-toolbar">
        <button className="button-primary" onClick={() => onCreateBoard(workspace)} type="button">
          Add column
        </button>
      </div>

      <div className="board-grid">
        {workspace.boards.map((board, index) => (
          <BoardColumn
            board={board}
            canMoveLeft={index > 0}
            canMoveRight={index < workspace.boards.length - 1}
            key={board.id}
            onCreateTask={() => onCreateTask(workspace, board)}
            onDelete={() => onDeleteBoard(workspace, board)}
            onEdit={() => onEditBoard(workspace, board)}
            onMoveLeft={() => onMoveBoard(workspace, board, -1)}
            onMoveRight={() => onMoveBoard(workspace, board, 1)}
          />
        ))}
      </div>
    </section>
  );
}
