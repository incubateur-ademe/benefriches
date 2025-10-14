import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectCreatedFromEvaluationEvent } from "../events/reconversionProjectCreatedFromEvaluation.event";
import { ReconversionCompatibilityEvaluationRepository } from "../gateways/ReconversionCompatibilityEvaluationRepository";
import { addProjectCreation } from "../reconversionCompatibilityEvaluation";

type Request = {
  evaluationId: string;
  reconversionProjectId: string;
};

export class AddProjectCreationToReconversionCompatibilityEvaluationUseCase
  implements UseCase<Request, void>
{
  constructor(
    private readonly repository: ReconversionCompatibilityEvaluationRepository,
    private readonly dateProvider: DateProvider,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({ evaluationId, reconversionProjectId }: Request): Promise<void> {
    const evaluation = await this.repository.getById(evaluationId);

    if (!evaluation) {
      throw new Error(`Evaluation with id ${evaluationId} not found`);
    }

    const updatedEvaluation = addProjectCreation(evaluation, {
      reconversionProjectId,
      createdAt: this.dateProvider.now(),
    });

    await this.repository.save(updatedEvaluation);

    const event = createReconversionProjectCreatedFromEvaluationEvent(
      this.uuidGenerator.generate(),
      { evaluationId, reconversionProjectId },
    );

    await this.eventPublisher.publish(event);
  }
}
