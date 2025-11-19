import { MutabilityUsage, SiteNature } from "shared";

import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";

export type UserSiteEvaluation = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
  reconversionProjects: {
    total: number;
    lastProjects: {
      id: string;
      name: string;
      projectType: ProjectDevelopmentPlanType;
      isExpressProject: boolean;
    }[];
  };
  compatibilityEvaluation: {
    top3Usages: {
      usage: MutabilityUsage;
      score: number;
      rank: number;
    }[];
  };
};
