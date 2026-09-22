import type { Mailer } from "src/notifications/core/gateways/Mailer";
import {
  lifecycleEmailTypeSchema,
  type LifecycleEmailType,
} from "src/notifications/core/models/lifecycleEmail";
import { buildLifecycleEmailPreview } from "src/notifications/core/previews/lifecycleEmailPreviewSamples";
import type { AppLogger } from "src/shared-kernel/logger";
import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

type Request = {
  // Unvalidated: comes straight from the command line.
  emailType: string;
  recipients: string[];
};

type Response = {
  emailType: LifecycleEmailType;
  subject: string;
  recipients: string[];
};

type Errors = "NoRecipient" | "UnknownEmailType" | "MailerFailed";
type Issues = { validEmailTypes: string[] };

type SendLifecycleEmailPreviewResult = TResult<Response, Errors, Issues>;

/**
 * Deliberately does NOT use `LifecycleEmailSender`. A preview is an explicit human
 * action, not an automated send: it ignores `LIFECYCLE_EMAILS_ENABLED`, never reads
 * `users.lifecycle_emails_unsubscribed_at`, applies no suppression rule, and writes no
 * `lifecycle_email_deliveries` row — so previews can neither poison the funnel
 * correlation nor make a later genuine send look like a duplicate. Those bypasses are
 * structural: this class holds no repository, no recipient query and no kill-switch
 * flag. Do not route it through `LifecycleEmailSender`, and do not add a "preview mode"
 * flag to that sender (see ADR-0016).
 */
export class SendLifecycleEmailPreviewUseCase implements UseCase<
  Request,
  SendLifecycleEmailPreviewResult
> {
  private readonly mailer: Mailer;
  private readonly logger: AppLogger;
  private readonly webappUrl: string;

  constructor(mailer: Mailer, logger: AppLogger, webappUrl: string) {
    this.mailer = mailer;
    this.logger = logger;
    this.webappUrl = webappUrl;
  }

  async execute({ emailType, recipients }: Request): Promise<SendLifecycleEmailPreviewResult> {
    const startedAt = Date.now();

    if (recipients.length === 0) {
      return fail("NoRecipient");
    }

    const parsedEmailType = lifecycleEmailTypeSchema.safeParse(emailType);
    if (!parsedEmailType.success) {
      return fail("UnknownEmailType", { validEmailTypes: lifecycleEmailTypeSchema.options });
    }

    const email = buildLifecycleEmailPreview(parsedEmailType.data, this.webappUrl);

    for (const recipient of recipients) {
      try {
        await this.mailer.send({ to: recipient, ...email });
      } catch (error) {
        this.logger.error(
          `Lifecycle email preview failed: type=${parsedEmailType.data}, to=${recipient}`,
          error,
        );
        return fail("MailerFailed");
      }
      this.logger.info(
        `Lifecycle email preview sent: type=${parsedEmailType.data}, to=${recipient}`,
      );
    }

    const durationMs = Date.now() - startedAt;
    this.logger.info(
      `Lifecycle email preview summary (durationMs=${durationMs}): type=${parsedEmailType.data}, recipients=${recipients.length}, sent=${recipients.length}`,
    );

    return success({ emailType: parsedEmailType.data, subject: email.subject, recipients });
  }
}
