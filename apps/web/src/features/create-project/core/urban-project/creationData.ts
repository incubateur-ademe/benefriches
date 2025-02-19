import {
  BuildingsUse,
  FinancialAssistanceRevenue,
  RecurringExpense,
  ReinstatementExpense,
  SurfaceAreaDistributionJson,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanProjectDevelopmentExpense,
  UrbanProjectPhase,
  UrbanPublicSpace,
  UrbanSpaceCategory,
  YearlyBuildingsOperationsRevenues,
} from "shared";

import { ProjectStakeholder } from "../project.types";

export type UrbanProjectCreationData = {
  name?: string;
  description?: string;
  // spaces and surfaces
  spacesCategories?: UrbanSpaceCategory[];
  spacesCategoriesDistribution?: Partial<Record<UrbanSpaceCategory, number>>;
  greenSpacesDistribution?: Partial<Record<UrbanGreenSpace, number>>;
  livingAndActivitySpacesDistribution?: Partial<Record<UrbanLivingAndActivitySpace, number>>;
  publicSpacesDistribution?: Partial<Record<UrbanPublicSpace, number>>;
  decontaminationPlan?: "partial" | "none" | "unknown";
  decontaminatedSurfaceArea?: number;
  // buildings
  buildingsFloorSurfaceArea?: number;
  buildingsUsesDistribution?: SurfaceAreaDistributionJson<BuildingsUse>;
  // cession foncière
  siteResalePlannedAfterDevelopment?: boolean;
  buildingsResalePlannedAfterDevelopment?: boolean;
  // stakeholders
  projectDeveloper?: ProjectStakeholder;
  reinstatementContractOwner?: ProjectStakeholder;
  futureSiteOwner?: ProjectStakeholder;
  futureOperator?: ProjectStakeholder;
  // site purchase
  sitePurchaseSellingPrice?: number;
  sitePurchasePropertyTransferDuties?: number;
  // expenses
  reinstatementExpenses?: ReinstatementExpense[];
  installationExpenses?: UrbanProjectDevelopmentExpense[];
  yearlyProjectedBuildingsOperationsExpenses?: RecurringExpense[];
  // revenues
  yearlyProjectedRevenues?: YearlyBuildingsOperationsRevenues[];
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  siteResaleExpectedSellingPrice?: number;
  siteResaleExpectedPropertyTransferDuties?: number;
  buildingsResaleSellingPrice?: number;
  buildingsResalePropertyTransferDuties?: number;
  // schedules
  reinstatementSchedule?: {
    startDate: string;
    endDate: string;
  };
  installationSchedule?: {
    startDate: string;
    endDate: string;
  };
  firstYearOfOperation?: number;
  // project phase
  projectPhase?: UrbanProjectPhase;
};
