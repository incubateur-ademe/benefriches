import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectCreatedFromEvaluationEvent } from "../events/reconversionProjectCreatedFromEvaluation.event";
import { ReconversionCompatibilityEvaluationRepository } from "../gateways/ReconversionCompatibilityEvaluationRepository";
import { addProjectCreation } from "../reconversionCompatibilityEvaluation";

type Request = {
  evaluationId: string;
  reconversionProjectId: string;
};

type AddProjectCreationToReconversionCompatibilityEvaluationResult = TResult<
  void,
  "EvaluationNotFound"
>;

export class AddProjectCreationToReconversionCompatibilityEvaluationUseCase
  implements UseCase<Request, AddProjectCreationToReconversionCompatibilityEvaluationResult>
{
  constructor(
    private readonly repository: ReconversionCompatibilityEvaluationRepository,
    private readonly dateProvider: DateProvider,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({
    evaluationId,
    reconversionProjectId,
  }: Request): Promise<AddProjectCreationToReconversionCompatibilityEvaluationResult> {
    const evaluation = await this.repository.getById(evaluationId);

    if (!evaluation) {
      return fail("EvaluationNotFound");
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
    return success();
  }
}
