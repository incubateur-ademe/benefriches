import { DEFAULT_FUTURE_SITE_OWNER } from "../../../helpers/stakeholders";
import type { ProjectFormState } from "../../../projectForm.reducer";
import type { UrbanProjectFormData } from "../../urbanProjectSteps";
import { isSiteResalePlannedAfterDevelopment } from "./siteResaleReaders";
import { getProjectSoilDistribution } from "./soilsReaders";

type Steps = ProjectFormState["urbanProject"]["steps"];

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
    futureOperator: steps.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION?.payload?.futureOperator,
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
    projectPhase: steps.URBAN_PROJECT_PROJECT_PHASE?.payload?.projectPhase,
    decontaminatedSoilSurface:
      steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA?.payload?.decontaminatedSurfaceArea,
    buildingsResaleExpectedPropertyTransferDuties:
      steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload?.buildingsResalePropertyTransferDuties,
    buildingsResaleExpectedSellingPrice:
      steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload?.buildingsResaleSellingPrice,
  };
}
