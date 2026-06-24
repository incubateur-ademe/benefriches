import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import type { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import type { TResult } from "src/shared-kernel/result";
import { fail, success } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectDuplicatedEvent } from "../events/reconversionProjectDuplicated.event";
import type { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import type { ReconversionProjectSaveDto } from "../model/reconversionProject";

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
  constructor(
    private readonly repository: ReconversionProjectRepository,
    private readonly dateProvider: DateProvider,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

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
