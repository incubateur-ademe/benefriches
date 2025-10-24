import {
  BuildingsUseDistribution,
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  ReconversionProjectSoilsDistribution,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  saveReconversionProjectPropsSchema,
  UrbanProjectPhase,
} from "shared";
import z from "zod";

import {
  ProjectSite,
  ProjectStakeholderStructure,
  Schedule,
} from "@/features/create-project/core/project.types";
import { createProjectFormActions } from "@/shared/core/reducers/project-form/projectForm.actions";
import { createUrbanProjectFormActions } from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";
import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import {
  selectProjectSoilsDistribution,
  selectSiteAddress,
  selectSiteSoilsDistribution,
} from "./updateProject.selectors";

const UPDATE_PROJECT_STORE_KEY = "projectUpdate";

export const makeProjectUpdateActionType = (actionName: string) => {
  return `${UPDATE_PROJECT_STORE_KEY}/${actionName}`;
};

export const updateProjectFormActions = createProjectFormActions(UPDATE_PROJECT_STORE_KEY);
export const updateProjectFormUrbanActions = createUrbanProjectFormActions(
  UPDATE_PROJECT_STORE_KEY,
  {
    selectProjectSoilsDistribution,
    selectSiteAddress,
    selectSiteSoilsDistribution,
  },
);

export type UpdateProjectSavePayload = z.infer<typeof saveReconversionProjectPropsSchema>;
export type UpdateProjectView = {
  projectData: {
    name: string;
    description?: string;
    isExpress: boolean;
    developmentPlan:
      | {
          type: "PHOTOVOLTAIC_POWER_PLANT";
          electricalPowerKWc: number;
          surfaceArea: number;
          expectedAnnualProduction: number;
          contractDuration: number;
          installationCosts: DevelopmentPlanInstallationExpenses[];
          installationSchedule?: Schedule;
          developerName?: string;
        }
      | {
          type: "URBAN_PROJECT";
          developer: {
            name: string;
            structureType: ProjectStakeholderStructure;
          };
          buildingsFloorAreaDistribution: BuildingsUseDistribution;
          installationCosts: DevelopmentPlanInstallationExpenses[];
          installationSchedule?: Schedule;
        };
    soilsDistribution: ReconversionProjectSoilsDistribution;
    futureOwner?: {
      name: string;
      structureType: ProjectStakeholderStructure;
    };
    futureOperator?: {
      name: string;
      structureType: ProjectStakeholderStructure;
    };
    reinstatementContractOwner?: {
      name: string;
      structureType: ProjectStakeholderStructure;
    };
    financialAssistanceRevenues?: FinancialAssistanceRevenue[];
    reinstatementCosts?: ReinstatementExpense[];
    yearlyProjectedExpenses: RecurringExpense[];
    yearlyProjectedRevenues: RecurringRevenue[];
    reinstatementSchedule?: Schedule;
    firstYearOfOperation?: number;
    projectPhase: UrbanProjectPhase;
    sitePurchaseSellingPrice?: number;
    sitePurchasePropertyTransferDuties?: number;
    siteResaleExpectedSellingPrice?: number;
    siteResaleExpectedPropertyTransferDuties?: number;
    buildingsResaleExpectedSellingPrice?: number;
    buildingsResaleExpectedPropertyTransferDuties?: number;
    decontaminatedSoilSurface?: number;
  };
  siteData: ProjectSite;
};
export interface UpdateProjectServiceGateway {
  getById(projectId: string): Promise<UpdateProjectView | undefined>;
  save(projectId: string, payload: UpdateProjectSavePayload): Promise<void>;
}

export const reconversionProjectUpdateInitiated = createAppAsyncThunk<UpdateProjectView, string>(
  makeProjectUpdateActionType("init"),
  async (projectId, { extra }) => {
    const result = await extra.updateProjectService.getById(projectId);

    if (!result) throw new Error("Project not found");

    return result;
  },
);
