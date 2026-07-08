import { useTextFieldSubmit } from "../../../hooks/useTextFieldSubmit";
import type { Workspace } from "../../../types/workspace";
import { getWorkspaceTasksCount } from "../../../utils/getWorkspaceTasksCount";
import { BoardColumn } from "./BoardColumn";

interface WorkspaceViewProps {
  addBoard: (workspaceId: string, input: { name: string }) => string;
  addTask: (workspaceId: string, boardId: string, input: { title: string }) => string;
  workspace: Workspace;
}

export function WorkspaceView({ addBoard, addTask, workspace }: WorkspaceViewProps) {
  const handleAddBoard = useTextFieldSubmit({
    fieldName: "boardName",
    onSubmit: (name) => addBoard(workspace.id, { name }),
  });

  return (
    <section className="workspace-view" aria-labelledby="workspace-title">
      <header className="workspace-header">
        <div>
          <p className="section-label">Current workspace</p>
          <h2 id="workspace-title">{workspace.name}</h2>
        </div>
        <p className="workspace-summary">
          {workspace.boards.length} boards · {getWorkspaceTasksCount(workspace)}{" "}
          tasks
        </p>
      </header>
      <form className="entity-form entity-form-inline" onSubmit={handleAddBoard}>
        <label htmlFor="board-name">New column</label>
        <div>
          <input id="board-name" name="boardName" placeholder="e.g. QA" type="text" />
          <button type="submit">Add column</button>
        </div>
      </form>

      <div className="board-grid">
        {workspace.boards.map((board) => (
          <BoardColumn addTask={addTask} board={board} key={board.id} workspaceId={workspace.id} />
        ))}
      </div>
    </section>
  );
}
