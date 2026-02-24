import { urbanProjectTemplateSchema } from "shared";
import z from "zod";

export const expressTemplateSelectionSchema = z.object({
  projectTemplate: urbanProjectTemplateSchema,
});
