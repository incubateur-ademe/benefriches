import { ReconversionCompatibilityEvaluation } from "../reconversionCompatibilityEvaluation";

export interface ReconversionCompatibilityEvaluationRepository {
  existsWithId(id: string): Promise<boolean>;
  save(evaluation: ReconversionCompatibilityEvaluation): Promise<void>;
}
