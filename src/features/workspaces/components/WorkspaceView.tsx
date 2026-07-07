import type { Workspace } from "../../../types/workspace";

interface WorkspaceViewProps {
  workspace: Workspace;
}

export function WorkspaceView({ workspace: _workspace }: WorkspaceViewProps) {
  void _workspace;

  return null;
}
