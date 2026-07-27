import { z } from "zod";
export declare const createTaskSchema: any;
export declare const updateTaskSchema: any;
export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
