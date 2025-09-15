import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
  USER_ACCOUNT_CREATED,
  UserAccountCreatedEvent,
} from "src/auth/core/events/userAccountCreated.event";
import { CRMGateway } from "src/marketing/core/CRMGateway";

@Injectable()
export class UserAccountCreatedHandler {
  constructor(private readonly crm: CRMGateway) {}

  @OnEvent(USER_ACCOUNT_CREATED)
  async handleUserAccountCreated(event: UserAccountCreatedEvent) {
    await this.crm.createContact({
      email: event.payload.userEmail,
      firstName: event.payload.userFirstName,
      lastName: event.payload.userLastName,
      subscribedToNewsletter: event.payload.subscribedToNewsletter,
    });
  }
}
