import z from "zod";

export const photovoltaicSurfaceSchema = z.object({
  photovoltaicInstallationSurfaceSquareMeters: z.number(),
});
