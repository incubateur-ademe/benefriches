import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
  LOGIN_SUCCEEDED,
  type LoginSucceededEvent,
} from "src/auth/core/events/loginSucceeded.event";
import type { CRMGateway } from "src/marketing/core/CRMGateway";
import type { DateProvider } from "src/shared-kernel/dateProvider";

@Injectable()
export class LoginSucceededHandler {
  private readonly logger = new Logger(LoginSucceededHandler.name);

  private readonly crm: CRMGateway;
  private readonly dateProvider: DateProvider;
  constructor(crm: CRMGateway, dateProvider: DateProvider) {
    this.crm = crm;
    this.dateProvider = dateProvider;
  }

  @OnEvent(LOGIN_SUCCEEDED)
  async handleLoginSucceeded(event: LoginSucceededEvent) {
    try {
      await this.crm.updateContactLastLoginDate(event.payload.userEmail, this.dateProvider.now());
    } catch (err) {
      this.logger.error("CRM updateContactLastLoginDate failed", err);
    }
  }
}
