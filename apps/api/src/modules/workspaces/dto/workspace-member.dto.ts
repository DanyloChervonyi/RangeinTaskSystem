import { z } from "zod";

export const addWorkspaceMemberSchema = z
  .object({
    email: z.email().trim().toLowerCase().optional(),
    userId: z.uuid().optional(),
  })
  .refine(({ email, userId }) => Boolean(email) !== Boolean(userId), {
    message: "Provide either email or userId",
    path: ["email"],
  });

export type AddWorkspaceMemberDto = z.infer<typeof addWorkspaceMemberSchema>;
