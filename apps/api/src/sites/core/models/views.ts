import {
  DevelopmentPlanType,
  SiteActionType,
  SiteActionStatus,
  MutabilityUsage,
  type GetSiteFeaturesResponseDto,
} from "shared";

export type SiteFeaturesView = GetSiteFeaturesResponseDto;

export type SiteView = {
  id: string;
  features: SiteFeaturesView;
  actions: {
    action: SiteActionType;
    status: SiteActionStatus;
  }[];
  reconversionProjects: {
    id: string;
    name: string;
    type: DevelopmentPlanType;
    express: boolean;
  }[];
  compatibilityEvaluation: {
    results: {
      usage: MutabilityUsage;
      score: number;
    }[];
    reliabilityScore: number;
  } | null;
};
