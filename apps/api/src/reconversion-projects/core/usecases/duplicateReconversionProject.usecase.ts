import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectDuplicatedEvent } from "../events/reconversionProjectDuplicated.event";
import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";
import { ReconversionProjectInput } from "../model/reconversionProject";

type Request = {
  sourceProjectId: string;
  newProjectId: string;
  userId: string;
};

type SuccessResult = {
  success: true;
};

type ErrorResult = {
  success: false;
  error: "SOURCE_RECONVERSION_PROJECT_NOT_FOUND" | "USER_NOT_AUTHORIZED";
};

type Result = SuccessResult | ErrorResult;

export class DuplicateReconversionProjectUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly repository: ReconversionProjectRepository,
    private readonly dateProvider: DateProvider,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({ sourceProjectId, newProjectId, userId }: Request): Promise<Result> {
    const sourceProject = await this.repository.getById(sourceProjectId);

    if (!sourceProject) return { success: false, error: "SOURCE_RECONVERSION_PROJECT_NOT_FOUND" };
    if (sourceProject.createdBy !== userId) return { success: false, error: "USER_NOT_AUTHORIZED" };

    const duplicatedProject: ReconversionProjectInput = {
      ...sourceProject,
      id: newProjectId,
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
    return { success: true };
  }
}
