import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { SendProjectImpactsSummaryEmailUseCase } from "src/notifications/core/usecases/sendProjectImpactsSummaryEmail.usecase";
import {
  RECONVERSION_PROJECT_CREATED,
  type ReconversionProjectCreatedEvent,
} from "src/reconversion-projects/core/events/reconversionProjectCreated.event";

@Injectable()
export class SendProjectImpactsSummaryOnReconversionProjectCreatedHandler {
  private readonly logger = new Logger(
    SendProjectImpactsSummaryOnReconversionProjectCreatedHandler.name,
  );
  private readonly sendProjectImpactsSummaryEmailUseCase: SendProjectImpactsSummaryEmailUseCase;

  constructor(sendProjectImpactsSummaryEmailUseCase: SendProjectImpactsSummaryEmailUseCase) {
    this.sendProjectImpactsSummaryEmailUseCase = sendProjectImpactsSummaryEmailUseCase;
  }

  // Custom (wizard) and express (template) projects both publish RECONVERSION_PROJECT_CREATED
  // and get this email. Duplicated projects publish "reconversion-project.duplicated" instead
  // and deliberately get none: their author already received the summary of the original, and
  // a duplicate is usually a variant being tried (BEN-12, DESIGN.md "Eligibility rules"). The
  // split looks like an accident of which event each use case publishes; it is a product
  // decision. Do not "fix" it by listening to the duplicated event.
  @OnEvent(RECONVERSION_PROJECT_CREATED)
  async handleReconversionProjectCreated(event: ReconversionProjectCreatedEvent): Promise<void> {
    // RealEventPublisher awaits listeners via emitAsync, so this runs INSIDE the project
    // creation request (POST /api/reconversion-projects or /create-from-template), impacts
    // computation included (accepted for v1). Every error stops here, logged: a failed or slow
    // email must never fail a project creation. This try/catch also covers ledger/DB failures.
    // Escape hatch if express creation gets slow: write a pending ledger row (attempts = 0) and
    // return, letting the hourly sweeper send it (up to ~75 minutes later, see
    // STALE_PENDING_THRESHOLD_MINUTES); no schema change needed.
    try {
      const result = await this.sendProjectImpactsSummaryEmailUseCase.execute({
        reconversionProjectId: event.payload.reconversionProjectId,
        userId: event.payload.createdBy,
      });
      if (result.isFailure()) {
        this.logger.error(
          `Project impacts summary email failed for project ${event.payload.reconversionProjectId} (user ${event.payload.createdBy})`,
        );
      }
    } catch (err) {
      this.logger.error(
        `Project impacts summary email handler failed for project ${event.payload.reconversionProjectId}`,
        err,
      );
    }
  }
}
