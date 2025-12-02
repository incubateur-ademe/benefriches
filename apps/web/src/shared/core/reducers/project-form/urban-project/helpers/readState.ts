import {
  filterObject,
  getProjectSoilDistributionByType,
  getSoilTypeForLivingAndActivitySpace,
  getSoilTypeForPublicSpace,
  getSoilTypeForUrbanGreenSpace,
  typedObjectEntries,
} from "shared";

import { ProjectFormState } from "../../projectForm.reducer";
import { ANSWER_STEPS, AnswersByStep, AnswerStepId, CustomFormAnswers } from "../urbanProjectSteps";

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

    return (
      livingAndActivitySpacesDistribution?.BUILDINGS &&
      livingAndActivitySpacesDistribution.BUILDINGS > 0
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

  getProjectData(steps: ProjectFormState["urbanProject"]["steps"]) {
    const formAnswers = this.getAllFormAnswers(steps);

    const mappedProjectData = {
      name: formAnswers.name,
      description: formAnswers.description,
      reinstatementContractOwner: formAnswers.reinstatementContractOwner,
      reinstatementCosts: formAnswers.reinstatementExpenses,
      sitePurchaseSellingPrice: formAnswers.sitePurchaseSellingPrice,
      sitePurchasePropertyTransferDuties: formAnswers.sitePurchasePropertyTransferDuties,
      siteResaleExpectedSellingPrice: formAnswers.siteResaleExpectedSellingPrice,
      siteResaleExpectedPropertyTransferDuties:
        formAnswers.siteResaleExpectedPropertyTransferDuties,
      financialAssistanceRevenues: formAnswers.financialAssistanceRevenues,
      yearlyProjectedCosts: formAnswers.yearlyProjectedBuildingsOperationsExpenses ?? [],
      yearlyProjectedRevenues: formAnswers.yearlyProjectedRevenues ?? [],
      soilsDistribution: this.getProjectSoilDistribution(steps),
      reinstatementSchedule: formAnswers.reinstatementSchedule,
      operationsFirstYear: formAnswers.firstYearOfOperation,
      futureOperator: formAnswers.futureOperator,
      futureSiteOwner: formAnswers.futureSiteOwner,
      developmentPlan: {
        type: "URBAN_PROJECT",
        developer: formAnswers.projectDeveloper,
        costs: formAnswers.installationExpenses,
        installationSchedule: formAnswers.installationSchedule,
        features: {
          buildingsFloorAreaDistribution: formAnswers.buildingsUsesDistribution ?? {},
        },
      },
      projectPhase: formAnswers.projectPhase,
      decontaminatedSoilSurface: formAnswers.decontaminatedSurfaceArea,
    };

    return mappedProjectData;
  },

  getAllFormAnswers(steps: ProjectFormState["urbanProject"]["steps"]) {
    return Array.from(ANSWER_STEPS).reduce<CustomFormAnswers>(
      (acc, stepId) => ({
        ...acc,
        ...this.getStepAnswers(steps, stepId),
      }),
      {},
    );
  },
} as const;
