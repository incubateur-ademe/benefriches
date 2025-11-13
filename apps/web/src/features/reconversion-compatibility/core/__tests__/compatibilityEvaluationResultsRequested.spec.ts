import { describe, expect, it } from "vitest";

import { InMemoryReconversionCompatibilityEvaluationService } from "../../infra/reconversion-compatibility-evaluation/InMemoryReconversionCompatibilityEvaluation";
import { reconversionCompatibilityEvaluationResultsRequested } from "../actions/compatibilityEvaluationResultsRequested.actions";
import { buildMockEvaluationResults, StoreBuilder } from "./testUtils";

describe("Reconversion compatibility evaluation actions: compatibilityEvaluationResultsRequested", () => {
  describe("Error cases", () => {
    it("should be in error state when evaluation results not found", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .build();

      await store.dispatch(
        reconversionCompatibilityEvaluationResultsRequested({
          mutafrichesId: "non-existent-id",
        }),
      );

      const state = store.getState();

      expect(state.reconversionCompatibilityEvaluation.evaluationResults).toBeUndefined();
      expect(state.reconversionCompatibilityEvaluation.evaluationResultsLoadingState).toEqual(
        "error",
      );
      expect(state.reconversionCompatibilityEvaluation.evaluationError).toEqual(
        "EVALUATION_NOT_FOUND",
      );
    });

    it("should be in error state when server request fails", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();
      reconversionCompatibilityEvaluationService.shouldFailOnCall();

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .build();

      await store.dispatch(
        reconversionCompatibilityEvaluationResultsRequested({
          mutafrichesId: "test-mutafriches-id",
        }),
      );

      const state = store.getState();

      expect(state.reconversionCompatibilityEvaluation.evaluationResults).toBeUndefined();
      expect(state.reconversionCompatibilityEvaluation.evaluationResultsLoadingState).toEqual(
        "error",
      );
      expect(state.reconversionCompatibilityEvaluation.evaluationError).toEqual(
        "InMemoryReconversionCompatibilityEvaluationService intended test failure",
      );
    });
  });

  describe("Success case", () => {
    it("should fetch and store evaluation results with all data", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();

      const mutafrichesId = "test-mutafriches-id";
      const mockResults = buildMockEvaluationResults({ mutafrichesId });
      reconversionCompatibilityEvaluationService.setEvaluationResults(mutafrichesId, mockResults);

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .build();

      await store.dispatch(reconversionCompatibilityEvaluationResultsRequested({ mutafrichesId }));

      const state = store.getState();

      expect(state.reconversionCompatibilityEvaluation.evaluationResults).toEqual(mockResults);
      expect(state.reconversionCompatibilityEvaluation.evaluationResultsLoadingState).toEqual(
        "success",
      );
      expect(state.reconversionCompatibilityEvaluation.evaluationError).toBeUndefined();
    });
  });
});
