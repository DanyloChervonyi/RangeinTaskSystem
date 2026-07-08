import { Modal } from "./Modal";

interface ConfirmDialogProps {
  cancelLabel?: string;
  confirmLabel: string;
  message: string;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  cancelLabel = "Cancel",
  confirmLabel,
  message,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <Modal onRequestClose={onCancel} title={title}>
      <p className="modal-description">{message}</p>

      <footer className="modal-actions">
        <button className="button-secondary" onClick={onCancel} type="button">
          {cancelLabel}
        </button>
        <button className="button-primary" onClick={onConfirm} type="button">
          {confirmLabel}
        </button>
      </footer>
    </Modal>
  );
}
