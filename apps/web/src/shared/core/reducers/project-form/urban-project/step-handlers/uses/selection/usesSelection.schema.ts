import { urbanProjectUseSchema } from "shared";
import z from "zod";

export const usesSelectionSchema = z.object({
  usesSelection: z.array(urbanProjectUseSchema),
});
