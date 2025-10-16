import { DomainEvent } from "src/shared-kernel/domainEvent";

const RECONVERSION_COMPATIBILITY_EVALUATION_COMPLETED =
  "reconversion-compatibility-evaluation.completed";

type ReconversionCompatibilityEvaluationCompletedEvent = DomainEvent<
  typeof RECONVERSION_COMPATIBILITY_EVALUATION_COMPLETED,
  {
    evaluationId: string;
    mutafrichesId: string;
  }
>;

export const createReconversionCompatibilityEvaluationCompletedEvent = (
  id: string,
  payload: ReconversionCompatibilityEvaluationCompletedEvent["payload"],
): ReconversionCompatibilityEvaluationCompletedEvent => ({
  id,
  name: RECONVERSION_COMPATIBILITY_EVALUATION_COMPLETED,
  payload,
});
