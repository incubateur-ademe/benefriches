import type { Mailer } from "src/notifications/core/gateways/Mailer";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import {
  lifecycleEmailTypeSchema,
  type LifecycleEmailType,
} from "src/notifications/core/models/lifecycleEmail";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import {
  buildLifecycleEmailPreview,
  PREVIEW_SAMPLE_CONTACT,
  PREVIEW_SAMPLE_USER,
} from "src/notifications/core/previews/lifecycleEmailPreviewSamples";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
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
 * flag. Its unsubscribe link is signed for `PREVIEW_SAMPLE_USER.id`, which matches no real
 * user, so clicking it on a preview never unsubscribes the recipient. Do not route it through `LifecycleEmailSender`, and do not add a "preview mode"
 * flag to that sender (see ADR-0016).
 */
export class SendLifecycleEmailPreviewUseCase implements UseCase<
  Request,
  SendLifecycleEmailPreviewResult
> {
  private readonly mailer: Mailer;
  private readonly logger: AppLogger;
  private readonly webappUrl: string;
  private readonly unsubscribeTokenService: UnsubscribeTokenService;
  private readonly contact: LifecycleEmailContact | undefined;

  constructor(
    mailer: Mailer,
    logger: AppLogger,
    webappUrl: string,
    unsubscribeTokenService: UnsubscribeTokenService,
    contact: LifecycleEmailContact | undefined,
  ) {
    this.mailer = mailer;
    this.logger = logger;
    this.webappUrl = webappUrl;
    this.unsubscribeTokenService = unsubscribeTokenService;
    this.contact = contact;
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

    const unsubscribeUrl = buildUnsubscribeUrl(
      this.webappUrl,
      this.unsubscribeTokenService.sign(PREVIEW_SAMPLE_USER.id),
    );
    // The configured contact when there is one (a reviewer on staging sees the real
    // signature), the invented sample otherwise, so a preview works where nothing is set.
    const email = buildLifecycleEmailPreview(
      parsedEmailType.data,
      this.webappUrl,
      unsubscribeUrl,
      this.contact ?? PREVIEW_SAMPLE_CONTACT,
    );

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
