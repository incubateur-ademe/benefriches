import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
  SITE_CREATED_FROM_EVALUATION,
  type SiteCreatedFromEvaluationEvent,
} from "src/reconversion-compatibility/core/events/siteCreatedFromEvaluation.event";
import { SiteActionsQuery } from "src/site-actions/core/gateways/SiteActionsQuery";
import { UpdateSiteActionStatusUseCase } from "src/site-actions/core/usecases/updateSiteActionStatus.usecase";

@Injectable()
export class SiteCreatedFromEvaluationHandler {
  private readonly logger = new Logger(SiteCreatedFromEvaluationHandler.name);

  constructor(
    private readonly updateSiteActionStatusUseCase: UpdateSiteActionStatusUseCase,
    private readonly siteActionsQuery: SiteActionsQuery,
  ) {}

  @OnEvent(SITE_CREATED_FROM_EVALUATION)
  async handleSiteCreatedFromEvaluation(event: SiteCreatedFromEvaluationEvent): Promise<void> {
    const { relatedSiteId } = event.payload;

    const actions = await this.siteActionsQuery.getBySiteId(relatedSiteId);

    const action = actions.find((a) => a.actionType === "EVALUATE_COMPATIBILITY");

    if (!action) {
      this.logger.warn(`No EVALUATE_COMPATIBILITY action found for site ${relatedSiteId}`);
      return;
    }

    const result = await this.updateSiteActionStatusUseCase.execute({
      siteId: relatedSiteId,
      actionId: action.id,
      status: "done",
    });

    if (result.isFailure()) {
      this.logger.error(
        `Failed to update site action status for action EVALUATE_COMPATIBILITY ${action.id}: ${result.getError()}`,
      );
    }
  }
}
