import { ReconversionProjectTemplate } from "shared";

import type { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import type { UidGenerator } from "src/shared-kernel/uidGenerator";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectCreatedEvent } from "../events/reconversionProjectCreated.event";
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

export class GenerateAndSaveReconversionProjectFromTemplateUseCase implements UseCase<
  Request,
  GenerateAndSaveReconversionProjectFromTemplateResult
> {
  private readonly generateReconversionProjectFromTemplateUseCase: GenerateReconversionProjectFromTemplateUseCase;
  private readonly reconversionProjectRepository: ReconversionProjectRepository;
  private readonly eventPublisher: DomainEventPublisher;
  private readonly uuidGenerator: UidGenerator;
  constructor(
    generateReconversionProjectFromTemplateUseCase: GenerateReconversionProjectFromTemplateUseCase,
    reconversionProjectRepository: ReconversionProjectRepository,
    eventPublisher: DomainEventPublisher,
    uuidGenerator: UidGenerator,
  ) {
    this.generateReconversionProjectFromTemplateUseCase =
      generateReconversionProjectFromTemplateUseCase;
    this.reconversionProjectRepository = reconversionProjectRepository;
    this.eventPublisher = eventPublisher;
    this.uuidGenerator = uuidGenerator;
  }

  async execute(props: Request): Promise<GenerateAndSaveReconversionProjectFromTemplateResult> {
    const result = await this.generateReconversionProjectFromTemplateUseCase.execute(props);

    if (result.isFailure()) {
      return fail(result.getError());
    }

    const reconversionProject = result.getData();
    await this.reconversionProjectRepository.save(reconversionProject);

    await this.eventPublisher.publish(
      createReconversionProjectCreatedEvent(this.uuidGenerator.generate(), {
        reconversionProjectId: props.reconversionProjectId,
        siteId: props.siteId,
        createdBy: props.createdBy,
      }),
    );

    return success();
  }
}
