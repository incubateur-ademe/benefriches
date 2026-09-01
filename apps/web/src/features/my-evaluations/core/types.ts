import { MutabilityUsage, SiteNature, SiteNotEditableReason } from "shared";

import { ProjectDevelopmentPlanType } from "@/features/projects/core/projects.types";

export type UserSiteEvaluation = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
  isEditable: boolean;
  notEditableReason: SiteNotEditableReason | null;
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
