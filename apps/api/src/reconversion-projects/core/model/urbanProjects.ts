import type { urbanProjectsFeaturesSchema } from "shared";
import type { z } from "zod";

export type UrbanProjectFeatures = z.infer<typeof urbanProjectsFeaturesSchema>;
