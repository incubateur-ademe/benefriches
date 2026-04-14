import { surfaceAreaSchema } from "shared";
import z from "zod";

export const buildingsFootprintToReuseSchema = z.object({
  buildingsFootprintToReuse: surfaceAreaSchema,
});
