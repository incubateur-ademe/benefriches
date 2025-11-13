import { EvaluationCompletedPayload } from "../../core/actions/compatibilityEvaluationCompleted.actions";
import { ReconversionCompatibilityEvaluationResults } from "../../core/actions/compatibilityEvaluationResultsRequested.actions";
import { ReconversionCompatibilityEvaluationGateway } from "../../core/actions/reconversionCompatibilityEvaluationGateway";

export class InMemoryReconversionCompatibilityEvaluationService
  implements ReconversionCompatibilityEvaluationGateway
{
  _startedEvaluations: { evaluationId: string }[] = [];
  _completedEvaluations: EvaluationCompletedPayload[] = [];
  private shouldFail = false;

  shouldFailOnCall() {
    this.shouldFail = true;
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

  async getEvaluationResults(
    _mutafrichesId: string,
  ): Promise<ReconversionCompatibilityEvaluationResults | null> {
    if (this.shouldFail) {
      throw new Error("InMemoryReconversionCompatibilityEvaluationService intended test failure");
    }
    return Promise.resolve(null);
  }
}
