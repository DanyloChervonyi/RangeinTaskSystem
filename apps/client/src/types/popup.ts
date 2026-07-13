import type { Board, Workspace } from "../types/workspace";

export const PopupType = {
  CONFIRM: "confirm",
  CREATE_BOARD: "create-board",
  CREATE_TASK: "create-task",
  CREATE_WORKSPACE: "create-workspace",
  EDIT_BOARD: "edit-board",
  EDIT_WORKSPACE: "edit-workspace",
} as const;
export type PopupType = (typeof PopupType)[keyof typeof PopupType];

export interface ConfirmMetadata {
  confirmLabel: string;
  message: string;
  title: string;
}
export interface CreateWorkspaceMetadata {
  type: typeof PopupType.CREATE_WORKSPACE;
}
export interface EditWorkspaceMetadata {
  type: typeof PopupType.EDIT_WORKSPACE;
  workspace: Workspace;
}
export interface CreateBoardMetadata {
  type: typeof PopupType.CREATE_BOARD;
  workspace: Workspace;
}
export interface EditBoardMetadata {
  board: Board;
  type: typeof PopupType.EDIT_BOARD;
  workspace: Workspace;
}
export interface CreateTaskMetadata {
  board: Board;
  type: typeof PopupType.CREATE_TASK;
  workspace: Workspace;
}

export type TextPopupMetadata =
  | CreateBoardMetadata
  | CreateTaskMetadata
  | CreateWorkspaceMetadata
  | EditBoardMetadata
  | EditWorkspaceMetadata;

export interface PopupStore {
  confirmMetadata: ConfirmMetadata | null;
  onConfirm: (() => void) | null;
  textPopupMetadata: TextPopupMetadata | null;
  closeConfirm: () => void;
  closeTextPopup: () => void;
  openConfirm: (metadata: ConfirmMetadata, onConfirm: () => void) => void;
  openTextPopup: (metadata: TextPopupMetadata) => void;
  requestTextPopupClose: () => void;
}
