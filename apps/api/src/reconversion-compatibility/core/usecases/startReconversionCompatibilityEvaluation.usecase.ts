import { Injectable } from "@nestjs/common";

import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { type TResult, fail, success } from "src/shared-kernel/result";
import type { UidGenerator } from "src/shared-kernel/uidGenerator";
import type { UseCase } from "src/shared-kernel/usecase";

import { createReconversionCompatibilityEvaluationStartedEvent } from "../events/reconversionCompatibilityEvaluationStarted.event";
import type { ReconversionCompatibilityEvaluationRepository } from "../gateways/ReconversionCompatibilityEvaluationRepository";
import { createReconversionCompatibilityEvaluation } from "../reconversionCompatibilityEvaluation";

type Request = {
  id: string;
  createdById: string;
};

type StartReconversionCompatibilityEvaluationResult = TResult<void, "EvaluationAlreadyExists">;

@Injectable()
export class StartReconversionCompatibilityEvaluationUseCase implements UseCase<
  Request,
  StartReconversionCompatibilityEvaluationResult
> {
  private readonly repository: ReconversionCompatibilityEvaluationRepository;
  private readonly dateProvider: DateProvider;
  private readonly uuidGenerator: UidGenerator;
  private readonly eventPublisher: DomainEventPublisher;
  constructor(
    repository: ReconversionCompatibilityEvaluationRepository,
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
    id,
    createdById,
  }: Request): Promise<StartReconversionCompatibilityEvaluationResult> {
    if (await this.repository.existsWithId(id)) {
      return fail("EvaluationAlreadyExists");
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
    return success();
  }
}
