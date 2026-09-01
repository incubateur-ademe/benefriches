import { DevelopmentPlanType, SiteCreationMode, SiteNature } from "shared";

import { ReconversionCompatibilityEvaluation } from "src/reconversion-compatibility/core/reconversionCompatibilityEvaluation";

export type SiteEvaluationDataView = {
  siteId: string;
  siteName: string;
  isExpressSite: boolean;
  siteNature: SiteNature;
  siteCreatedBy: string;
  siteCreationMode: SiteCreationMode;
  compatibilityEvaluation?: Pick<
    ReconversionCompatibilityEvaluation,
    "mutafrichesEvaluationId" | "id"
  >;
  reconversionProjects: {
    total: number;
    lastProjects: {
      id: string;
      name: string;
      projectType: DevelopmentPlanType;
      isExpressProject: boolean;
    }[];
  };
};

export interface SiteEvaluationQuery {
  getUserSiteEvaluations(userId: string): Promise<SiteEvaluationDataView[]>;
}
