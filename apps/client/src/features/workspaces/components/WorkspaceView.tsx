import type { Workspace } from "../../../types/workspace";
import { getWorkspaceTasksCount } from "../utils/getWorkspaceTasksCount";
import { BoardColumn } from "./BoardColumn";

interface WorkspaceViewProps {
  workspace: Workspace;
}

export function WorkspaceView({ workspace }: WorkspaceViewProps) {
  return (
    <section className="workspace-view" aria-labelledby="workspace-title">
      <header className="workspace-header">
        <div>
          <p className="section-label">Current workspace</p>
          <h2 id="workspace-title">{workspace.name}</h2>
        </div>
        <p className="workspace-summary">
          {workspace.boards.length} boards · {getWorkspaceTasksCount(workspace)} tasks
        </p>
      </header>

      <div className="board-grid">
        {workspace.boards.map((board) => (
          <BoardColumn board={board} key={board.id} />
        ))}
      </div>
    </section>
  );
}
