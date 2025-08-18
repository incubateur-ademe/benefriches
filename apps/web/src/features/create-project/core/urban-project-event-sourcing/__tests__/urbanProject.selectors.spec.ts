import { describe, it, expect } from "vitest";

import {
  FormEvent,
  SerializedAnswerDeletionEvent,
  SerializedAnswerSetEvent,
} from "../form-events/FormEvent.type";
import {
  selectProjectData,
  selectProjectSoilDistribution,
  selectStepAnswers,
} from "../urbanProject.selectors";
import { AnswersByStep, AnswerStepId } from "../urbanProjectSteps";
import { createTestStore } from "./_testStoreHelpers";

const createAnswerEvent = <T extends AnswerStepId>(
  stepId: T,
  payload: AnswersByStep[T],
  timestamp: number = Date.now(),
  source: "user" | "system" = "user",
): SerializedAnswerSetEvent<T> => ({
  stepId,
  type: "ANSWER_SET",
  payload,
  timestamp,
  source,
});

const createDeletionEvent = <T extends AnswerStepId>(
  stepId: T,
  timestamp: number = Date.now(),
  source: "user" | "system" = "user",
): SerializedAnswerDeletionEvent<T> => ({
  stepId,
  type: "ANSWER_DELETED",
  timestamp,
  source,
});

describe("urbanProject.selectors", () => {
  describe("selectStepAnswers", () => {
    it("should return the most recent answer when no deletion", () => {
      const events: FormEvent[] = [
        createAnswerEvent("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION", {
          spacesCategories: ["GREEN_SPACES"],
        }),
        createAnswerEvent("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION", {
          spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
        }),
      ];

      const store = createTestStore({ events });
      const rootState = store.getState();

      const selector = selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");

      expect(selector(rootState)).toEqual({
        spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
      });
    });

    it("should return undefined when answer is deleted", () => {
      const events: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          {
            spacesCategories: ["GREEN_SPACES"],
          },
          1000,
        ),
        createDeletionEvent("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION", 2000),
      ];

      const store = createTestStore({ events });
      const rootState = store.getState();

      const selector = selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");

      expect(selector(rootState)).toBeUndefined();
    });

    it("should return answer after deletion if re-answered", () => {
      const events: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          {
            spacesCategories: ["GREEN_SPACES"],
          },
          1000,
        ),
        createDeletionEvent("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION", 2000),
        createAnswerEvent(
          "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          {
            spacesCategories: ["PUBLIC_SPACES"],
          },
          3000,
        ),
      ];

      const store = createTestStore({ events });
      const rootState = store.getState();
      const selector = selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");

      expect(selector(rootState)).toEqual({
        spacesCategories: ["PUBLIC_SPACES"],
      });
    });

    it("should handle multiple deletions correctly", () => {
      const events: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
          {
            buildingsFloorSurfaceArea: 1000,
          },
          1000,
        ),
        createAnswerEvent(
          "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          {
            buildingsUsesDistribution: { RESIDENTIAL: 800, LOCAL_SERVICES: 200 },
          },
          1500,
        ),
        // Suppression des réponses liées aux bâtiments
        createDeletionEvent("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA", 2000),
        createDeletionEvent("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION", 2000),
      ];
      const store = createTestStore({ events });
      const rootState = store.getState();

      const floorAreaSelector = selectStepAnswers("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA");
      const floorAreaResult = floorAreaSelector(rootState);

      const useDistributionSelector = selectStepAnswers(
        "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
      );
      const useDistributionResult = useDistributionSelector(rootState);

      expect(floorAreaResult).toBeUndefined();
      expect(useDistributionResult).toBeUndefined();
    });

    it("should return undefined for informational steps", () => {
      const events: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          {
            spacesCategories: ["GREEN_SPACES"],
          },
          1000,
        ),
      ];

      const store = createTestStore({ events });
      const rootState = store.getState();

      const selector = selectStepAnswers(
        "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" as AnswerStepId,
      );
      const result = selector(rootState);

      expect(result).toBeUndefined();
    });
  });

  describe("selectProjectData", () => {
    it("should handle deleted answers in project data compilation", () => {
      const events: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_NAMING",
          {
            name: "Test Project",
            description: "Test Description",
          },
          1000,
        ),
        createAnswerEvent(
          "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          {
            sitePurchaseSellingPrice: 100000,
            sitePurchasePropertyTransferDuties: 5000,
          },
          1500,
        ),
        createAnswerEvent(
          "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          {
            siteResaleExpectedSellingPrice: 150000,
            siteResaleExpectedPropertyTransferDuties: 7500,
          },
          2000,
        ),
        createDeletionEvent("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE", 2500),
      ];

      const store = createTestStore({ events });
      const rootState = store.getState();

      const result = selectProjectData(rootState);

      expect(result.name).toBe("Test Project");
      expect(result.description).toBe("Test Description");
      expect(result.sitePurchaseSellingPrice).toBe(100000);
      expect(result.sitePurchasePropertyTransferDuties).toBe(5000);
      expect(result.siteResaleExpectedSellingPrice).toBeUndefined();
      expect(result.siteResaleExpectedPropertyTransferDuties).toBeUndefined();
    });

    it("should return empty arrays for deleted yearly data", () => {
      const events: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
          {
            yearlyProjectedBuildingsOperationsExpenses: [{ purpose: "maintenance", amount: 50000 }],
          },
          1000,
        ),
        createAnswerEvent(
          "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          {
            yearlyProjectedRevenues: [{ source: "other", amount: 120000 }],
          },
          1500,
        ),
        createDeletionEvent("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES", 2000),
        createDeletionEvent("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES", 2000),
      ];

      const store = createTestStore({ events });
      const rootState = store.getState();

      const result = selectProjectData(rootState);

      expect(result.yearlyProjectedCosts).toEqual([]);
      expect(result.yearlyProjectedRevenues).toEqual([]);
    });

    it("should handle deleted soil distribution data", () => {
      const events: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
          {
            spacesCategoriesDistribution: { GREEN_SPACES: 5000 },
          },
          1000,
        ),
        createAnswerEvent(
          "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
          {
            greenSpacesDistribution: { LAWNS_AND_BUSHES: 3000, TREE_FILLED_SPACE: 2000 },
          },
          1500,
        ),
        // Suppression de la distribution des espaces verts
        createDeletionEvent("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION", 2000),
      ];

      const store = createTestStore({ events });
      const rootState = store.getState();
      const result = selectProjectData(rootState);

      expect(result.soilsDistribution).toEqual({});
    });
  });

  describe("selectProjectSoilDistribution", () => {
    it("should return empty object when space categories are deleted", () => {
      const events: FormEvent[] = [
        createAnswerEvent(
          "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
          {
            spacesCategoriesDistribution: { GREEN_SPACES: 5000, PUBLIC_SPACES: 3000 },
          },
          1000,
        ),
        createAnswerEvent(
          "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
          {
            greenSpacesDistribution: { LAWNS_AND_BUSHES: 3000, TREE_FILLED_SPACE: 2000 },
          },
          1500,
        ),
        createAnswerEvent(
          "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
          {
            publicSpacesDistribution: { IMPERMEABLE_SURFACE: 2000, PERMEABLE_SURFACE: 1000 },
          },
          2000,
        ),
        // Suppression des catégories d'espaces
        createDeletionEvent("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA", 2500),
      ];
      const store = createTestStore({ events });
      const rootState = store.getState();
      const result = selectProjectSoilDistribution(rootState);

      expect(result).toEqual({});
    });
  });
});
