import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionCompatibilityEvaluationCompletedEvent } from "../events/reconversionCompatibilityEvaluationCompleted.event";
import { ReconversionCompatibilityEvaluationRepository } from "../gateways/ReconversionCompatibilityEvaluationRepository";
import {
  canBeCompleted,
  completeReconversionCompatibilityEvaluation,
} from "../reconversionCompatibilityEvaluation";

type Request = {
  id: string;
  mutafrichesId: string;
};

export class CompleteReconversionCompatibilityEvaluationUseCase implements UseCase<Request, void> {
  constructor(
    private readonly repository: ReconversionCompatibilityEvaluationRepository,
    private readonly dateProvider: DateProvider,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({ id, mutafrichesId }: Request): Promise<void> {
    const evaluationToComplete = await this.repository.getById(id);

    if (!evaluationToComplete) {
      throw new Error(`Reconversion compatibility evaluation with id ${id} not found`);
    }

    if (!canBeCompleted(evaluationToComplete)) {
      throw new Error(`Reconversion compatibility evaluation with id ${id} cannot be completed`);
    }

    const evaluation = completeReconversionCompatibilityEvaluation(evaluationToComplete, {
      completedAt: this.dateProvider.now(),
      mutafrichesId,
    });
    await this.repository.save(evaluation);

    const event = createReconversionCompatibilityEvaluationCompletedEvent(
      this.uuidGenerator.generate(),
      { evaluationId: id, mutafrichesId },
    );

    await this.eventPublisher.publish(event);
  }
}
