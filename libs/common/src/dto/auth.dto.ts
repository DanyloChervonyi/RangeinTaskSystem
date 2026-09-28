import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  name: z.string().trim().min(1).max(80).optional(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(128),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
