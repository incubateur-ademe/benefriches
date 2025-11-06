import { ProjectGenerationCategory } from "shared";

import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectSaveDto } from "../model/reconversionProject";

interface GenerateExpressReconversionProjectUseCase {
  execute(id: Request): Promise<TResult<ReconversionProjectSaveDto, "SiteNotFound">>;
}

interface ReconversionProjectRepository {
  save(reconversionProject: ReconversionProjectSaveDto): Promise<void>;
}

type Request = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  category?: ProjectGenerationCategory;
};

type GenerateAndSaveExpressReconversionProjectResult = TResult<void, "SiteNotFound">;

export class GenerateAndSaveExpressReconversionProjectUseCase
  implements UseCase<Request, GenerateAndSaveExpressReconversionProjectResult>
{
  constructor(
    private readonly generateExpressReconversionProjectUseCase: GenerateExpressReconversionProjectUseCase,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute(props: Request): Promise<GenerateAndSaveExpressReconversionProjectResult> {
    const result = await this.generateExpressReconversionProjectUseCase.execute(props);

    if (result.isFailure()) {
      return fail(result.getError());
    }

    const reconversionProject = result.getData();
    await this.reconversionProjectRepository.save(reconversionProject);

    return success();
  }
}
