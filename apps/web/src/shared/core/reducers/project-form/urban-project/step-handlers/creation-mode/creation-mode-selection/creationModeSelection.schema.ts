import z from "zod";

export const creationModeSelectionSchema = z.object({
  createMode: z.enum(["custom", "express"]),
});
