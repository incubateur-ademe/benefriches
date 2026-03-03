import z from "zod";

import { soilTypeArraySchema } from "../shared/soils.schema";

export const customSoilsSelectionSchema = z.object({
  futureSoilsSelection: soilTypeArraySchema,
});
