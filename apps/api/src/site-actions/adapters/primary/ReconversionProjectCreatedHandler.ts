import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
  RECONVERSION_PROJECT_CREATED,
  type ReconversionProjectCreatedEvent,
} from "src/reconversion-projects/core/events/reconversionProjectCreated.event";
import { SiteActionsQuery } from "src/site-actions/core/gateways/SiteActionsQuery";
import { UpdateSiteActionStatusUseCase } from "src/site-actions/core/usecases/updateSiteActionStatus.usecase";

@Injectable()
export class ReconversionProjectCreatedHandler {
  private readonly logger = new Logger(ReconversionProjectCreatedHandler.name);

  constructor(
    private readonly updateSiteActionStatusUseCase: UpdateSiteActionStatusUseCase,
    private readonly siteActionsQuery: SiteActionsQuery,
  ) {}

  @OnEvent(RECONVERSION_PROJECT_CREATED)
  async handleReconversionProjectCreation(event: ReconversionProjectCreatedEvent): Promise<void> {
    const { siteId } = event.payload;

    const actions = await this.siteActionsQuery.getBySiteId(siteId);

    const action = actions.find(
      (a) => a.actionType === "EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS",
    );

    if (!action) {
      this.logger.warn(
        `No EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS action found for site ${siteId}`,
      );
      return;
    }

    const result = await this.updateSiteActionStatusUseCase.execute({
      siteId,
      actionId: action.id,
      status: "done",
    });

    if (result.isFailure()) {
      this.logger.error(
        `Failed to update site action status for action EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS ${action.id}: ${result.getError()}`,
      );
    }
  }
}
