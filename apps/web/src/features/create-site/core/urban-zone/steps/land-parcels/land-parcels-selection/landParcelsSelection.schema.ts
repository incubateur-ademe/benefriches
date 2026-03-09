import { urbanZoneLandParcelTypeSchema } from "shared";
import z from "zod";

export const landParcelsSelectionSchema = z.object({
  landParcelTypes: z.array(urbanZoneLandParcelTypeSchema).min(1),
});
