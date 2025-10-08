import { filterObject } from "shared";

import { ProjectCreationState } from "../../createProject.reducer";
import {
  getUrbanProjectSoilsDistributionFromSpaces,
  UrbanSpacesByCategory,
} from "../../urban-project/urbanProjectSoils";
import { ANSWER_STEPS, AnswersByStep, AnswerStepId, CustomFormAnswers } from "../urbanProjectSteps";

export const ReadStateHelper = {
  getStep<K extends AnswerStepId = AnswerStepId>(
    steps: ProjectCreationState["urbanProjectBeta"]["steps"],
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
    steps: ProjectCreationState["urbanProjectBeta"]["steps"],
    stepId: K,
  ) {
    return this.getStep(steps, stepId)?.payload;
  },

  getDefaultAnswers<K extends AnswerStepId = AnswerStepId>(
    steps: ProjectCreationState["urbanProjectBeta"]["steps"],
    stepId: K,
  ) {
    return this.getStep(steps, stepId)?.defaultValues;
  },

  hasBuildings(steps: ProjectCreationState["urbanProjectBeta"]["steps"]) {
    const livingAndActivitySpacesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    return (
      livingAndActivitySpacesDistribution?.BUILDINGS &&
      livingAndActivitySpacesDistribution.BUILDINGS > 0
    );
  },

  hasBuildingsResalePlannedAfterDevelopment(
    steps: ProjectCreationState["urbanProjectBeta"]["steps"],
  ) {
    const buildingsResalePlannedAfterDevelopment = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
    )?.buildingsResalePlannedAfterDevelopment;
    return buildingsResalePlannedAfterDevelopment;
  },

  isSiteResalePlannedAfterDevelopment(steps: ProjectCreationState["urbanProjectBeta"]["steps"]) {
    return (
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SITE_RESALE_SELECTION")
        ?.siteResalePlannedAfterDevelopment === true
    );
  },

  getProjectSoilDistribution(steps: ProjectCreationState["urbanProjectBeta"]["steps"]) {
    const spacesCategoriesDistribution = this.getStepAnswers(
      steps,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

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

    if (!spacesCategoriesDistribution) return {};

    const urbanSpacesByCategory: UrbanSpacesByCategory = [];
    if (spacesCategoriesDistribution.GREEN_SPACES) {
      urbanSpacesByCategory.push({
        category: "GREEN_SPACES",
        surfaceArea: spacesCategoriesDistribution.GREEN_SPACES,
        spaces: greenSpacesDistribution ?? {},
      });
    }
    if (spacesCategoriesDistribution.LIVING_AND_ACTIVITY_SPACES) {
      urbanSpacesByCategory.push({
        category: "LIVING_AND_ACTIVITY_SPACES",
        surfaceArea: spacesCategoriesDistribution.LIVING_AND_ACTIVITY_SPACES,
        spaces: livingAndActivitySpacesDistribution ?? {},
      });
    }
    if (spacesCategoriesDistribution.PUBLIC_SPACES) {
      urbanSpacesByCategory.push({
        category: "PUBLIC_SPACES",
        surfaceArea: spacesCategoriesDistribution.PUBLIC_SPACES,
        spaces: publicSpacesDistribution ?? {},
      });
    }
    if (spacesCategoriesDistribution.URBAN_POND_OR_LAKE) {
      urbanSpacesByCategory.push({
        category: "URBAN_POND_OR_LAKE",
        surfaceArea: spacesCategoriesDistribution.URBAN_POND_OR_LAKE,
      });
    }

    const soilsDistribution = getUrbanProjectSoilsDistributionFromSpaces(urbanSpacesByCategory);
    return soilsDistribution.toJSON();
  },

  getSpacesDistribution(steps: ProjectCreationState["urbanProjectBeta"]["steps"]) {
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

  getProjectData(steps: ProjectCreationState["urbanProjectBeta"]["steps"]) {
    const formAnswers = this.getAllFormAnswers(steps);

    const mappedProjectData = {
      name: formAnswers.name,
      description: formAnswers.description,
      reinstepsmentContractOwner: formAnswers.reinstatementContractOwner,
      reinstepsmentCosts: formAnswers.reinstatementExpenses,
      sitePurchaseSellingPrice: formAnswers.sitePurchaseSellingPrice,
      sitePurchasePropertyTransferDuties: formAnswers.sitePurchasePropertyTransferDuties,
      siteResaleExpectedSellingPrice: formAnswers.siteResaleExpectedSellingPrice,
      siteResaleExpectedPropertyTransferDuties:
        formAnswers.siteResaleExpectedPropertyTransferDuties,
      financialAssistanceRevenues: formAnswers.financialAssistanceRevenues,
      yearlyProjectedCosts: formAnswers.yearlyProjectedBuildingsOperationsExpenses ?? [],
      yearlyProjectedRevenues: formAnswers.yearlyProjectedRevenues ?? [],
      soilsDistribution: this.getProjectSoilDistribution(steps),
      reinstepsmentSchedule: formAnswers.reinstatementSchedule,
      operationsFirstYear: formAnswers.firstYearOfOperation,
      futureOperator: formAnswers.futureOperator,
      futureSiteOwner: formAnswers.futureSiteOwner,
      developmentPlan: {
        type: "URBAN_PROJECT",
        developer: formAnswers.projectDeveloper,
        costs: formAnswers.installationExpenses,
        installationSchedule: formAnswers.installationSchedule,
        features: {
          spacesDistribution: this.getSpacesDistribution(steps),
          buildingsFloorAreaDistribution: formAnswers.buildingsUsesDistribution ?? {},
        },
      },
      projectPhase: formAnswers.projectPhase,
      decontaminatedSoilSurface: formAnswers.decontaminatedSurfaceArea,
    };

    return mappedProjectData;
  },

  getAllFormAnswers(steps: ProjectCreationState["urbanProjectBeta"]["steps"]) {
    return Array.from(ANSWER_STEPS).reduce<CustomFormAnswers>(
      (acc, stepId) => ({
        ...acc,
        ...this.getStepAnswers(steps, stepId),
      }),
      {},
    );
  },
} as const;
