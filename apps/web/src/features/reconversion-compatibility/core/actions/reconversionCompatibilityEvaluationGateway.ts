import { EvaluationCompletedPayload } from "./compatibilityEvaluationCompleted.actions";
import { ReconversionCompatibilityEvaluationResults } from "./compatibilityEvaluationResultsRequested.actions";

export interface ReconversionCompatibilityEvaluationGateway {
  startEvaluation(input: { evaluationId: string }): Promise<void>;
  completeEvaluation(payload: EvaluationCompletedPayload): Promise<void>;
  getEvaluationResults(
    mutafrichesId: string,
  ): Promise<ReconversionCompatibilityEvaluationResults | null>;
}
