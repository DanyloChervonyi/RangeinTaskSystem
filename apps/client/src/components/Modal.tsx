import type { PropsWithChildren } from "react";

interface ModalProps extends PropsWithChildren {
  title: string;
  onRequestClose: () => void;
}

export function Modal({ children, onRequestClose, title }: ModalProps) {
  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onRequestClose();
        }
      }}
      role="dialog"
    >
      <section className="modal-panel">
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            aria-label="Close modal"
            className="icon-button"
            onClick={onRequestClose}
            type="button"
          >
            x
          </button>
        </header>

        {children}
      </section>
    </div>
  );
}
