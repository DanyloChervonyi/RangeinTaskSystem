import { create } from "zustand";
import type { PopupStore } from "../types/popup";

export const usePopupStore = create<PopupStore>((set, get) => ({
  confirmMetadata: null,
  onConfirm: null,
  textPopupMetadata: null,

  closeConfirm: () => {
    set({ confirmMetadata: null, onConfirm: null });
  },
  closeTextPopup: () => {
    set({ textPopupMetadata: null });
  },
  openConfirm: (confirmMetadata, onConfirm) => {
    set({ confirmMetadata, onConfirm });
  },
  openTextPopup: (textPopupMetadata) => {
    set({ textPopupMetadata });
  },
  requestTextPopupClose: () => {
    get().openConfirm(
      {
        confirmLabel: "Close",
        message: "Close this form? Entered changes will be lost.",
        title: "Close form?",
      },
      () => {
        set({
          confirmMetadata: null,
          onConfirm: null,
          textPopupMetadata: null,
        });
      },
    );
  },
}));
