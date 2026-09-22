import {
  LifecycleEmailSender,
  type LifecycleEmailSendOutcome,
} from "src/notifications/core/services/lifecycleEmailSender";
import { buildWelcomeEmail } from "src/notifications/core/templates/welcomeEmail";
import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

type Request = {
  userId: string;
  userEmail: string;
};

type Response = {
  outcome: LifecycleEmailSendOutcome;
};

type SendWelcomeEmailResult = TResult<Response, "MailerFailed">;

export class SendWelcomeEmailUseCase implements UseCase<Request, SendWelcomeEmailResult> {
  private readonly sender: LifecycleEmailSender;
  private readonly webappUrl: string;

  constructor(sender: LifecycleEmailSender, webappUrl: string) {
    this.sender = sender;
    this.webappUrl = webappUrl;
  }

  async execute({ userId, userEmail }: Request): Promise<SendWelcomeEmailResult> {
    const email = buildWelcomeEmail({ recipientEmail: userEmail, webappUrl: this.webappUrl });

    const outcome = await this.sender.send({
      userId,
      emailType: "welcome",
      message: { to: userEmail, ...email },
    });

    if (outcome === "failed") {
      return fail("MailerFailed");
    }

    return success({ outcome });
  }
}
