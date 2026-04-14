import { surfaceAreaSchema } from "shared";
import z from "zod";

export const photovoltaicSurfaceSchema = z.object({
  photovoltaicInstallationSurfaceSquareMeters: surfaceAreaSchema,
});
