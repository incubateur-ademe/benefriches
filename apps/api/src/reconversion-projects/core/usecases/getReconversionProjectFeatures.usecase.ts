import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectFeaturesView } from "../model/reconversionProject";

export interface ReconversionProjectQueryGateway {
  getFeaturesById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectFeaturesView | undefined>;
}

type Request = {
  reconversionProjectId: string;
};

type GetReconversionProjectFeaturesResult = TResult<
  ReconversionProjectFeaturesView,
  "ReconversionProjectIdRequired" | "ReconversionProjectNotFound"
>;

export class GetReconversionProjectFeaturesUseCase
  implements UseCase<Request, GetReconversionProjectFeaturesResult>
{
  constructor(private readonly reconversionProjectQuery: ReconversionProjectQueryGateway) {}

  async execute({ reconversionProjectId }: Request): Promise<GetReconversionProjectFeaturesResult> {
    if (!reconversionProjectId) {
      return fail("ReconversionProjectIdRequired");
    }

    const result = await this.reconversionProjectQuery.getFeaturesById(reconversionProjectId);

    if (!result) {
      return fail("ReconversionProjectNotFound");
    }

    return success(result);
  }
}
