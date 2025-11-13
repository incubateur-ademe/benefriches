import { EvaluationCompletedPayload } from "../../core/actions/compatibilityEvaluationCompleted.actions";
import { ReconversionCompatibilityEvaluationResults } from "../../core/actions/compatibilityEvaluationResultsRequested.actions";
import { ReconversionCompatibilityEvaluationGateway } from "../../core/actions/reconversionCompatibilityEvaluationGateway";

export class InMemoryReconversionCompatibilityEvaluationService
  implements ReconversionCompatibilityEvaluationGateway
{
  _startedEvaluations: { evaluationId: string }[] = [];
  _completedEvaluations: EvaluationCompletedPayload[] = [];
  _evaluationResults: Map<string, ReconversionCompatibilityEvaluationResults> = new Map();
  private shouldFail = false;

  shouldFailOnCall() {
    this.shouldFail = true;
  }

  setEvaluationResults(
    mutafrichesId: string,
    results: ReconversionCompatibilityEvaluationResults,
  ): void {
    this._evaluationResults.set(mutafrichesId, results);
  }

  async startEvaluation(input: { evaluationId: string }): Promise<void> {
    if (this.shouldFail) {
      throw new Error("InMemoryReconversionCompatibilityEvaluationService intended test failure");
    }
    await Promise.resolve(this._startedEvaluations.push(input));
  }

  async completeEvaluation(payload: EvaluationCompletedPayload): Promise<void> {
    if (this.shouldFail) {
      throw new Error("InMemoryReconversionCompatibilityEvaluationService intended test failure");
    }
    await Promise.resolve(this._completedEvaluations.push(payload));
  }

  async addRelatedSite(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return Promise.resolve();
  }

  async getEvaluationResults(
    mutafrichesId: string,
  ): Promise<ReconversionCompatibilityEvaluationResults | null> {
    if (this.shouldFail) {
      throw new Error("InMemoryReconversionCompatibilityEvaluationService intended test failure");
    }
    return Promise.resolve(this._evaluationResults.get(mutafrichesId) ?? null);
  }
}
