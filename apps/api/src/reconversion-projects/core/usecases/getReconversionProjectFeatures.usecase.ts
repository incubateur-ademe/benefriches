import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectFeaturesView } from "../model/reconversionProject";

export interface ReconversionProjectQueryGateway {
  getFeaturesById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectFeaturesView | undefined>;
}

class ReconversionProjectIdRequiredError extends Error {
  constructor() {
    super(`GetReconversionProjectFeaturesUseCase: reconversionProjectId is required`);
    this.name = "ReconversionProjectIdRequiredError";
  }
}

type Request = {
  reconversionProjectId: string;
};

export class GetReconversionProjectFeaturesUseCase
  implements UseCase<Request, ReconversionProjectFeaturesView>
{
  constructor(private readonly reconversionProjectQuery: ReconversionProjectQueryGateway) {}

  async execute({ reconversionProjectId }: Request): Promise<ReconversionProjectFeaturesView> {
    if (!reconversionProjectId) {
      throw new ReconversionProjectIdRequiredError();
    }

    const result = await this.reconversionProjectQuery.getFeaturesById(reconversionProjectId);

    if (!result) throw new Error(`Reconversion project with id ${reconversionProjectId} not found`);
    return result;
  }
}
