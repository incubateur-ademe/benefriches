import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { saveProjectSchema } from "../saveReconversionProject.action";
import { prefixActionType } from "./urbanProject.actions";
import {
  getUrbanProjectSpaceDistribution,
  selectUrbanProjectSoilsDistribution,
} from "./urbanProject.selectors";

export const saveReconversionProject = createAppAsyncThunk(
  prefixActionType("saveReconversionProject"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const { urbanProject, siteData, projectId } = projectCreation;
    const { creationData } = urbanProject;

    const mappedProjectData = {
      id: projectId,
      name: creationData.name,
      createdBy: currentUser.currentUser?.id,
      description: creationData.description,
      relatedSiteId: siteData?.id,
      reinstatementContractOwner: creationData.reinstatementContractOwner,
      reinstatementCosts: creationData.reinstatementExpenses,
      sitePurchaseSellingPrice: creationData.sitePurchaseSellingPrice,
      sitePurchasePropertyTransferDuties: creationData.sitePurchasePropertyTransferDuties,
      siteResaleExpectedSellingPrice: creationData.siteResaleExpectedSellingPrice,
      siteResaleExpectedPropertyTransferDuties:
        creationData.siteResaleExpectedPropertyTransferDuties,
      financialAssistanceRevenues: creationData.financialAssistanceRevenues,
      yearlyProjectedCosts: creationData.yearlyProjectedExpenses ?? [],
      yearlyProjectedRevenues: creationData.yearlyProjectedRevenues ?? [],
      soilsDistribution: selectUrbanProjectSoilsDistribution(getState()),
      reinstatementSchedule: creationData.reinstatementSchedule,
      operationsFirstYear: creationData.firstYearOfOperation,
      developmentPlan: {
        type: "URBAN_PROJECT",
        developer: creationData.projectDeveloper,
        costs: creationData.installationExpenses ?? [],
        installationSchedule: creationData.installationSchedule,
        features: {
          spacesDistribution: getUrbanProjectSpaceDistribution(getState()),
          buildingsFloorAreaDistribution: creationData.buildingsUsesDistribution ?? {},
        },
      },
      projectPhase: creationData.projectPhase,
      decontaminatedSoilSurface: creationData.decontaminatedSurfaceArea,
    };

    const projectToSave = saveProjectSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
