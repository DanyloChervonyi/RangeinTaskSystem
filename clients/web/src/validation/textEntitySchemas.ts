import { z } from "zod";

export const textEntitySchema = z.object({
  value: z.string().trim().min(1, "Name is required."),
});
export const workspaceNameSchema = z.object({
  value: z
    .string()
    .trim()
    .min(5, "Workspace name must be at least 5 characters.")
    .max(30, "Workspace name must be 30 characters or less."),
});
