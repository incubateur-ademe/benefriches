import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { LOGIN_SUCCEEDED, LoginSucceededEvent } from "src/auth/core/events/loginSucceeded.event";
import { CRMGateway } from "src/marketing/core/CRMGateway";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

@Injectable()
export class LoginSucceededHandler {
  private readonly logger = new Logger(LoginSucceededHandler.name);

  constructor(
    private readonly crm: CRMGateway,
    private readonly dateProvider: DateProvider,
  ) {}

  @OnEvent(LOGIN_SUCCEEDED)
  async handleLoginSucceeded(event: LoginSucceededEvent) {
    try {
      await this.crm.updateContactLastLoginDate(event.payload.userEmail, this.dateProvider.now());
    } catch (err) {
      this.logger.error("CRM updateContactLastLoginDate failed", err);
    }
  }
}
