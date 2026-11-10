import type { ImpactsExportFormat, PdfExportSectionSelection } from "shared";

import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UidGenerator } from "src/shared-kernel/uidGenerator";
import { UseCase } from "src/shared-kernel/usecase";

import { createReconversionProjectImpactsExportedEvent } from "../events/reconversionProjectImpactsExported.event";
import { ReconversionProjectRepository } from "../gateways/ReconversionProjectRepository";

type Request = {
  userId: string;
  reconversionProjectId: string;
  format: ImpactsExportFormat;
  sections: PdfExportSectionSelection;
};

type ReportImpactsExportedResult = TResult<void, "ReconversionProjectNotFound">;

// Records that a user downloaded a project's impacts. Not an access check: any authenticated
// user's download is recorded, whether or not they created the project.
export class ReportImpactsExportedUseCase implements UseCase<Request, ReportImpactsExportedResult> {
  private readonly repository: ReconversionProjectRepository;
  private readonly uuidGenerator: UidGenerator;
  private readonly eventPublisher: DomainEventPublisher;
  constructor(
    repository: ReconversionProjectRepository,
    uuidGenerator: UidGenerator,
    eventPublisher: DomainEventPublisher,
  ) {
    this.repository = repository;
    this.uuidGenerator = uuidGenerator;
    this.eventPublisher = eventPublisher;
  }

  async execute({
    userId,
    reconversionProjectId,
    format,
    sections,
  }: Request): Promise<ReportImpactsExportedResult> {
    if (!(await this.repository.existsWithId(reconversionProjectId))) {
      return fail("ReconversionProjectNotFound");
    }

    await this.eventPublisher.publish(
      createReconversionProjectImpactsExportedEvent(this.uuidGenerator.generate(), {
        userId,
        reconversionProjectId,
        format,
        sections,
      }),
    );

    return success();
  }
}
