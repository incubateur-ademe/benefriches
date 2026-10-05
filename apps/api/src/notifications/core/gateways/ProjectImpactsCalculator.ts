import type { GetReconversionProjectImpactsResultDto } from "shared";

import type { TResult } from "src/shared-kernel/result";

// Implemented by ComputeReconversionProjectBreakEvenLevelUseCase (reconversion-projects module,
// exported for this): the computation behind GET /api/reconversion-projects/:id/impacts, i.e. the
// data the web Synthèse derives its headlines from. Typed structurally so notifications core does
// not depend on the concrete use case. Computes over 50 years by default.
export interface ProjectImpactsCalculator {
  execute(request: {
    reconversionProjectId: string;
  }): Promise<TResult<GetReconversionProjectImpactsResultDto>>;
}
