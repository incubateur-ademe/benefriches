import { ReinstatementExpensePurpose, UrbanProjectDevelopmentExpense } from "shared";

import { DEFAULT_FUTURE_SITE_OWNER } from "../../helpers/stakeholders";
import { ProjectFormState } from "../../projectForm.reducer";
import { UrbanProjectCreationStep } from "../urbanProjectSteps";
import { ReadStateHelper } from "./readState";

export const getProjectSummary = (
  steps: ProjectFormState["urbanProject"]["steps"],
  stepsSequence: UrbanProjectCreationStep[],
) => {
  const autoReinstatementCostsValues =
    steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses?.reduce<
      ReinstatementExpensePurpose[]
    >((autos, expense) => {
      const defaultValue =
        steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.defaultValues?.reinstatementExpenses?.find(
          (e) => e.purpose === expense.purpose,
        );
      return expense.amount === defaultValue?.amount ? [...autos, expense.purpose] : autos;
    }, []);

  const autoInstallationCostsValues =
    steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.payload?.installationExpenses?.reduce<
      UrbanProjectDevelopmentExpense["purpose"][]
    >((autos, expense) => {
      const defaultValue =
        steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.defaultValues?.installationExpenses?.find(
          (e) => e.purpose === expense.purpose,
        );
      return expense.amount === defaultValue?.amount ? [...autos, expense.purpose] : autos;
    }, []);

  const { sitePurchaseSellingPrice, sitePurchasePropertyTransferDuties = 0 } =
    steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.payload ?? {};
  const sitePurchaseTotalAmount = sitePurchaseSellingPrice
    ? sitePurchaseSellingPrice + sitePurchasePropertyTransferDuties
    : undefined;

  return {
    name: {
      value: steps.URBAN_PROJECT_NAMING?.payload?.name,
      isAuto:
        steps.URBAN_PROJECT_NAMING?.payload?.name ===
        steps.URBAN_PROJECT_NAMING?.defaultValues?.name,
    },
    description: {
      value: steps.URBAN_PROJECT_NAMING?.payload?.description,
      isAuto:
        steps.URBAN_PROJECT_NAMING?.payload?.description ===
        steps.URBAN_PROJECT_NAMING?.defaultValues?.description,
    },
    reinstatementContractOwner: {
      value:
        steps.URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER?.payload
          ?.reinstatementContractOwner,
      isAuto:
        steps.URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER?.payload
          ?.reinstatementContractOwner ===
        steps.URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER?.defaultValues
          ?.reinstatementContractOwner,
      shouldDisplay: stepsSequence.includes(
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      ),
    },
    reinstatementCosts: {
      value: steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses,
      isAuto: autoReinstatementCostsValues?.length !== 0,
      autoValues: autoReinstatementCostsValues,
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_EXPENSES_REINSTATEMENT"),
    },
    sitePurchaseTotalAmount: {
      value: sitePurchaseTotalAmount,
      isAuto:
        sitePurchaseSellingPrice ===
        steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.defaultValues?.sitePurchaseSellingPrice,
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS"),
    },
    sitePurchasePropertyTransferDuties: {
      value:
        steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.payload
          ?.sitePurchasePropertyTransferDuties,
      isAuto:
        steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.payload
          ?.sitePurchasePropertyTransferDuties ===
        steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.defaultValues
          ?.sitePurchasePropertyTransferDuties,
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS"),
    },
    siteResaleExpectedSellingPrice: {
      value:
        steps.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE?.payload?.siteResaleExpectedSellingPrice,
      isAuto:
        steps.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE?.payload
          ?.siteResaleExpectedSellingPrice ===
        steps.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE?.defaultValues
          ?.siteResaleExpectedSellingPrice,
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"),
    },
    financialAssistanceRevenues: {
      value: steps.URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE?.payload?.financialAssistanceRevenues,
      isAuto:
        steps.URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE?.payload?.financialAssistanceRevenues ===
        steps.URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE?.defaultValues
          ?.financialAssistanceRevenues,
    },
    yearlyProjectedCosts: {
      value:
        steps.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES?.payload
          ?.yearlyProjectedBuildingsOperationsExpenses ?? [],
      isAuto:
        steps.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES?.payload
          ?.yearlyProjectedBuildingsOperationsExpenses ===
        steps.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES?.defaultValues
          ?.yearlyProjectedBuildingsOperationsExpenses,
    },
    yearlyProjectedRevenues: {
      value:
        steps.URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES?.payload
          ?.yearlyProjectedRevenues ?? [],
      isAuto:
        steps.URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES?.payload
          ?.yearlyProjectedRevenues ===
        steps.URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES?.defaultValues
          ?.yearlyProjectedRevenues,
    },
    reinstatementSchedule: {
      value: steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.reinstatementSchedule,
      isAuto:
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.reinstatementSchedule ===
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.defaultValues?.reinstatementSchedule,
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_SCHEDULE_PROJECTION"),
    },
    operationsFirstYear: {
      value: steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.firstYearOfOperation,
      isAuto:
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.firstYearOfOperation ===
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.defaultValues?.firstYearOfOperation,
    },
    futureOperator: {
      value: steps.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION?.payload?.futureOperator,
      isAuto:
        steps.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION?.payload?.futureOperator ===
        steps.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION?.defaultValues?.futureOperator,
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION"),
    },
    futureSiteOwner: {
      // when resale is planned, future owner is unknown
      value: ReadStateHelper.isSiteResalePlannedAfterDevelopment(steps)
        ? DEFAULT_FUTURE_SITE_OWNER
        : undefined,
      isAuto: true, // Always auto-derived from selection
    },
    developer: {
      value: steps.URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER?.payload?.projectDeveloper,
      isAuto:
        steps.URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER?.payload?.projectDeveloper ===
        steps.URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER?.defaultValues?.projectDeveloper,
    },
    installationCosts: {
      value: steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.payload?.installationExpenses ?? [],
      isAuto: autoInstallationCostsValues?.length !== 0,
      autoValues: autoInstallationCostsValues,
    },
    installationSchedule: {
      value: steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.installationSchedule,
      isAuto:
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.installationSchedule ===
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.defaultValues?.installationSchedule,
    },
    buildingsUsesDistribution: {
      value:
        steps.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION?.payload
          ?.buildingsUsesDistribution,
      isAuto:
        steps.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION?.payload
          ?.buildingsUsesDistribution ===
        steps.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION?.defaultValues
          ?.buildingsUsesDistribution,
      shouldDisplay: stepsSequence.includes(
        "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
      ),
    },
    buildingsFloorSurfaceArea: {
      value: steps.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA?.payload?.buildingsFloorSurfaceArea,
      isAuto:
        steps.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA?.payload?.buildingsFloorSurfaceArea ===
        steps.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA?.defaultValues?.buildingsFloorSurfaceArea,
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA"),
    },
    buildingsResaleExpectedSellingPrice: {
      value: steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload?.buildingsResaleSellingPrice,
      isAuto:
        steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload?.buildingsResaleSellingPrice ===
        steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.defaultValues?.buildingsResaleSellingPrice,
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE"),
    },
    projectPhase: {
      value: steps.URBAN_PROJECT_PROJECT_PHASE?.payload?.projectPhase,
      isAuto:
        steps.URBAN_PROJECT_PROJECT_PHASE?.payload?.projectPhase ===
        steps.URBAN_PROJECT_PROJECT_PHASE?.defaultValues?.projectPhase,
    },
    decontaminatedSoilSurface: {
      value:
        steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA?.payload?.decontaminatedSurfaceArea,
      isAuto:
        steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION?.payload?.decontaminationPlan ===
        "unknown",
      shouldDisplay: stepsSequence.includes("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"),
    },
  };
};
