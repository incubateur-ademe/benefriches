import { surfaceAreaSchema } from "shared";
import z from "zod";

export const landParcelBuildingsFloorAreaSchema = z.object({
  buildingsFloorSurfaceArea: surfaceAreaSchema,
});
