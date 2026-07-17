import type { ReactNode } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { TextEntityModal } from "./TextEntityModal";
import { usePopupStore } from "../store/usePopupStore";
import { useWorkspaceMutations } from "../features/workspaces/useWorkspacesQuery";
import { workspaceNameSchema } from "../validation/textEntitySchemas";
import { PopupType } from "../types/popup";

export function PopupRoot() {
  const confirmMetadata = usePopupStore((state) => state.confirmMetadata);
  const onConfirm = usePopupStore((state) => state.onConfirm);
  const textPopupMetadata = usePopupStore((state) => state.textPopupMetadata);
  const closeConfirm = usePopupStore((state) => state.closeConfirm);
  const closeTextPopup = usePopupStore((state) => state.closeTextPopup);
  const openConfirm = usePopupStore((state) => state.openConfirm);
  const requestTextPopupClose = usePopupStore(
    (state) => state.requestTextPopupClose,
  );
  const { addBoard, addTask, addWorkspace, updateBoard, updateWorkspace } =
    useWorkspaceMutations();
  const confirmDialog = confirmMetadata ? (
    <ConfirmDialog
      confirmLabel={confirmMetadata.confirmLabel}
      message={confirmMetadata.message}
      onCancel={closeConfirm}
      onConfirm={() => onConfirm?.()}
      title={confirmMetadata.title}
    />
  ) : null;

  if (!textPopupMetadata) return confirmDialog;

  const popupTypeComponentMap: Record<PopupType, ReactNode> = {
    [PopupType.CONFIRM]: null,
    [PopupType.CREATE_WORKSPACE]:
      textPopupMetadata.type === PopupType.CREATE_WORKSPACE ? (
        <TextEntityModal
          inputLabel="Workspace name"
          onRequestClose={requestTextPopupClose}
          onSubmit={(name) =>
            openConfirm(
              {
                confirmLabel: "Create",
                message: `Create workspace "${name}"?`,
                title: "Create workspace?",
              },
              async () => {
                await addWorkspace({ name });
                closeTextPopup();
                closeConfirm();
              },
            )
          }
          placeholder="example"
          schema={workspaceNameSchema}
          submitLabel="Create workspace"
          title="Create workspace"
        />
      ) : null,
    [PopupType.EDIT_WORKSPACE]:
      textPopupMetadata.type === PopupType.EDIT_WORKSPACE ? (
        <TextEntityModal
          initialValue={textPopupMetadata.workspace.name}
          inputLabel="Workspace name"
          onRequestClose={requestTextPopupClose}
          onSubmit={(name) =>
            openConfirm(
              {
                confirmLabel: "Save",
                message: `Rename workspace "${textPopupMetadata.workspace.name}" to "${name}"?`,
                title: "Edit workspace?",
              },
              async () => {
                await updateWorkspace({
                  id: textPopupMetadata.workspace.id,
                  name,
                });
                closeTextPopup();
                closeConfirm();
              },
            )
          }
          schema={workspaceNameSchema}
          submitLabel="Save workspace"
          title="Edit workspace"
        />
      ) : null,
    [PopupType.CREATE_BOARD]:
      textPopupMetadata.type === PopupType.CREATE_BOARD ? (
        <TextEntityModal
          inputLabel="Column name"
          onRequestClose={requestTextPopupClose}
          onSubmit={(name) =>
            openConfirm(
              {
                confirmLabel: "Create",
                message: `Create column "${name}" in "${textPopupMetadata.workspace.name}"?`,
                title: "Create column?",
              },
              async () => {
                await addBoard({
                  name,
                  workspaceId: textPopupMetadata.workspace.id,
                });
                closeTextPopup();
                closeConfirm();
              },
            )
          }
          placeholder="QA"
          submitLabel="Create column"
          title="Create column"
        />
      ) : null,
    [PopupType.EDIT_BOARD]:
      textPopupMetadata.type === PopupType.EDIT_BOARD ? (
        <TextEntityModal
          initialValue={textPopupMetadata.board.name}
          inputLabel="Column name"
          onRequestClose={requestTextPopupClose}
          onSubmit={(name) =>
            openConfirm(
              {
                confirmLabel: "Save",
                message: `Rename column "${textPopupMetadata.board.name}" to "${name}"?`,
                title: "Edit column?",
              },
              async () => {
                await updateBoard({
                  id: textPopupMetadata.board.id,
                  name,
                });
                closeTextPopup();
                closeConfirm();
              },
            )
          }
          submitLabel="Save column"
          title="Edit column"
        />
      ) : null,
    [PopupType.CREATE_TASK]:
      textPopupMetadata.type === PopupType.CREATE_TASK ? (
        <TextEntityModal
          inputLabel="Task title"
          onRequestClose={requestTextPopupClose}
          onSubmit={(title) =>
            openConfirm(
              {
                confirmLabel: "Create",
                message: `Create task "${title}" in "${textPopupMetadata.board.name}"?`,
                title: "Create task?",
              },
              async () => {
                await addTask({
                  boardId: textPopupMetadata.board.id,
                  title,
                });
                closeTextPopup();
                closeConfirm();
              },
            )
          }
          placeholder="Task title"
          submitLabel="Create task"
          title="Create task"
        />
      ) : null,
  };

  return (
    <>
      {popupTypeComponentMap[textPopupMetadata.type]}
      {confirmDialog}
    </>
  );
}
