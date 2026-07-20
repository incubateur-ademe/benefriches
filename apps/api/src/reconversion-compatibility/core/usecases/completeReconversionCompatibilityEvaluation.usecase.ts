import { DateProvider } from "src/shared-kernel/dateProvider";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UidGenerator } from "src/shared-kernel/uidGenerator";
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

type CompleteReconversionCompatibilityEvaluationResult = TResult<
  void,
  "EvaluationNotFound" | "EvaluationCannotBeCompleted"
>;

export class CompleteReconversionCompatibilityEvaluationUseCase implements UseCase<
  Request,
  CompleteReconversionCompatibilityEvaluationResult
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
    mutafrichesId,
  }: Request): Promise<CompleteReconversionCompatibilityEvaluationResult> {
    const evaluationToComplete = await this.repository.getById(id);

    if (!evaluationToComplete) {
      return fail("EvaluationNotFound");
    }

    if (!canBeCompleted(evaluationToComplete)) {
      return fail("EvaluationCannotBeCompleted");
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
    return success();
  }
}
