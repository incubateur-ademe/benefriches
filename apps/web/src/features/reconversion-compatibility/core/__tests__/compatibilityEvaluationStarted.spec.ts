import { describe, expect, it } from "vitest";

import { InMemoryReconversionCompatibilityEvaluationService } from "../../infra/reconversion-compatibility-evaluation/InMemoryReconversionCompatibilityEvaluation";
import { reconversionCompatibilityEvaluationStarted } from "../actions/compatibilityEvaluationStarted.actions";
import { StoreBuilder } from "./testUtils";

describe("Reconversion compatibility evaluation actions: compatibilityEvaluationStarted", () => {
  describe("Error case", () => {
    it("should be in error state when server notification fails", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();
      reconversionCompatibilityEvaluationService.shouldFailOnCall();

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .build();

      await store.dispatch(reconversionCompatibilityEvaluationStarted());

      const state = store.getState();

      expect(state.reconversionCompatibilityEvaluation.currentEvaluationId).toBeUndefined();
      expect(reconversionCompatibilityEvaluationService._startedEvaluations).toHaveLength(0);
      expect(state.reconversionCompatibilityEvaluation.evaluationStartLoadingState).toEqual(
        "error",
      );
      expect(state.reconversionCompatibilityEvaluation.evaluationStartError).toEqual(
        "InMemoryReconversionCompatibilityEvaluationService intended test failure",
      );
    });
  });

  describe("Success case", () => {
    it("should start evaluation and set currentEvaluationId", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .build();

      await store.dispatch(reconversionCompatibilityEvaluationStarted());

      const state = store.getState();

      expect(reconversionCompatibilityEvaluationService._startedEvaluations).toEqual([
        { evaluationId: state.reconversionCompatibilityEvaluation.currentEvaluationId },
      ]);
    });

    it("should reset saveSiteLoadingState and saveSiteError when starting new evaluation", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .withSaveSiteState({ loadingState: "error", error: "Previous error" })
        .build();

      await store.dispatch(reconversionCompatibilityEvaluationStarted());

      const state = store.getState();

      expect(state.reconversionCompatibilityEvaluation.saveSiteLoadingState).toEqual("idle");
      expect(state.reconversionCompatibilityEvaluation.saveSiteError).toBeUndefined();
    });
  });
});
