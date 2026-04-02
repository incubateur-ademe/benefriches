import { saveReconversionProjectPropsSchema, soilsDistributionObjToArray } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { ReadStateHelper } from "../helpers/readState";
import { makeRenewableEnergyProjectCreationActionType } from "../renewableEnergy.actions";

export const saveReconversionProject = createAppAsyncThunk(
  makeRenewableEnergyProjectCreationActionType("saved"),
  async (_, { getState, extra }) => {
    const { projectCreation, currentUser } = getState();
    const { renewableEnergyProject, siteData, projectId, useCaseSelection } = projectCreation;
    const { steps } = renewableEnergyProject;
    const phase = useCaseSelection.projectPhase;

    const power = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    const surface = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    const production = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
    );
    const contract = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
    );
    const developer = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
    );
    const operator = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    );
    const siteOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
    );
    const reinstatementOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    );
    const reinstatementExpenses = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
    );
    const sitePurchase = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
    );
    const financialAssistance = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
    );
    const yearlyExpenses = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
    );
    const yearlyRevenues = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
    );
    const installation = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );
    const schedule = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_SCHEDULE_PROJECTION");
    const naming = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING");
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );
    const decontaminationSurface = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );

    // Get soils distribution from project selection or custom allocation
    const customAllocation = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
    const projectSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
    );
    const soilsDistribution =
      customAllocation?.soilsDistribution ?? projectSelection?.soilsDistribution ?? {};

    const mappedProjectData = {
      id: projectId,
      name: naming?.name,
      createdBy: currentUser.currentUser?.id,
      description: naming?.description,
      relatedSiteId: siteData?.id,
      futureOperator: operator?.futureOperator,
      futureSiteOwner: siteOwner?.futureSiteOwner,
      reinstatementContractOwner: reinstatementOwner?.reinstatementContractOwner,
      reinstatementCosts: reinstatementExpenses?.reinstatementExpenses,
      sitePurchaseSellingPrice: sitePurchase?.sellingPrice,
      sitePurchasePropertyTransferDuties: sitePurchase?.propertyTransferDuties,
      financialAssistanceRevenues: financialAssistance?.financialAssistanceRevenues,
      yearlyProjectedCosts: yearlyExpenses?.yearlyProjectedExpenses,
      yearlyProjectedRevenues: yearlyRevenues?.yearlyProjectedRevenues,
      soilsDistribution: soilsDistributionObjToArray(soilsDistribution),
      reinstatementSchedule: schedule?.reinstatementSchedule,
      operationsFirstYear: schedule?.firstYearOfOperation,
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        developer: developer?.projectDeveloper,
        costs: installation?.photovoltaicPanelsInstallationExpenses ?? [],
        installationSchedule: schedule?.photovoltaicInstallationSchedule,
        features: {
          surfaceArea: surface?.photovoltaicInstallationSurfaceSquareMeters,
          electricalPowerKWc: power?.photovoltaicInstallationElectricalPowerKWc,
          expectedAnnualProduction: production?.photovoltaicExpectedAnnualProduction,
          contractDuration: contract?.photovoltaicContractDuration,
        },
      },
      projectPhase: phase,
      decontaminatedSoilSurface:
        decontaminationSurface?.decontaminatedSurfaceArea ??
        decontaminationSelection?.decontaminatedSurfaceArea,
    };

    const projectToSave = saveReconversionProjectPropsSchema.parse(mappedProjectData);

    await extra.saveReconversionProjectService.save(projectToSave);
  },
);
