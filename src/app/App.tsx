import { useState } from "react";
import { WorkspaceView } from "../features/workspaces";
import { workspacesMock } from "../mocks/workspaces";

export function App() {
  const workspaces = workspacesMock.workspaces;
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaces[0]?.id);
  const selectedWorkspace =
    workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ?? workspaces[0];

  return (
    <main className="app-shell">
      <aside className="workspace-sidebar" aria-labelledby="workspaces-title">
        <p className="app-kicker">Rangein Task System</p>
        <h1 id="workspaces-title">Workspaces</h1>

        <ul className="workspace-list">
          {workspaces.map((workspace) => (
            <li className="workspace-list-item" key={workspace.id}>
              <button
                aria-current={workspace.id === selectedWorkspace.id ? "page" : undefined}
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
      </aside>

      <WorkspaceView workspace={selectedWorkspace} />
    </main>
  );
}
