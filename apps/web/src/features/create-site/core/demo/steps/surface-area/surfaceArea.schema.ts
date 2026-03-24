import z from "zod";

export const siteSurfaceAreaSchema = z.object({
  surfaceArea: z.number().nonnegative(),
});
