import { DomainEvent } from "src/shared-kernel/domainEvent";

const RECONVERSION_PROJECT_CREATED_FROM_EVALUATION =
  "reconversion-compatibility-evaluation.project-created";

type ReconversionProjectCreatedFromEvaluationEvent = DomainEvent<
  typeof RECONVERSION_PROJECT_CREATED_FROM_EVALUATION,
  {
    evaluationId: string;
    reconversionProjectId: string;
  }
>;

export const createReconversionProjectCreatedFromEvaluationEvent = (
  id: string,
  payload: ReconversionProjectCreatedFromEvaluationEvent["payload"],
): ReconversionProjectCreatedFromEvaluationEvent => ({
  id,
  name: RECONVERSION_PROJECT_CREATED_FROM_EVALUATION,
  payload,
});
