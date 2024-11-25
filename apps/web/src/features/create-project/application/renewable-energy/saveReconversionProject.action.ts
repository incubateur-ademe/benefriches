import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { saveProjectSchema } from "../saveReconversionProject.action";

export const saveReconversionProject = createAppAsyncThunk(
  "projectCreation/renewableEnergyProject/save",
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const { renewableEnergyProject, siteData, projectId } = projectCreation;
    const { creationData } = renewableEnergyProject;

    const mappedProjectData = {
      id: projectId,
      name: creationData.name,
      createdBy: currentUser.currentUser?.id,
      description: creationData.description,
      relatedSiteId: siteData?.id,
      futureOperator: creationData.futureOperator,
      futureSiteOwner: creationData.futureSiteOwner,
      reinstatementContractOwner: creationData.reinstatementContractOwner,
      reinstatementCosts: creationData.reinstatementExpenses,
      sitePurchaseSellingPrice: creationData.sitePurchaseSellingPrice,
      sitePurchasePropertyTransferDuties: creationData.sitePurchasePropertyTransferDuties,
      financialAssistanceRevenues: creationData.financialAssistanceRevenues,
      yearlyProjectedCosts: creationData.yearlyProjectedExpenses,
      yearlyProjectedRevenues: creationData.yearlyProjectedRevenues,
      soilsDistribution: creationData.soilsDistribution,
      reinstatementSchedule: creationData.reinstatementSchedule,
      operationsFirstYear: creationData.firstYearOfOperation,
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        developer: creationData.projectDeveloper,
        costs: creationData.photovoltaicPanelsInstallationExpenses ?? [],
        installationSchedule: creationData.photovoltaicInstallationSchedule,
        features: {
          surfaceArea: creationData.photovoltaicInstallationSurfaceSquareMeters,
          electricalPowerKWc: creationData.photovoltaicInstallationElectricalPowerKWc,
          expectedAnnualProduction: creationData.photovoltaicExpectedAnnualProduction,
          contractDuration: creationData.photovoltaicContractDuration,
        },
      },
      projectPhase: creationData.projectPhase,
      decontaminatedSoilSurface: creationData.decontaminatedSurfaceArea,
    };

    const projectToSave = saveProjectSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
