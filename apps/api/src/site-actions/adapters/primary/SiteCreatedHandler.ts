import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { InitializeSiteActionsUseCase } from "src/site-actions/core/usecases/initializeSiteActions.usecase";
import { SITE_CREATED, type SiteCreatedEvent } from "src/sites/core/events/siteCreated.event";

@Injectable()
export class SiteCreatedHandler {
  private readonly initializeSiteActionsUseCase: InitializeSiteActionsUseCase;
  constructor(initializeSiteActionsUseCase: InitializeSiteActionsUseCase) {
    this.initializeSiteActionsUseCase = initializeSiteActionsUseCase;
  }

  @OnEvent(SITE_CREATED)
  async handleSiteCreated(event: SiteCreatedEvent): Promise<void> {
    await this.initializeSiteActionsUseCase.execute({
      siteId: event.payload.siteId,
    });
  }
}
