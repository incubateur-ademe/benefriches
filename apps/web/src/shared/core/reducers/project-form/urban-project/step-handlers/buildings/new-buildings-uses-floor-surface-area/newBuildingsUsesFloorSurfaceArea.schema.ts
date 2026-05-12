import { surfaceAreaSchema, urbanProjectBuildingsUseSchema } from "shared";
import z from "zod";

export const buildingsNewBuildingsUsesFloorSurfaceAreaSchema = z.object({
  newBuildingsUsesFloorSurfaceArea: z.partialRecord(
    urbanProjectBuildingsUseSchema,
    surfaceAreaSchema,
  ),
});
