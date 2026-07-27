import { z } from "zod";
export declare const createWorkspaceSchema: any;
export declare const updateWorkspaceSchema: any;
export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>;
