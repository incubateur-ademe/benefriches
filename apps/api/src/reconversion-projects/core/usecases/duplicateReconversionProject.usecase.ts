import { DateProvider } from "src/shared-kernel/dateProvider";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UidGenerator } from "src/shared-kernel/uidGenerator";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectDuplicatedEvent } from "../events/reconversionProjectDuplicated.event";
import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import { ReconversionProjectSaveDto } from "../model/reconversionProject";

type Request = {
  sourceProjectId: string;
  newProjectId: string;
  userId: string;
};

type DuplicateReconversionProjectResult = TResult<
  void,
  "SourceReconversionProjectNotFound" | "UserNotAuthorized"
>;

export class DuplicateReconversionProjectUseCase implements UseCase<
  Request,
  DuplicateReconversionProjectResult
> {
  private readonly repository: ReconversionProjectRepository;
  private readonly dateProvider: DateProvider;
  private readonly uuidGenerator: UidGenerator;
  private readonly eventPublisher: DomainEventPublisher;
  constructor(
    repository: ReconversionProjectRepository,
    dateProvider: DateProvider,
    uuidGenerator: UidGenerator,
    eventPublisher: DomainEventPublisher,
  ) {
    this.repository = repository;
    this.dateProvider = dateProvider;
    this.uuidGenerator = uuidGenerator;
    this.eventPublisher = eventPublisher;
  }

  async execute({
    sourceProjectId,
    newProjectId,
    userId,
  }: Request): Promise<DuplicateReconversionProjectResult> {
    const sourceProject = await this.repository.getById(sourceProjectId);

    if (!sourceProject) return fail("SourceReconversionProjectNotFound");
    if (sourceProject.createdBy !== userId) return fail("UserNotAuthorized");

    const duplicatedProject: ReconversionProjectSaveDto = {
      ...sourceProject,
      id: newProjectId,
      status: "active",
      name: `Copie de ${sourceProject.name}`,
      createdAt: this.dateProvider.now(),
      creationMode: "duplicated",
    };

    await this.repository.save(duplicatedProject);

    const event = createReconversionProjectDuplicatedEvent(this.uuidGenerator.generate(), {
      sourceProjectId,
      newProjectId,
      userId,
    });

    await this.eventPublisher.publish(event);
    return success();
  }
}
