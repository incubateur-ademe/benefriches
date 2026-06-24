import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import type { UserAccountCreatedEvent } from "src/auth/core/events/userAccountCreated.event";
import { USER_ACCOUNT_CREATED } from "src/auth/core/events/userAccountCreated.event";
import type { CRMGateway } from "src/marketing/core/CRMGateway";

@Injectable()
export class UserAccountCreatedHandler {
  private readonly logger = new Logger(UserAccountCreatedHandler.name);

  constructor(private readonly crm: CRMGateway) {}

  @OnEvent(USER_ACCOUNT_CREATED)
  async handleUserAccountCreated(event: UserAccountCreatedEvent) {
    try {
      await this.crm.createContact({
        email: event.payload.userEmail,
        firstName: event.payload.userFirstName,
        lastName: event.payload.userLastName,
        subscribedToNewsletter: event.payload.subscribedToNewsletter,
      });
    } catch (err) {
      this.logger.error("CRM createContact failed", err);
    }
  }
}
