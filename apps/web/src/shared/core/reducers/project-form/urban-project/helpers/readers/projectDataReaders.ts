import { typedObjectEntries } from "shared";

import { DEFAULT_FUTURE_SITE_OWNER, getFutureOperator } from "../../../helpers/stakeholders";
import type { ProjectFormState } from "../../../projectForm.reducer";
import { EXPENSE_FIELD_TO_PURPOSE } from "../../step-handlers/expenses/expenses-buildings-construction-and-rehabilitation/expensesBuildingsConstructionAndRehabilitation.schema";
import type { UrbanProjectFormData } from "../../urbanProjectSteps";
import { isSiteResalePlannedAfterDevelopment } from "./siteResaleReaders";
import { getProjectSoilDistribution } from "./soilsReaders";

type Steps = ProjectFormState["urbanProject"]["steps"];

function getBuildingsConstructionExpenses(
  steps: Steps,
): { purpose: string; amount: number }[] | undefined {
  const payload = steps.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION?.payload;
  if (!payload) return undefined;

  const expenses: { purpose: string; amount: number }[] = [];
  for (const [key, purpose] of typedObjectEntries(EXPENSE_FIELD_TO_PURPOSE)) {
    const amount = payload[key];
    if (amount !== undefined) {
      expenses.push({ purpose, amount });
    }
  }
  return expenses.length > 0 ? expenses : undefined;
}

export function getProjectData(steps: Steps): Partial<UrbanProjectFormData> {
  return {
    name: steps.URBAN_PROJECT_NAMING?.payload?.name,
    description: steps.URBAN_PROJECT_NAMING?.payload?.description,
    reinstatementContractOwner:
      steps.URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER?.payload
        ?.reinstatementContractOwner,
    reinstatementCosts: steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses,
    sitePurchaseSellingPrice:
      steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.payload?.sitePurchaseSellingPrice,
    sitePurchasePropertyTransferDuties:
      steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.payload
        ?.sitePurchasePropertyTransferDuties,
    siteResaleExpectedSellingPrice:
      steps.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE?.payload?.siteResaleExpectedSellingPrice,
    siteResaleExpectedPropertyTransferDuties:
      steps.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE?.payload
        ?.siteResaleExpectedPropertyTransferDuties,
    financialAssistanceRevenues:
      steps.URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE?.payload?.financialAssistanceRevenues,
    yearlyProjectedCosts:
      steps.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES?.payload
        ?.yearlyProjectedBuildingsOperationsExpenses ?? [],
    yearlyProjectedRevenues:
      steps.URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES?.payload
        ?.yearlyProjectedRevenues ?? [],
    soilsDistribution: getProjectSoilDistribution(steps),
    reinstatementSchedule: steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.reinstatementSchedule,
    operationsFirstYear: steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.firstYearOfOperation,
    futureOperator:
      steps.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION?.payload
        ?.buildingsResalePlannedAfterDevelopment !== undefined
        ? getFutureOperator(
            steps.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION.payload
              .buildingsResalePlannedAfterDevelopment,
            steps.URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER?.payload?.projectDeveloper,
          )
        : undefined,
    // When site resale is planned, future owner is unknown (will be determined at sale)
    futureSiteOwner: isSiteResalePlannedAfterDevelopment(steps)
      ? DEFAULT_FUTURE_SITE_OWNER
      : undefined,
    developmentPlan: {
      type: "URBAN_PROJECT",
      developer: steps.URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER?.payload?.projectDeveloper ?? {
        structureType: "",
        name: "",
      },
      costs: steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.payload?.installationExpenses ?? [],
      installationSchedule: steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.installationSchedule,
      features: {
        buildingsFloorAreaDistribution:
          steps.URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA?.payload
            ?.usesFloorSurfaceAreaDistribution ?? {},
      },
    },
    decontaminatedSoilSurface:
      steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA?.payload?.decontaminatedSurfaceArea,
    buildingsResaleExpectedPropertyTransferDuties:
      steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload?.buildingsResalePropertyTransferDuties,
    buildingsResaleExpectedSellingPrice:
      steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload?.buildingsResaleSellingPrice,
    // buildings reuse and construction
    buildingsFootprintToReuse:
      steps.URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE?.payload?.buildingsFootprintToReuse,
    existingBuildingsUsesFloorSurfaceArea:
      steps.URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA?.payload
        ?.existingBuildingsUsesFloorSurfaceArea,
    newBuildingsUsesFloorSurfaceArea:
      steps.URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA?.payload
        ?.newBuildingsUsesFloorSurfaceArea,
    developerWillBeBuildingsConstructor:
      steps.URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER?.payload
        ?.developerWillBeBuildingsConstructor,
    buildingsConstructionAndRehabilitationExpenses: getBuildingsConstructionExpenses(steps),
  };
}
