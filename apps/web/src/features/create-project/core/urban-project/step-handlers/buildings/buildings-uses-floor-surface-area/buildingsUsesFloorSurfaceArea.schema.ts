import { surfaceAreaSchema, urbanProjectBuildingsUseSchema } from "shared";
import z from "zod";

export const buildingsUsesFloorSurfaceAreaSchema = z.object({
  usesFloorSurfaceAreaDistribution: z.partialRecord(
    urbanProjectBuildingsUseSchema,
    surfaceAreaSchema,
  ),
});
