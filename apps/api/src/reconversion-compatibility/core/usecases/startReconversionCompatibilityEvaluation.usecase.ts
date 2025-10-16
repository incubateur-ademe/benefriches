import { Injectable } from "@nestjs/common";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionCompatibilityEvaluationStartedEvent } from "../events/reconversionCompatibilityEvaluationStarted.event";
import { ReconversionCompatibilityEvaluationRepository } from "../gateways/ReconversionCompatibilityEvaluationRepository";
import { createReconversionCompatibilityEvaluation } from "../reconversionCompatibilityEvaluation";

type Request = {
  id: string;
  createdById: string;
};

@Injectable()
export class StartReconversionCompatibilityEvaluationUseCase implements UseCase<Request, void> {
  constructor(
    private readonly repository: ReconversionCompatibilityEvaluationRepository,
    private readonly dateProvider: DateProvider,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({ id, createdById }: Request): Promise<void> {
    if (await this.repository.existsWithId(id)) {
      throw new Error(`Reconversion compatibility evaluation with id ${id} already exists`);
    }

    const evaluation = createReconversionCompatibilityEvaluation({
      id,
      createdBy: createdById,
      createdAt: this.dateProvider.now(),
    });
    await this.repository.save(evaluation);

    const event = createReconversionCompatibilityEvaluationStartedEvent(
      this.uuidGenerator.generate(),
      {
        evaluationId: id,
        userId: createdById,
      },
    );

    await this.eventPublisher.publish(event);
  }
}
