import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
  USER_ACCOUNT_CREATED,
  type UserAccountCreatedEvent,
} from "src/auth/core/events/userAccountCreated.event";
import { SendWelcomeEmailUseCase } from "src/notifications/core/usecases/sendWelcomeEmail.usecase";

@Injectable()
export class SendWelcomeEmailOnUserAccountCreatedHandler {
  private readonly logger = new Logger(SendWelcomeEmailOnUserAccountCreatedHandler.name);
  private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase;

  constructor(sendWelcomeEmailUseCase: SendWelcomeEmailUseCase) {
    this.sendWelcomeEmailUseCase = sendWelcomeEmailUseCase;
  }

  @OnEvent(USER_ACCOUNT_CREATED)
  async handleUserAccountCreated(event: UserAccountCreatedEvent): Promise<void> {
    // RealEventPublisher awaits listeners via emitAsync, so this runs INSIDE the
    // POST /api/auth/register request. Never rethrow: a failed welcome email must
    // never fail a signup. This try/catch also covers ledger/DB failures, not just
    // mailer failures.
    try {
      const result = await this.sendWelcomeEmailUseCase.execute({
        userId: event.payload.userId,
        userEmail: event.payload.userEmail,
      });
      if (result.isFailure()) {
        this.logger.error(`Welcome email failed for user ${event.payload.userId}`);
      }
    } catch (err) {
      this.logger.error("Welcome email handler failed", err);
    }
  }
}
