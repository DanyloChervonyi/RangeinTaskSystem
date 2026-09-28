import { z } from "zod";
import { textEntitySchema } from "../validation/textEntitySchemas";

export type TextEntityFormValues = z.infer<typeof textEntitySchema>;
export type TextEntitySchema = z.ZodType<
  TextEntityFormValues,
  TextEntityFormValues
>;
