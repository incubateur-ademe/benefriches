import { DomainEvent } from "src/shared-kernel/domainEvent";

const RECONVERSION_COMPATIBILITY_EVALUATION_STARTED =
  "reconversion-compatibility-evaluation.started";

type ReconversionCompatibilityEvaluationStartedEvent = DomainEvent<
  typeof RECONVERSION_COMPATIBILITY_EVALUATION_STARTED,
  {
    evaluationId: string;
    userId: string;
  }
>;

export const createReconversionCompatibilityEvaluationStartedEvent = (
  id: string,
  payload: ReconversionCompatibilityEvaluationStartedEvent["payload"],
): ReconversionCompatibilityEvaluationStartedEvent => ({
  id,
  name: RECONVERSION_COMPATIBILITY_EVALUATION_STARTED,
  payload,
});
