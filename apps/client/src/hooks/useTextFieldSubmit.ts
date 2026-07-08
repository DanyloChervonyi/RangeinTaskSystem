import { useCallback } from "react";
import { type FormSubmitHandler } from "../types/workspace";

interface UseTextFieldSubmitParams {
  fieldName: string;
  onSubmit: (value: string) => void;
  resetOnSuccess?: boolean;
}

export function useTextFieldSubmit({
  fieldName,
  onSubmit,
  resetOnSuccess = true,
}: UseTextFieldSubmitParams): FormSubmitHandler {
  return useCallback(
    (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      const formData = new FormData(form);
      const value = String(formData.get(fieldName) ?? "").trim();

      if (!value) return;
      onSubmit(value);
      if (resetOnSuccess) form.reset();
    },
    [fieldName, onSubmit, resetOnSuccess],
  );
}
