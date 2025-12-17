import {
  filterObject,
  getProjectSoilDistributionByType,
  getSoilTypeForLivingAndActivitySpace,
  getSoilTypeForPublicSpace,
  getSoilTypeForUrbanGreenSpace,
  typedObjectEntries,
} from "shared";

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

  hasBuildings(steps: ProjectFormState["urbanProject"]["steps"]) {
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

  isSiteResalePlannedAfterDevelopment(steps: ProjectFormState["urbanProject"]["steps"]) {
    return (
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SITE_RESALE_SELECTION")
        ?.siteResalePlannedAfterDevelopment === true
    );
  },

  getProjectSoilDistribution(steps: ProjectFormState["urbanProject"]["steps"]) {
    const publicSpacesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
    )?.publicSpacesDistribution;

    const greenSpacesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
    )?.greenSpacesDistribution;

    const livingAndActivitySpacesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    return [
      ...typedObjectEntries(publicSpacesDistribution ?? {})
        .filter(([_, surfaceArea]) => surfaceArea)
        .map(([soil, surfaceArea = 0]) => ({
          surfaceArea,
          soilType: getSoilTypeForPublicSpace(soil),
          spaceCategory: "PUBLIC_SPACE" as const,
        })),
      ...typedObjectEntries(livingAndActivitySpacesDistribution ?? {})
        .filter(([_, surfaceArea]) => surfaceArea)
        .map(([soil, surfaceArea = 0]) => ({
          surfaceArea,
          soilType: getSoilTypeForLivingAndActivitySpace(soil),
          spaceCategory: "LIVING_AND_ACTIVITY_SPACE" as const,
        })),
      ...typedObjectEntries(greenSpacesDistribution ?? {})
        .filter(([_, surfaceArea]) => surfaceArea)
        .map(([soil, surfaceArea = 0]) => ({
          surfaceArea,
          soilType: getSoilTypeForUrbanGreenSpace(soil),
          spaceCategory: "PUBLIC_GREEN_SPACE" as const,
        })),
    ];
  },

  getProjectSoilDistributionBySoilType(steps: ProjectFormState["urbanProject"]["steps"]) {
    return getProjectSoilDistributionByType(this.getProjectSoilDistribution(steps));
  },

  getSpacesDistribution(steps: ProjectFormState["urbanProject"]["steps"]) {
    const publicSpacesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
    )?.publicSpacesDistribution;

    const greenSpacesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
    )?.greenSpacesDistribution;

    const livingAndActivitySpacesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    const publicGreenSpaces =
      (greenSpacesDistribution?.URBAN_POND_OR_LAKE ?? 0) +
      (greenSpacesDistribution?.LAWNS_AND_BUSHES ?? 0) +
      (greenSpacesDistribution?.TREE_FILLED_SPACE ?? 0);

    return filterObject(
      {
        BUILDINGS_FOOTPRINT: livingAndActivitySpacesDistribution?.BUILDINGS,
        PRIVATE_PAVED_ALLEY_OR_PARKING_LOT:
          livingAndActivitySpacesDistribution?.IMPERMEABLE_SURFACE,
        PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: livingAndActivitySpacesDistribution?.PERMEABLE_SURFACE,
        PRIVATE_GARDEN_AND_GRASS_ALLEYS: livingAndActivitySpacesDistribution?.PRIVATE_GREEN_SPACES,
        PUBLIC_GREEN_SPACES: publicGreenSpaces,
        PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS:
          (publicSpacesDistribution?.IMPERMEABLE_SURFACE ?? 0) +
          (greenSpacesDistribution?.PAVED_ALLEY ?? 0),
        PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS:
          (publicSpacesDistribution?.PERMEABLE_SURFACE ?? 0) +
          (greenSpacesDistribution?.GRAVEL_ALLEY ?? 0),
        PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: publicSpacesDistribution?.GRASS_COVERED_SURFACE,
      },
      ([, value]) => !!value && value > 0,
    );
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
      futureSiteOwner: steps.URBAN_PROJECT_SITE_RESALE_SELECTION?.payload?.futureSiteOwner,
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
