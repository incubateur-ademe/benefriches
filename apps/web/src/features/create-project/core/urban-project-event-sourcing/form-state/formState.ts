import { filterObject } from "shared";

import {
  getUrbanProjectSoilsDistributionFromSpaces,
  UrbanSpacesByCategory,
} from "../../urban-project/urbanProjectSoils";
import { FormEvent, SerializedAnswerSetEvent } from "../form-events/FormEvent.type";
import { ANSWER_STEPS, AnswerStepId, FormAnswers } from "../urbanProjectSteps";

export const FormState = {
  getStepAnswers<K extends AnswerStepId>(events: FormEvent[], stepId: K) {
    // Parcours inverse car les événements récents sont à la fin
    // et nous voulons le plus récent
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      if (event && event.stepId === stepId) {
        // Premier match = le plus récent grâce au parcours inverse
        return event.type === "ANSWER_SET"
          ? (event as SerializedAnswerSetEvent<K>).payload
          : undefined;
      }
    }
    return undefined;
  },

  hasLastAnswerFromSystem(events: FormEvent[], stepId: AnswerStepId) {
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      if (event && event.stepId === stepId) {
        return event.type === "ANSWER_SET" ? event.source === "system" : false;
      }
    }
    return false;
  },

  hasBuildings(events: FormEvent[]) {
    const livingAndActivitySpacesDistribution = this.getStepAnswers(
      events,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    return (
      livingAndActivitySpacesDistribution?.BUILDINGS &&
      livingAndActivitySpacesDistribution.BUILDINGS > 0
    );
  },

  hasBuildingsResalePlannedAfterDevelopment(events: FormEvent[]) {
    const buildingsResalePlannedAfterDevelopment = this.getStepAnswers(
      events,
      "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
    )?.buildingsResalePlannedAfterDevelopment;
    return buildingsResalePlannedAfterDevelopment;
  },

  getProjectSoilDistribution(events: FormEvent[]) {
    const spacesCategoriesDistribution = this.getStepAnswers(
      events,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    const publicSpacesDistribution = this.getStepAnswers(
      events,
      "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
    )?.publicSpacesDistribution;

    const greenSpacesDistribution = this.getStepAnswers(
      events,
      "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
    )?.greenSpacesDistribution;

    const livingAndActivitySpacesDistribution = this.getStepAnswers(
      events,
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

  getSpacesDistribution(events: FormEvent[]) {
    const publicSpacesDistribution = this.getStepAnswers(
      events,
      "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
    )?.publicSpacesDistribution;

    const greenSpacesDistribution = this.getStepAnswers(
      events,
      "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
    )?.greenSpacesDistribution;

    const livingAndActivitySpacesDistribution = this.getStepAnswers(
      events,
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

  getProjectData(events: FormEvent[]) {
    const formAnswers = this.getAllFormAnswers(events);

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
      soilsDistribution: this.getProjectSoilDistribution(events),
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
          spacesDistribution: this.getSpacesDistribution(events),
          buildingsFloorAreaDistribution: formAnswers.buildingsUsesDistribution ?? {},
        },
      },
      projectPhase: formAnswers.projectPhase,
      decontaminatedSoilSurface: formAnswers.decontaminatedSurfaceArea,
    };

    return mappedProjectData;
  },

  getAllFormAnswers(events: FormEvent[]) {
    return Array.from(ANSWER_STEPS).reduce<FormAnswers>(
      (acc, stepId) => ({
        ...acc,
        ...this.getStepAnswers(events, stepId),
      }),
      {},
    );
  },
} as const;
