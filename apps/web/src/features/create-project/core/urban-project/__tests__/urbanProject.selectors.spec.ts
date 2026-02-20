import { describe, it, expect } from "vitest";

import { AnswerStepId } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { ProjectCreationState } from "../../createProject.reducer";
import { creationProjectFormSelectors } from "../urbanProject.selectors";
import { mockSiteData } from "./_siteData.mock";
import { createTestStore } from "./_testStoreHelpers";

describe("urbanProject.selectors", () => {
  describe("selectStepAnswers", () => {
    it("should return answer payload if exists", () => {
      const initialSteps = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: {
            usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
          },
        },
      } satisfies ProjectCreationState["urbanProject"]["steps"];

      const store = createTestStore({
        steps: initialSteps,
        currentStep: "URBAN_PROJECT_USES_SELECTION",
      });

      const rootState = store.getState();

      const selector = creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_USES_SELECTION",
      );

      expect(selector(rootState)).toEqual({
        usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
      });
    });

    it("should return undefined when no answer", () => {
      const store = createTestStore({ steps: {} });
      const rootState = store.getState();

      const selector = creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_USES_SELECTION",
      );

      expect(selector(rootState)).toBeUndefined();
    });

    it("should return default answers if exists and no payload answers", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            defaultValues: {
              usesSelection: ["RESIDENTIAL"],
            },
          },
        },
      });
      const rootState = store.getState();
      const selector = creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_USES_SELECTION",
      );

      expect(selector(rootState)).toEqual({
        usesSelection: ["RESIDENTIAL"],
      });
    });

    it("should return payload answers even if there is default answers", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            defaultValues: {
              usesSelection: ["RESIDENTIAL"],
            },
            payload: {
              usesSelection: ["PUBLIC_GREEN_SPACES"],
            },
          },
        },
      });
      const rootState = store.getState();

      const selector = creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_USES_SELECTION" as AnswerStepId,
      );

      expect(selector(rootState)).toEqual({
        usesSelection: ["PUBLIC_GREEN_SPACES"],
      });
    });
  });

  describe("selectProjectSoilsDistributionByType", () => {
    it("should return empty object when there is no space categories filled", () => {
      const store = createTestStore();
      const rootState = store.getState();
      const result = creationProjectFormSelectors.selectProjectSoilsDistributionByType(rootState);

      expect(result).toEqual({});
    });
  });

  describe("selectPublicGreenSpacesSoilsDistributionViewData", () => {
    it("should include constrained soil types from default answers even when not present on site", () => {
      const store = createTestStore({
        siteData: {
          ...mockSiteData,
          soilsDistribution: {
            BUILDINGS: 2250,
            CULTIVATION: 42750,
          },
        },
        steps: {
          URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              publicGreenSpacesSurfaceArea: 45000,
            },
          },
          URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
            completed: true,
            defaultValues: {
              publicGreenSpacesSoilsDistribution: {
                ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 18000,
                ARTIFICIAL_TREE_FILLED: 22500,
                WATER: 4500,
              },
            },
          },
        },
      });

      const rootState = store.getState();
      const result =
        creationProjectFormSelectors.selectPublicGreenSpacesSoilsDistributionViewData(rootState);

      [
        "IMPERMEABLE_SOILS",
        "MINERAL_SOIL",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        "ARTIFICIAL_TREE_FILLED",
        "CULTIVATION",
        "WATER",
      ].forEach((soilType) => {
        expect(result.availableSoilTypes).toContain(soilType);
      });
      expect(result.publicGreenSpacesSoilsDistribution).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 18000,
        ARTIFICIAL_TREE_FILLED: 22500,
        WATER: 4500,
      });
    });
  });
});
