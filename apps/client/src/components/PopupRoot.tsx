import { ConfirmDialog } from "./ConfirmDialog";
import { getPopupTypeComponentMap } from "./popupTypeComponentMap";
import { usePopupStore } from "../store/usePopupStore";
import { useWorkspaceMutations } from "../features/workspaces/useWorkspacesQuery";

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
  const mutations = useWorkspaceMutations();
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

  const popupTypeComponentMap = getPopupTypeComponentMap({
    closeConfirm,
    closeTextPopup,
    mutations,
    openConfirm,
    requestTextPopupClose,
    textPopupMetadata,
  });

  return (
    <>
      {popupTypeComponentMap[textPopupMetadata.type]}
      {confirmDialog}
    </>
  );
}
