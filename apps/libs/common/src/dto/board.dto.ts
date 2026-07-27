import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().trim().min(1).max(120),
  workspaceId: z.uuid(),
});

export const updateBoardSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export type CreateBoardDto = z.infer<typeof createBoardSchema>;
export type UpdateBoardDto = z.infer<typeof updateBoardSchema>;
