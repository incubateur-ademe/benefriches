import { ReconversionCompatibilityEvaluationRepository } from "src/reconversion-compatibility/core/gateways/ReconversionCompatibilityEvaluationRepository";
import { ReconversionCompatibilityEvaluation } from "src/reconversion-compatibility/core/reconversionCompatibilityEvaluation";

export class InMemoryReconversionCompatibilityEvaluationRepository implements ReconversionCompatibilityEvaluationRepository {
  evaluations: ReconversionCompatibilityEvaluation[] = [];

  existsWithId(id: string): Promise<boolean> {
    return Promise.resolve(
      this.evaluations.find((evaluation) => evaluation.id === id) !== undefined,
    );
  }

  getById(id: string): Promise<ReconversionCompatibilityEvaluation | null> {
    const evaluation = this.evaluations.find((evaluation) => evaluation.id === id);
    return Promise.resolve(evaluation ?? null);
  }

  async save(evaluation: ReconversionCompatibilityEvaluation): Promise<void> {
    const existingIndex = this.evaluations.findIndex((e) => e.id === evaluation.id);

    if (existingIndex > -1) {
      await Promise.resolve((this.evaluations[existingIndex] = evaluation));
    } else {
      await Promise.resolve(this.evaluations.push(evaluation));
    }
  }

  _setEvaluations(evaluations: ReconversionCompatibilityEvaluation[]): void {
    this.evaluations = evaluations;
  }
}
