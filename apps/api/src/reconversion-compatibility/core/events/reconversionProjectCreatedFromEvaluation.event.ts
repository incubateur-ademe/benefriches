import { DomainEvent } from "src/shared-kernel/domainEvent";

export type ReconversionProjectCreatedFromEvaluationEvent = DomainEvent<{
  evaluationId: string;
  reconversionProjectId: string;
}>;

export const createReconversionProjectCreatedFromEvaluationEvent = (
  id: string,
  payload: ReconversionProjectCreatedFromEvaluationEvent["payload"],
): ReconversionProjectCreatedFromEvaluationEvent => ({
  id,
  name: "reconversion-compatibility-evaluation.project-created",
  payload,
});
