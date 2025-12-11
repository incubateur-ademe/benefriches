import { describe, expect, it } from "vitest";

import { InMemoryCreateSiteService } from "@/features/create-site/infrastructure/create-site-service/inMemoryCreateSiteApi";
import { buildUser } from "@/features/onboarding/core/user.mock";

import { fricheSavedFromCompatibilityEvaluation } from "../actions/fricheSavedFromCompatibilityEvaluation.actions";
import { buildMockEvaluationResults, StoreBuilder } from "./testUtils";

describe("Reconversion compatibility evaluation actions: fricheSavedFromCompatibilityEvaluation", () => {
  describe("Error cases", () => {
    it("should be in error state when no authenticated user", async () => {
      const evaluationResults = buildMockEvaluationResults();
      const store = new StoreBuilder().withEvaluationResults(evaluationResults).build();

      await store.dispatch(fricheSavedFromCompatibilityEvaluation());

      const state = store.getState();
      expect(state.reconversionCompatibilityEvaluation.saveSiteLoadingState).toEqual("error");
      expect(state.reconversionCompatibilityEvaluation.saveSiteError).toEqual(
        "NO_AUTHENTICATED_USER",
      );
    });

    it("should be in error state when no evaluation results in store", async () => {
      const user = buildUser();
      const store = new StoreBuilder().withCurrentUser(user).build();

      await store.dispatch(fricheSavedFromCompatibilityEvaluation());

      const state = store.getState();
      expect(state.reconversionCompatibilityEvaluation.saveSiteLoadingState).toEqual("error");
      expect(state.reconversionCompatibilityEvaluation.saveSiteError).toEqual(
        "NO_EVALUATION_RESULTS",
      );
    });

    it("should be in error state when no currentEvaluationId in store", async () => {
      const user = buildUser();
      const evaluationResults = buildMockEvaluationResults();

      const store = new StoreBuilder()
        .withCurrentUser(user)
        .withEvaluationResults(evaluationResults)
        .build();

      await store.dispatch(fricheSavedFromCompatibilityEvaluation());

      const state = store.getState();
      expect(state.reconversionCompatibilityEvaluation.saveSiteLoadingState).toEqual("error");
      expect(state.reconversionCompatibilityEvaluation.saveSiteError).toEqual(
        "NO_CURRENT_EVALUATION_ID",
      );
    });

    it("should be in error state when saving friche on server fails", async () => {
      const user = buildUser();
      const evaluationResults = buildMockEvaluationResults();
      const createSiteService = new InMemoryCreateSiteService();
      createSiteService.shouldFailOnCall();

      const store = new StoreBuilder()
        .withCurrentUser(user)
        .withCurrentEvaluationId("id")
        .withEvaluationResults(evaluationResults)
        .withAppDependencies({ createSiteService })
        .build();

      await store.dispatch(fricheSavedFromCompatibilityEvaluation());

      const state = store.getState();
      expect(state.reconversionCompatibilityEvaluation.saveSiteLoadingState).toEqual("error");
      expect(state.reconversionCompatibilityEvaluation.saveSiteError).toEqual(
        "InMemoryCreateSiteService intended test failure",
      );
    });
  });

  describe("Success case", () => {
    it("should save express friche site with all evaluation data correctly mapped", async () => {
      const user = buildUser();
      const evaluationResults = buildMockEvaluationResults({
        evaluationInput: {
          cadastreId: "AB123456",
          city: "Lyon",
          cityCode: "69001",
          surfaceArea: 25000,
          lat: 45.7578,
          long: 4.832,
          buildingsFootprintSurfaceArea: 5000,
          hasContaminatedSoils: true,
        },
        rankedResults: [
          { usage: "photovoltaique", score: 0.92, rank: 1 },
          { usage: "residentiel", score: 0.78, rank: 2 },
          { usage: "industrie", score: 0.65, rank: 3 },
        ],
      });

      const createSiteService = new InMemoryCreateSiteService();
      const store = new StoreBuilder()
        .withCurrentUser(user)
        .withEvaluationResults(evaluationResults)
        .withCurrentEvaluationId("id")
        .withAppDependencies({ createSiteService })
        .build();

      await store.dispatch(fricheSavedFromCompatibilityEvaluation());

      const newState = store.getState();
      expect(newState.reconversionCompatibilityEvaluation.saveSiteLoadingState).toEqual("success");
      expect(newState.reconversionCompatibilityEvaluation.saveSiteError).toBeUndefined();

      expect(createSiteService._expressSites).toHaveLength(1);
      const savedSite = createSiteService._expressSites[0]!;

      expect(savedSite).toEqual({
        id: expect.any(String),
        nature: "FRICHE",
        fricheActivity: "INDUSTRY",
        createdBy: user.id,
        surfaceArea: 25000,
        builtSurfaceArea: 5000,
        hasContaminatedSoils: true,
        address: {
          city: "Lyon",
          cityCode: "69001",
          value: "Lyon",
          long: 4.832,
          lat: 45.7578,
          postCode: "50200",
        },
      });
    });
  });
});
