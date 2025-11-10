import { ReconversionProjectTemplate } from "shared";

import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { ReconversionProjectSaveDto } from "../model/reconversionProject";

interface GenerateReconversionProjectFromTemplateUseCase {
  execute(id: Request): Promise<TResult<ReconversionProjectSaveDto, "SiteNotFound">>;
}

interface ReconversionProjectRepository {
  save(reconversionProject: ReconversionProjectSaveDto): Promise<void>;
}

type Request = {
  reconversionProjectId: string;
  siteId: string;
  createdBy: string;
  template?: ReconversionProjectTemplate;
};

type GenerateAndSaveReconversionProjectFromTemplateResult = TResult<void, "SiteNotFound">;

export class GenerateAndSaveReconversionProjectFromTemplateUseCase
  implements UseCase<Request, GenerateAndSaveReconversionProjectFromTemplateResult>
{
  constructor(
    private readonly generateReconversionProjectFromTemplateUseCase: GenerateReconversionProjectFromTemplateUseCase,
    private readonly reconversionProjectRepository: ReconversionProjectRepository,
  ) {}

  async execute(props: Request): Promise<GenerateAndSaveReconversionProjectFromTemplateResult> {
    const result = await this.generateReconversionProjectFromTemplateUseCase.execute(props);

    if (result.isFailure()) {
      return fail(result.getError());
    }

    const reconversionProject = result.getData();
    await this.reconversionProjectRepository.save(reconversionProject);

    return success();
  }
}
