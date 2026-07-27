import { z } from "zod";
export declare const createBoardSchema: any;
export declare const updateBoardSchema: any;
export type CreateBoardDto = z.infer<typeof createBoardSchema>;
export type UpdateBoardDto = z.infer<typeof updateBoardSchema>;
