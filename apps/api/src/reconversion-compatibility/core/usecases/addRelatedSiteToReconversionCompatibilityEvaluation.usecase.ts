import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { createSiteCreatedFromEvaluationEvent } from "../events/siteCreatedFromEvaluation.event";
import { ReconversionCompatibilityEvaluationRepository } from "../gateways/ReconversionCompatibilityEvaluationRepository";
import { addRelatedSite } from "../reconversionCompatibilityEvaluation";

type Request = {
  evaluationId: string;
  relatedSiteId: string;
};

type AddRelatedSiteToReconversionCompatibilityEvaluationResult = TResult<
  void,
  "EvaluationNotFound" | "RelatedSiteAlreadyExists"
>;

export class AddRelatedSiteToReconversionCompatibilityEvaluationUseCase implements UseCase<
  Request,
  AddRelatedSiteToReconversionCompatibilityEvaluationResult
> {
  constructor(
    private readonly repository: ReconversionCompatibilityEvaluationRepository,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({
    evaluationId,
    relatedSiteId,
  }: Request): Promise<AddRelatedSiteToReconversionCompatibilityEvaluationResult> {
    const evaluation = await this.repository.getById(evaluationId);

    if (!evaluation) {
      return fail("EvaluationNotFound");
    }

    if (evaluation.relatedSiteId) {
      return fail("RelatedSiteAlreadyExists");
    }

    const updatedEvaluation = addRelatedSite(evaluation, relatedSiteId);

    await this.repository.save(updatedEvaluation);

    const event = createSiteCreatedFromEvaluationEvent(this.uuidGenerator.generate(), {
      evaluationId,
      relatedSiteId,
    });

    await this.eventPublisher.publish(event);
    return success();
  }
}
