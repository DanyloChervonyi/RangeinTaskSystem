import { create } from "zustand";
import type { WorkspaceStore } from "../types/workspace";

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  selectWorkspace: (workspaceId) => {
    set({ selectedWorkspaceId: workspaceId });
  },
}));
