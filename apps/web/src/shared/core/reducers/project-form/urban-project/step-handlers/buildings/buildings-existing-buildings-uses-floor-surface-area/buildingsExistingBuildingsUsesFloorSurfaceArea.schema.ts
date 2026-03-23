import { urbanProjectBuildingsUseSchema } from "shared";
import z from "zod";

export const buildingsExistingBuildingsUsesFloorSurfaceAreaSchema = z.object({
  existingBuildingsUsesFloorSurfaceArea: z.partialRecord(
    urbanProjectBuildingsUseSchema,
    z.number(),
  ),
});
