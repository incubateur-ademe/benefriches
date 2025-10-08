import { DomainEvent } from "src/shared-kernel/domainEvent";

export type ReconversionCompatibilityEvaluationStartedEvent = DomainEvent<{
  evaluationId: string;
  userId: string;
}>;

export const createReconversionCompatibilityEvaluationStartedEvent = (
  id: string,
  payload: ReconversionCompatibilityEvaluationStartedEvent["payload"],
): ReconversionCompatibilityEvaluationStartedEvent => ({
  id,
  name: "reconversion-compatibility-evaluation.started",
  payload,
});
