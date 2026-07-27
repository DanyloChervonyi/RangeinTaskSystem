import { z } from "zod";
export declare const registerSchema: any;
export declare const loginSchema: any;
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
