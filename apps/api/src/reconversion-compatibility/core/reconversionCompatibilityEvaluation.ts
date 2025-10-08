export type ReconversionCompatibilityEvaluation = {
  id: string;
  createdBy: string;
  status: "started" | "completed" | "has_projects_created";
  mutafrichesEvaluationId: string | null;
  createdAt: Date;
  completedAt: Date | null;
  projectCreations: { reconversionProjectId: string; createdAt: Date }[];
};

export function createReconversionCompatibilityEvaluation(
  props: Pick<ReconversionCompatibilityEvaluation, "id" | "createdBy" | "createdAt">,
): ReconversionCompatibilityEvaluation {
  return {
    id: props.id,
    createdBy: props.createdBy,
    createdAt: props.createdAt,
    status: "started",
    mutafrichesEvaluationId: null,
    completedAt: null,
    projectCreations: [],
  };
}

export function canBeCompleted(evaluation: ReconversionCompatibilityEvaluation): boolean {
  return evaluation.status === "started";
}

export function completeReconversionCompatibilityEvaluation(
  evaluation: ReconversionCompatibilityEvaluation,
  completionPayload: { mutafrichesId: string; completedAt: Date },
): ReconversionCompatibilityEvaluation {
  return {
    ...evaluation,
    mutafrichesEvaluationId: completionPayload.mutafrichesId,
    completedAt: completionPayload.completedAt,
    status: "completed",
  };
}
