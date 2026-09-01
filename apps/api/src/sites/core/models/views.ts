import {
  DevelopmentPlanType,
  SiteActionType,
  SiteActionStatus,
  MutabilityUsage,
  SiteCreationMode,
  SiteNotEditableReason,
  type GetSiteFeaturesResponseDto,
} from "shared";

export type SiteFeaturesView = GetSiteFeaturesResponseDto;

// SiteViewData is what SitesQuery#getViewById returns: the raw persisted shape, including
// internal fields (createdBy/creationMode) that must never reach the HTTP response.
export type SiteViewData = {
  id: string;
  createdBy: string;
  creationMode: SiteCreationMode;
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
};

// SiteView is what GetSiteViewByIdUseCase returns and the controller serialises: SiteViewData
// minus the internal fields, plus the compatibility evaluation and the editability computed for
// the requesting user.
export type SiteView = Omit<SiteViewData, "createdBy" | "creationMode"> & {
  compatibilityEvaluation: {
    results: {
      usage: MutabilityUsage;
      score: number;
    }[];
    reliabilityScore: number;
  } | null;
  isEditable: boolean;
  notEditableReason: SiteNotEditableReason | null;
};
