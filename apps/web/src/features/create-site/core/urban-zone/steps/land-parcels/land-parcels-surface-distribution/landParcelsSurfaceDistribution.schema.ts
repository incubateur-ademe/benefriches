import { surfaceAreaSchema, urbanZoneLandParcelTypeSchema } from "shared";
import z from "zod";

// Each selected parcel type gets a surface area (only selected types present)
export const landParcelsSurfaceDistributionSchema = z.object({
  surfaceAreas: z.partialRecord(urbanZoneLandParcelTypeSchema, surfaceAreaSchema),
});
