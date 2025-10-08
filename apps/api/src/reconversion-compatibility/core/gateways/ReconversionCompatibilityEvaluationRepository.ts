import { ReconversionCompatibilityEvaluation } from "../reconversionCompatibilityEvaluation";

export interface ReconversionCompatibilityEvaluationRepository {
  existsWithId(id: string): Promise<boolean>;
  getById(id: string): Promise<ReconversionCompatibilityEvaluation | null>;
  save(evaluation: ReconversionCompatibilityEvaluation): Promise<void>;
}
