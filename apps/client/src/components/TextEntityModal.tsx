import { useId, useState } from "react";
import { Modal } from "./Modal";

interface TextEntityModalProps {
  initialValue?: string;
  inputLabel: string;
  placeholder?: string;
  submitLabel: string;
  title: string;
  validate?: (value: string) => string | null;
  onRequestClose: () => void;
  onSubmit: (value: string) => void;
}

export function TextEntityModal({
  initialValue = "",
  inputLabel,
  onRequestClose,
  onSubmit,
  placeholder,
  submitLabel,
  title,
  validate,
}: TextEntityModalProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(initialValue);

  return (
    <Modal onRequestClose={onRequestClose} title={title}>
      <form
        className="modal-form"
        onSubmit={(event) => {
          event.preventDefault();
          const nextValue = value.trim();
          const validationError = validate?.(nextValue) ?? null;
          if (validationError) {
            setError(validationError);
            return;
          }
          if (!nextValue) {
            setError("Name is required.");
            return;
          }

          setError(null);
          onSubmit(nextValue);
        }}
      >
        <label htmlFor={inputId}>{inputLabel}</label>
        <input
          autoFocus
          id={inputId}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          placeholder={placeholder}
          type="text"
          value={value}
        />
        {error ? <p className="form-error">{error}</p> : null}

        <footer className="modal-actions">
          <button
            className="button-secondary"
            onClick={onRequestClose}
            type="button"
          >
            Cancel
          </button>
          <button className="button-primary" type="submit">
            {submitLabel}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
