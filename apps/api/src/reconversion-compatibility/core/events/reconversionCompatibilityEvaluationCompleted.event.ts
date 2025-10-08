import { DomainEvent } from "src/shared-kernel/domainEvent";

export type ReconversionCompatibilityEvaluationCompletedEvent = DomainEvent<{
  evaluationId: string;
  mutafrichesId: string;
}>;

export const createReconversionCompatibilityEvaluationCompletedEvent = (
  id: string,
  payload: ReconversionCompatibilityEvaluationCompletedEvent["payload"],
): ReconversionCompatibilityEvaluationCompletedEvent => ({
  id,
  name: "reconversion-compatibility-evaluation.completed",
  payload,
});
