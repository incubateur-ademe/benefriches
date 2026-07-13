import { soilsDistributionObjToArray } from "shared";

import type { RenewableEnergyStepsState } from "../../step-handlers/stepHandler.type";
import { ReadStateHelper } from "../readState";

/**
 * Reads the per-step wizard state and maps it into the flat reconversion-project
 * data shape submitted to the API. Returns everything derivable from the steps;
 * the save thunk folds in the contextual fields (`id`, `createdBy`, `relatedSiteId`,
 * `projectPhase`) before validating with `httpSaveReconversionProjectPropsSchema`.
 *
 * This reader is the behaviour-level boundary for the creation flow: tests assert on
 * its output rather than on the internal `{ completed, payload }` step shape, so they
 * survive a wizard-engine refactor as long as the submitted payload is unchanged.
 */
export const getProjectData = (steps: RenewableEnergyStepsState) => {
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
  const involvesReinstatementStep = ReadStateHelper.getStepAnswers(
    steps,
    "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
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

  const involvesReinstatement = involvesReinstatementStep?.involvesReinstatement ?? false;

  return {
    name: naming?.name,
    description: naming?.description,
    futureOperator: operator?.futureOperator,
    futureSiteOwner: siteOwner?.futureSiteOwner,
    reinstatementContractOwner: involvesReinstatement
      ? reinstatementOwner?.reinstatementContractOwner
      : undefined,
    reinstatementCosts: involvesReinstatement
      ? reinstatementExpenses?.reinstatementExpenses
      : undefined,
    sitePurchaseSellingPrice: sitePurchase?.sellingPrice,
    sitePurchasePropertyTransferDuties: sitePurchase?.propertyTransferDuties,
    financialAssistanceRevenues: financialAssistance?.financialAssistanceRevenues,
    yearlyProjectedCosts: yearlyExpenses?.yearlyProjectedExpenses,
    yearlyProjectedRevenues: yearlyRevenues?.yearlyProjectedRevenues,
    soilsDistribution: soilsDistributionObjToArray(soilsDistribution),
    reinstatementSchedule: involvesReinstatement ? schedule?.reinstatementSchedule : undefined,
    operationsFirstYear: schedule?.firstYearOfOperation,
    developmentPlan: {
      type: "PHOTOVOLTAIC_POWER_PLANT" as const,
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
    involvesReinstatement,
    decontaminatedSoilSurface:
      decontaminationSurface?.decontaminatedSurfaceArea ??
      decontaminationSelection?.decontaminatedSurfaceArea,
  };
};
