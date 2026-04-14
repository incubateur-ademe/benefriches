import { surfaceAreaSchema } from "shared";
import z from "zod";

export const siteSurfaceAreaSchema = z.object({
  surfaceArea: surfaceAreaSchema,
});
