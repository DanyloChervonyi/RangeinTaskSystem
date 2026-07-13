import type { Workspace, Board, Task } from "./workspace";
import type { TextEntitySchema } from "./forms";

export interface WorkspaceViewProps {
  onCreateBoard: (workspace: Workspace) => void;
  onCreateTask: (workspace: Workspace, board: Board) => void;
  onDeleteBoard: (workspace: Workspace, board: Board) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
  onEditBoard: (workspace: Workspace, board: Board) => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onMoveBoard: (workspace: Workspace, board: Board, direction: -1 | 1) => void;
  workspace: Workspace;
}
export interface BoardColumnProps {
  board: Board;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onCreateTask: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}
export interface TaskCardProps {
  task: Task;
}
export interface TextEntityModalProps {
  initialValue?: string;
  inputLabel: string;
  placeholder?: string;
  schema?: TextEntitySchema;
  submitLabel: string;
  title: string;
  onRequestClose: () => void;
  onSubmit: (value: string) => void;
}
