import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { saveProjectSchema } from "../../actions/saveReconversionProject.action";
import {
  getUrbanProjectSpaceDistribution,
  selectUrbanProjectSoilsDistribution,
} from "../selectors/urbanProject.selectors";
import { makeUrbanProjectCreationActionType } from "./urbanProject.actions";

export const customUrbanProjectSaved = createAppAsyncThunk(
  makeUrbanProjectCreationActionType("customProjectSaved"),
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
      yearlyProjectedCosts: creationData.yearlyProjectedBuildingsOperationsExpenses ?? [],
      yearlyProjectedRevenues: creationData.yearlyProjectedRevenues ?? [],
      soilsDistribution: selectUrbanProjectSoilsDistribution(getState()),
      reinstatementSchedule: creationData.reinstatementSchedule,
      operationsFirstYear: creationData.firstYearOfOperation,
      futureOperator: creationData.futureOperator,
      futureSiteOwner: creationData.futureSiteOwner,
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
