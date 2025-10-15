import { BaseReconversionProjectFeaturesView, expressProjectCategorySchema } from "shared";
import { z } from "zod";

import { Schedule } from "../project.types";

export const saveExpressProjectSchema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  createdBy: z.string(),
  category: expressProjectCategorySchema,
});

export type ExpressReconversionProjectPayload = z.infer<typeof saveExpressProjectSchema>;
export type ExpressReconversionProjectResult = BaseReconversionProjectFeaturesView<Schedule>;

export interface CreateExpressReconversionProjectGateway {
  get(params: {
    siteId: string;
    createdBy: string;
    category: z.infer<typeof expressProjectCategorySchema>;
  }): Promise<ExpressReconversionProjectResult>;
  save(payload: ExpressReconversionProjectPayload): Promise<void>;
}
