import z from "zod";

export const buildingsFootprintToReuseSchema = z.object({
  buildingsFootprintToReuse: z.number().nonnegative(),
});
