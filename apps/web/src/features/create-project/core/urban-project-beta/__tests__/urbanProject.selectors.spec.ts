import { describe, it, expect } from "vitest";

import { ProjectCreationState } from "../../createProject.reducer";
import { selectProjectSoilDistribution, selectStepAnswers } from "../urbanProject.selectors";
import { AnswerStepId } from "../urbanProjectSteps";
import { createTestStore } from "./_testStoreHelpers";

describe("urbanProject.selectors", () => {
  describe("selectStepAnswers", () => {
    it("should return answer payload if exists", () => {
      const initialSteps = {
        URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
          completed: true,
          payload: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
          },
        },
      } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

      const store = createTestStore({
        steps: initialSteps,
        currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      });

      const rootState = store.getState();

      const selector = selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");

      expect(selector(rootState)).toEqual({
        spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"],
      });
    });

    it("should return undefined when no answer", () => {
      const store = createTestStore({ steps: {} });
      const rootState = store.getState();

      const selector = selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");

      expect(selector(rootState)).toBeUndefined();
    });

    it("should return default answers if exists and no payload answers", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
            completed: true,
            defaultValues: {
              spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
            },
          },
        },
      });
      const rootState = store.getState();
      const selector = selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");

      expect(selector(rootState)).toEqual({
        spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
      });
    });

    it("should return payload answers even if there is default answers", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
            completed: true,
            defaultValues: {
              spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
            },
            payload: {
              spacesCategories: ["GREEN_SPACES"],
            },
          },
        },
      });
      const rootState = store.getState();

      const selector = selectStepAnswers(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION" as AnswerStepId,
      );

      expect(selector(rootState)).toEqual({
        spacesCategories: ["GREEN_SPACES"],
      });
    });
  });

  describe("selectProjectSoilDistribution", () => {
    it("should return empty object when there is no space categories filled", () => {
      const store = createTestStore();
      const rootState = store.getState();
      const result = selectProjectSoilDistribution(rootState);

      expect(result).toEqual({});
    });
  });
});
