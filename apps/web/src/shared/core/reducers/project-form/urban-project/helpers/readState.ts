import {
  doesUseIncludeBuildings,
  getProjectSoilDistributionByType,
  typedObjectEntries,
} from "shared";

import { DEFAULT_FUTURE_SITE_OWNER } from "../../helpers/stakeholders";
import { ProjectFormState } from "../../projectForm.reducer";
import { AnswersByStep, AnswerStepId, UrbanProjectFormData } from "../urbanProjectSteps";

export const ReadStateHelper = {
  getStep<K extends AnswerStepId = AnswerStepId>(
    steps: ProjectFormState["urbanProject"]["steps"],
    stepId: K,
  ) {
    return steps[stepId] as
      | {
          completed: boolean;
          payload?: AnswersByStep[K];
          defaultValues?: AnswersByStep[K];
        }
      | undefined;
  },

  getStepAnswers<K extends AnswerStepId = AnswerStepId>(
    steps: ProjectFormState["urbanProject"]["steps"],
    stepId: K,
  ) {
    return this.getStep(steps, stepId)?.payload;
  },

  getDefaultAnswers<K extends AnswerStepId = AnswerStepId>(
    steps: ProjectFormState["urbanProject"]["steps"],
    stepId: K,
  ) {
    return this.getStep(steps, stepId)?.defaultValues;
  },

  hasUsesWithBuildings(steps: ProjectFormState["urbanProject"]["steps"]) {
    const selectedUses =
      this.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];
    return selectedUses.some((use) => doesUseIncludeBuildings(use));
  },

  hasBuildings(steps: ProjectFormState["urbanProject"]["steps"]) {
    if (this.hasUsesWithBuildings(steps)) {
      return true;
    }

    const livingAndActivitySpacesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    return Boolean(
      livingAndActivitySpacesDistribution?.BUILDINGS &&
      livingAndActivitySpacesDistribution.BUILDINGS > 0,
    );
  },

  hasBuildingsResalePlannedAfterDevelopment(steps: ProjectFormState["urbanProject"]["steps"]) {
    const buildingsResalePlannedAfterDevelopment = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
    )?.buildingsResalePlannedAfterDevelopment;
    return buildingsResalePlannedAfterDevelopment;
  },

  getSiteResaleSelection(steps: ProjectFormState["urbanProject"]["steps"]) {
    return this.getStepAnswers(steps, "URBAN_PROJECT_SITE_RESALE_SELECTION")?.siteResaleSelection;
  },

  isSiteResalePlannedAfterDevelopment(steps: ProjectFormState["urbanProject"]["steps"]) {
    const selection = this.getSiteResaleSelection(steps);
    return selection === "yes" || selection === "unknown";
  },

  isSiteResalePriceEstimated(steps: ProjectFormState["urbanProject"]["steps"]) {
    return this.getSiteResaleSelection(steps) === "unknown";
  },

  getProjectSoilDistribution(steps: ProjectFormState["urbanProject"]["steps"]) {
    const publicGreenSpacesSoilsDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
    )?.publicGreenSpacesSoilsDistribution;

    const spacesSurfaceAreaDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_SPACES_SURFACE_AREA",
    )?.spacesSurfaceAreaDistribution;

    return [
      ...typedObjectEntries(publicGreenSpacesSoilsDistribution ?? {})
        .filter(([, surfaceArea]) => surfaceArea)
        .map(([soilType, surfaceArea = 0]) => ({
          surfaceArea,
          soilType,
          spaceCategory: "PUBLIC_GREEN_SPACE" as const,
        })),
      ...typedObjectEntries(spacesSurfaceAreaDistribution ?? {})
        .filter(([, surfaceArea]) => surfaceArea)
        .map(([soilType, surfaceArea = 0]) => ({
          surfaceArea,
          soilType,
        })),
    ];
  },

  getProjectSoilDistributionBySoilType(steps: ProjectFormState["urbanProject"]["steps"]) {
    return getProjectSoilDistributionByType(this.getProjectSoilDistribution(steps));
  },

  getProjectData(steps: ProjectFormState["urbanProject"]["steps"]): Partial<UrbanProjectFormData> {
    return {
      name: steps.URBAN_PROJECT_NAMING?.payload?.name,
      description: steps.URBAN_PROJECT_NAMING?.payload?.description,
      reinstatementContractOwner:
        steps.URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER?.payload
          ?.reinstatementContractOwner,
      reinstatementCosts:
        steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses,
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
      soilsDistribution: this.getProjectSoilDistribution(steps),
      reinstatementSchedule:
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.reinstatementSchedule,
      operationsFirstYear: steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.firstYearOfOperation,
      futureOperator: steps.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION?.payload?.futureOperator,
      // When site resale is planned, future owner is unknown (will be determined at sale)
      futureSiteOwner: this.isSiteResalePlannedAfterDevelopment(steps)
        ? DEFAULT_FUTURE_SITE_OWNER
        : undefined,
      developmentPlan: {
        type: "URBAN_PROJECT",
        developer: steps.URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER?.payload
          ?.projectDeveloper ?? { structureType: "", name: "" },
        costs: steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.payload?.installationExpenses ?? [],
        installationSchedule:
          steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.installationSchedule,
        features: {
          buildingsFloorAreaDistribution:
            steps.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION?.payload
              ?.buildingsUsesDistribution ?? {},
        },
      },
      projectPhase: steps.URBAN_PROJECT_PROJECT_PHASE?.payload?.projectPhase,
      decontaminatedSoilSurface:
        steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA?.payload?.decontaminatedSurfaceArea,
      buildingsResaleExpectedPropertyTransferDuties:
        steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload
          ?.buildingsResalePropertyTransferDuties,
      buildingsResaleExpectedSellingPrice:
        steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload?.buildingsResaleSellingPrice,
    };
  },
} as const;
