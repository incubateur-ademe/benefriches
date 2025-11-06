import {
  BaseReconversionProjectFeaturesView,
  ProjectGenerationCategory,
  projectGenerationCategorySchema,
} from "shared";
import { z } from "zod";

export const saveExpressProjectSchema = z.object({
  reconversionProjectId: z.string(),
  siteId: z.string(),
  createdBy: z.string(),
  category: projectGenerationCategorySchema,
});

export type ExpressReconversionProjectPayload = z.infer<typeof saveExpressProjectSchema>;
export type ExpressReconversionProjectResult = BaseReconversionProjectFeaturesView;

export interface CreateExpressReconversionProjectGateway {
  get(params: {
    siteId: string;
    createdBy: string;
    category: ProjectGenerationCategory;
  }): Promise<ExpressReconversionProjectResult>;
  save(payload: ExpressReconversionProjectPayload): Promise<void>;
}
