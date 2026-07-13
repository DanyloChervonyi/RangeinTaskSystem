import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { textEntitySchema } from "../validation/textEntitySchemas";
import type { TextEntityFormValues } from "../types/forms";
import type { TextEntityModalProps } from "../types/props";
import { Modal } from "./Modal";

export function TextEntityModal({
  initialValue = "",
  inputLabel,
  onRequestClose,
  onSubmit,
  placeholder,
  schema = textEntitySchema,
  submitLabel,
  title,
}: TextEntityModalProps) {
  const inputId = useId();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<TextEntityFormValues>({
    defaultValues: { value: initialValue },
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  return (
    <Modal onRequestClose={onRequestClose} title={title}>
      <form
        className="modal-form"
        onSubmit={handleSubmit(({ value }) => onSubmit(value))}
      >
        <label htmlFor={inputId}>{inputLabel}</label>
        <input
          autoFocus
          id={inputId}
          placeholder={placeholder}
          type="text"
          {...register("value")}
        />
        {errors.value?.message ? (
          <p className="form-error">{errors.value.message}</p>
        ) : null}

        <footer className="modal-actions">
          <button
            className="button-secondary"
            onClick={onRequestClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="button-primary"
            disabled={isSubmitting}
            type="submit"
          >
            {submitLabel}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
