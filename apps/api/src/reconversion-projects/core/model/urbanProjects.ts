import { urbanProjectsFeaturesSchema } from "shared";
import { z } from "zod";

export type UrbanProjectFeatures = z.infer<typeof urbanProjectsFeaturesSchema>;
