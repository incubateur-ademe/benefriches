import { ReconversionCompatibilityEvaluationRepository } from "src/reconversion-compatibility/core/gateways/ReconversionCompatibilityEvaluationRepository";
import { ReconversionCompatibilityEvaluation } from "src/reconversion-compatibility/core/reconversionCompatibilityEvaluation";

export class InMemoryReconversionCompatibilityEvaluationRepository
  implements ReconversionCompatibilityEvaluationRepository
{
  evaluations: ReconversionCompatibilityEvaluation[] = [];

  async existsWithId(id: string): Promise<boolean> {
    return Promise.resolve(
      this.evaluations.find((evaluation) => evaluation.id === id) !== undefined,
    );
  }

  async save(evaluation: ReconversionCompatibilityEvaluation): Promise<void> {
    await Promise.resolve(this.evaluations.push(evaluation));
  }

  _setEvaluations(evaluations: ReconversionCompatibilityEvaluation[]): void {
    this.evaluations = evaluations;
  }
}
