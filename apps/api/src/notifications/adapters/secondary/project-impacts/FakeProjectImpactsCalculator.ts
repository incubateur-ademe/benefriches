import type { GetReconversionProjectImpactsResultDto } from "shared";

import type { ProjectImpactsCalculator } from "src/notifications/core/gateways/ProjectImpactsCalculator";
import { fail, success, type TResult } from "src/shared-kernel/result";

export class FakeProjectImpactsCalculator implements ProjectImpactsCalculator {
  // Project ids, in call order: lets a test check the computation was not run.
  readonly _requests: string[] = [];
  private readonly results = new Map<string, GetReconversionProjectImpactsResultDto>();
  private failure: string | undefined;

  _setResult(projectId: string, result: GetReconversionProjectImpactsResultDto): void {
    this.results.set(projectId, result);
  }

  // Every later call fails with this error.
  _simulateFailure(error: string): void {
    this.failure = error;
  }

  execute({
    reconversionProjectId,
  }: {
    reconversionProjectId: string;
  }): Promise<TResult<GetReconversionProjectImpactsResultDto>> {
    this._requests.push(reconversionProjectId);
    if (this.failure) {
      return Promise.resolve(fail(this.failure));
    }
    const result = this.results.get(reconversionProjectId);
    return Promise.resolve(result ? success(result) : fail("ReconversionProjectNotFound"));
  }
}
