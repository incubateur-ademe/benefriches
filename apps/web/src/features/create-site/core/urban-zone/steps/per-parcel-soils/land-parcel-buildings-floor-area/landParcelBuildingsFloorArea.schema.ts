import z from "zod";

export const landParcelBuildingsFloorAreaSchema = z.object({
  buildingsFloorSurfaceArea: z.number().positive(),
});
