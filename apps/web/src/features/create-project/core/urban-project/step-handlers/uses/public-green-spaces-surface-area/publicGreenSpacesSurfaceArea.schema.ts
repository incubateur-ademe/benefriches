import { surfaceAreaSchema } from "shared";
import z from "zod";

export const publicGreenSpacesSurfaceAreaSchema = z.object({
  publicGreenSpacesSurfaceArea: surfaceAreaSchema,
});
