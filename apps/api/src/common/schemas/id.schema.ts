import { z } from "zod";

export const idSchema = z.uuid();
export const optionalIdSchema = idSchema.optional();
