import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import type { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import type { TResult } from "src/shared-kernel/result";
import { fail, success } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import { createReconversionCompatibilityEvaluationCompletedEvent } from "../events/reconversionCompatibilityEvaluationCompleted.event";
import type { ReconversionCompatibilityEvaluationRepository } from "../gateways/ReconversionCompatibilityEvaluationRepository";
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
  constructor(
    private readonly repository: ReconversionCompatibilityEvaluationRepository,
    private readonly dateProvider: DateProvider,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

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
