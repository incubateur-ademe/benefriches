import z from "zod";

export const involvesReinstatementSchema = z.object({
  involvesReinstatement: z.boolean(),
});
