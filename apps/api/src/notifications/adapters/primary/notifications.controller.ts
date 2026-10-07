import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  type UnsubscribeFromLifecycleEmailsRequestDto,
  unsubscribeFromLifecycleEmailsRequestDtoSchema,
  type UnsubscribeFromLifecycleEmailsErrorCode,
} from "shared";

import { UnsubscribeFromLifecycleEmailsUseCase } from "src/notifications/core/usecases/unsubscribeFromLifecycleEmails.usecase";

@Controller("lifecycle-emails")
export class NotificationsController {
  private readonly unsubscribeFromLifecycleEmailsUseCase: UnsubscribeFromLifecycleEmailsUseCase;

  constructor(unsubscribeFromLifecycleEmailsUseCase: UnsubscribeFromLifecycleEmailsUseCase) {
    this.unsubscribeFromLifecycleEmailsUseCase = unsubscribeFromLifecycleEmailsUseCase;
  }

  // Deliberately public (no JwtAuthGuard): the link is opened from a mail client, not the
  // app. The signed token is the credential. POST only: a mutating GET would be triggered
  // by the link scanners of mail security gateways.
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("unsubscribe")
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(
    @Body({ schema: unsubscribeFromLifecycleEmailsRequestDtoSchema })
    body: UnsubscribeFromLifecycleEmailsRequestDto,
  ): Promise<void> {
    const result = await this.unsubscribeFromLifecycleEmailsUseCase.execute({
      token: body.token,
    });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "InvalidUnsubscribeToken":
          throw new BadRequestException({
            error: "INVALID_UNSUBSCRIBE_TOKEN" satisfies UnsubscribeFromLifecycleEmailsErrorCode,
            message: "Invalid unsubscribe token",
          });
      }
    }
  }
}
