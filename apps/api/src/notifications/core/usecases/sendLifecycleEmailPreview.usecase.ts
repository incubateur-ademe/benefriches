import type { LifecycleEmailProjectQuery } from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import type { Mailer } from "src/notifications/core/gateways/Mailer";
import type { ProjectImpactsCalculator } from "src/notifications/core/gateways/ProjectImpactsCalculator";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import {
  lifecycleEmailTypeSchema,
  type LifecycleEmailType,
} from "src/notifications/core/models/lifecycleEmail";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import {
  buildLifecycleEmailPreviews,
  PREVIEW_SAMPLE_CONTACT,
  PREVIEW_SAMPLE_USER,
} from "src/notifications/core/previews/lifecycleEmailPreviewSamples";
import {
  loadProjectImpactsSummaryContent,
  type ProjectImpactsSummaryContentResult,
} from "src/notifications/core/services/projectImpactsSummaryContent";
import type { RenderedEmail } from "src/notifications/core/templates/emailLayout";
import { buildProjectImpactsSummaryEmail } from "src/notifications/core/templates/projectImpactsSummaryEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import type { AppLogger } from "src/shared-kernel/logger";
import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

type Request = {
  // Unvalidated: comes straight from the command line.
  emailType: string;
  // A real project to render instead of the samples (project impacts summary only).
  // Unvalidated too.
  projectId?: string;
  recipients: string[];
};

type Response = {
  emailType: LifecycleEmailType;
  // One per sample, in sending order (two for the first project reminder and the impacts
  // summary), or one for a real project.
  subjects: string[];
  recipients: string[];
};

type Errors =
  | "NoRecipient"
  | "UnknownEmailType"
  | "MailerFailed"
  | "ProjectIdNotSupported"
  | "ReconversionProjectNotFound"
  | "ProjectImpactsNotComputed";
type Issues = { validEmailTypes: string[] };

type SendLifecycleEmailPreviewResult = TResult<Response, Errors, Issues>;

/**
 * Deliberately does NOT use `LifecycleEmailSender`. A preview is an explicit human
 * action, not an automated send: it ignores `LIFECYCLE_EMAILS_ENABLED`, never reads
 * `users.lifecycle_emails_unsubscribed_at`, applies no suppression rule, and writes no
 * `lifecycle_email_deliveries` row — so previews can neither poison the funnel
 * correlation nor make a later genuine send look like a duplicate. Those bypasses are
 * structural: this class holds no ledger repository, no recipient query and no kill-switch
 * flag; its only gateways are read-only (the project and its impacts, for a real project's
 * impacts summary). Its unsubscribe link is signed for `PREVIEW_SAMPLE_USER.id`, which matches
 * no real user, so clicking it on a preview never unsubscribes the recipient, even when it
 * renders a real project. Do not route it through `LifecycleEmailSender`, and do not add a
 * "preview mode" flag to that sender (see ADR-0016).
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
  private readonly projectQuery: LifecycleEmailProjectQuery;
  private readonly projectImpactsCalculator: ProjectImpactsCalculator;

  constructor(
    mailer: Mailer,
    logger: AppLogger,
    webappUrl: string,
    unsubscribeTokenService: UnsubscribeTokenService,
    contact: LifecycleEmailContact | undefined,
    projectQuery: LifecycleEmailProjectQuery,
    projectImpactsCalculator: ProjectImpactsCalculator,
  ) {
    this.mailer = mailer;
    this.logger = logger;
    this.webappUrl = webappUrl;
    this.unsubscribeTokenService = unsubscribeTokenService;
    this.contact = contact;
    this.projectQuery = projectQuery;
    this.projectImpactsCalculator = projectImpactsCalculator;
  }

  async execute({
    emailType,
    projectId,
    recipients,
  }: Request): Promise<SendLifecycleEmailPreviewResult> {
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
    let emails: RenderedEmail[];
    if (projectId !== undefined) {
      if (parsedEmailType.data !== "project-impacts-summary") {
        return fail("ProjectIdNotSupported");
      }
      // A real project's summary, rendered by the same derivation as a genuine send. It
      // carries that project's name and results (a real user's data on production) to the
      // given addresses, still with the sample user's unsubscribe link.
      let contentResult: ProjectImpactsSummaryContentResult;
      try {
        contentResult = await loadProjectImpactsSummaryContent(
          {
            projectQuery: this.projectQuery,
            projectImpactsCalculator: this.projectImpactsCalculator,
          },
          projectId,
        );
      } catch (error) {
        this.logger.error(`Lifecycle email preview could not load project ${projectId}`, error);
        return fail("ProjectImpactsNotComputed");
      }
      if (contentResult.isFailure()) {
        const error = contentResult.getError();
        if (error === "ProjectImpactsNotComputed") {
          this.logger.error(
            `Lifecycle email preview could not load project ${projectId}: ${contentResult.getIssues()?.calculatorError}`,
          );
        }
        return fail(error);
      }
      emails = [
        buildProjectImpactsSummaryEmail({
          ...contentResult.getData(),
          webappUrl: this.webappUrl,
          unsubscribeUrl,
        }),
      ];
    } else {
      // The configured contact when there is one (a reviewer on staging sees the real
      // signature), the invented sample otherwise, so a preview works where nothing is set.
      // Every sample of the type: a type whose content varies (first project reminder: friche
      // or not; impacts summary: favourable or not) has one per variant.
      emails = buildLifecycleEmailPreviews(
        parsedEmailType.data,
        this.webappUrl,
        unsubscribeUrl,
        this.contact ?? PREVIEW_SAMPLE_CONTACT,
      );
    }

    const projectLog = projectId !== undefined ? `, project=${projectId}` : "";

    for (const recipient of recipients) {
      for (const email of emails) {
        try {
          await this.mailer.send({ to: recipient, ...email });
        } catch (error) {
          this.logger.error(
            `Lifecycle email preview failed: type=${parsedEmailType.data}, to=${recipient}`,
            error,
          );
          return fail("MailerFailed");
        }
      }
      this.logger.info(
        `Lifecycle email preview sent: type=${parsedEmailType.data}${projectLog}, to=${recipient}`,
      );
    }

    const durationMs = Date.now() - startedAt;
    this.logger.info(
      `Lifecycle email preview summary (durationMs=${durationMs}): type=${parsedEmailType.data}, recipients=${recipients.length}, sent=${recipients.length * emails.length}`,
    );

    return success({
      emailType: parsedEmailType.data,
      subjects: emails.map((email) => email.subject),
      recipients,
    });
  }
}
