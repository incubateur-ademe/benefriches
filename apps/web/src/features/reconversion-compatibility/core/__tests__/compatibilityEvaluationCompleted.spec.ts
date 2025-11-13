import { describe, expect, it } from "vitest";

import { InMemoryReconversionCompatibilityEvaluationService } from "../../infra/reconversion-compatibility-evaluation/InMemoryReconversionCompatibilityEvaluation";
import { reconversionCompatibilityEvaluationCompleted } from "../actions/compatibilityEvaluationCompleted.actions";
import { StoreBuilder } from "./testUtils";

describe("Reconversion compatibility evaluation actions: compatibilityEvaluationCompleted", () => {
  describe("Error cases", () => {
    it("should be in error state when no current evaluation ID", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .build();

      await store.dispatch(
        reconversionCompatibilityEvaluationCompleted({ mutafrichesId: "test-mutafriches-id" }),
      );

      const state = store.getState();

      expect(reconversionCompatibilityEvaluationService._completedEvaluations).toHaveLength(0);
      expect(state.reconversionCompatibilityEvaluation.evaluationCompletedLoadingState).toEqual(
        "error",
      );
      expect(state.reconversionCompatibilityEvaluation.evaluationCompletedError).toEqual(
        "EVALUATION_NOT_FOUND",
      );
    });

    it("should be in error state when server notification fails", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();
      reconversionCompatibilityEvaluationService.shouldFailOnCall();

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .withCurrentEvaluationId("test-evaluation-id")
        .build();

      await store.dispatch(
        reconversionCompatibilityEvaluationCompleted({ mutafrichesId: "test-mutafriches-id" }),
      );

      const state = store.getState();

      expect(reconversionCompatibilityEvaluationService._completedEvaluations).toHaveLength(0);
      expect(state.reconversionCompatibilityEvaluation.evaluationCompletedLoadingState).toEqual(
        "error",
      );
      expect(state.reconversionCompatibilityEvaluation.evaluationCompletedError).toEqual(
        "InMemoryReconversionCompatibilityEvaluationService intended test failure",
      );
    });
  });

  describe("Success case", () => {
    it("should complete evaluation and notify server with evaluation ID and mutafriches ID", async () => {
      const reconversionCompatibilityEvaluationService =
        new InMemoryReconversionCompatibilityEvaluationService();

      const evaluationId = "test-evaluation-id";
      const mutafrichesId = "test-mutafriches-id";

      const store = new StoreBuilder()
        .withAppDependencies({ reconversionCompatibilityEvaluationService })
        .withCurrentEvaluationId(evaluationId)
        .build();

      await store.dispatch(reconversionCompatibilityEvaluationCompleted({ mutafrichesId }));

      const state = store.getState();

      expect(reconversionCompatibilityEvaluationService._completedEvaluations).toEqual([
        { id: evaluationId, mutafrichesId },
      ]);
      expect(state.reconversionCompatibilityEvaluation.evaluationCompletedLoadingState).toEqual(
        "success",
      );
      expect(state.reconversionCompatibilityEvaluation.evaluationCompletedError).toBeUndefined();
    });
  });
});
