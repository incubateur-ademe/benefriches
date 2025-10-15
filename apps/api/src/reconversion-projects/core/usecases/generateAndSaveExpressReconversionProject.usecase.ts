import { ExpressProjectCategory } from "shared";

import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectInput } from "../model/reconversionProject";

export interface GenerateExpressReconversionProjectUseCase {
  execute(id: Request): Promise<ReconversionProjectInput>;
}

interface ReconversionProjectRepository {
  save(reconversionProject: ReconversionProjectInput): Promise<void>;
}

type Request = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  category?: ExpressProjectCategory;
};

export class GenerateAndSaveExpressReconversionProjectUseCase implements UseCase<Request, void> {
  constructor(
    private readonly generateExpressReconversionProjectUseCase: GenerateExpressReconversionProjectUseCase,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute(props: Request): Promise<void> {
    const reconversionProject = await this.generateExpressReconversionProjectUseCase.execute(props);

    await this.reconversionProjectRepository.save(reconversionProject);
  }
}
