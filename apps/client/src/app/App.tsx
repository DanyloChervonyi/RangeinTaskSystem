import { useState } from "react";
import { WorkspaceView } from "../features/workspaces";
import { useTextFieldSubmit } from "../hooks/useTextFieldSubmit";
import { useWorkspaces } from "../hooks/useWorkspaces";

export function App() {
  const { addBoard, addTask, addWorkspace, workspaces } = useWorkspaces();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(
    workspaces[0]?.id,
  );
  const selectedWorkspace =
    workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ??
    workspaces[0];

  const handleAddWorkspace = useTextFieldSubmit({
    fieldName: "workspaceName",
    onSubmit: (name) => {
      setSelectedWorkspaceId(addWorkspace({ name }));
    },
  });

  if (!selectedWorkspace) return null;

  return (
    <main className="app-shell">
      <aside className="workspace-sidebar" aria-labelledby="workspaces-title">
        <p className="app-kicker">Rangein Task System</p>
        <h1 id="workspaces-title">Workspaces</h1>

        <ul className="workspace-list">
          {workspaces.map((workspace) => (
            <li className="workspace-list-item" key={workspace.id}>
              <button
                aria-current={
                  workspace.id === selectedWorkspace.id ? "page" : undefined
                }
                className="workspace-button"
                onClick={() => setSelectedWorkspaceId(workspace.id)}
                type="button"
              >
                <span>{workspace.name}</span>
                <small>{workspace.boards.length} boards</small>
              </button>
            </li>
          ))}
        </ul>

        <form className="entity-form" onSubmit={handleAddWorkspace}>
          <label htmlFor="workspace-name">New workspace</label>
          <div>
            <input
              id="workspace-name"
              name="workspaceName"
              placeholder="e.g. Marketing"
              type="text"
            />
            <button type="submit">Add</button>
          </div>
        </form>
      </aside>

      <WorkspaceView
        addBoard={addBoard}
        addTask={addTask}
        workspace={selectedWorkspace}
      />
    </main>
  );
}
