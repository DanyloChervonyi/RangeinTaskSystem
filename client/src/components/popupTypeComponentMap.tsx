import type { ReactNode } from "react";
import { TextEntityModal } from "./TextEntityModal";
import type { useWorkspaceMutations } from "../features/workspaces/useWorkspacesQuery";
import type { PopupStore, TextPopupMetadata } from "../types/popup";
import { PopupType } from "../types/popup";
import { workspaceNameSchema } from "../validation/textEntitySchemas";

interface PopupTypeComponentMapOptions {
  closeConfirm: PopupStore["closeConfirm"];
  closeTextPopup: PopupStore["closeTextPopup"];
  mutations: Pick<
    ReturnType<typeof useWorkspaceMutations>,
    "addBoard" | "addTask" | "addWorkspace" | "updateBoard" | "updateWorkspace"
  >;
  openConfirm: PopupStore["openConfirm"];
  requestTextPopupClose: PopupStore["requestTextPopupClose"];
  textPopupMetadata: TextPopupMetadata;
}

export function getPopupTypeComponentMap({
  closeConfirm,
  closeTextPopup,
  mutations,
  openConfirm,
  requestTextPopupClose,
  textPopupMetadata,
}: PopupTypeComponentMapOptions): Record<PopupType, ReactNode> {
  const { addBoard, addTask, addWorkspace, updateBoard, updateWorkspace } =
    mutations;

  return {
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
}
