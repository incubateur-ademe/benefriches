import type { LifecycleEmailProjectQuery } from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import type { ProjectImpactsCalculator } from "src/notifications/core/gateways/ProjectImpactsCalculator";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import type {
  LifecycleEmailSender,
  LifecycleEmailSendOutcome,
} from "src/notifications/core/services/lifecycleEmailSender";
import { composeProjectImpactsSummaryEmail } from "src/notifications/core/services/projectImpactsSummaryContent";
import type { AppLogger } from "src/shared-kernel/logger";
import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

type Request = {
  reconversionProjectId: string;
  userId: string;
};

type Response = {
  outcome: LifecycleEmailSendOutcome;
};

type SendProjectImpactsSummaryEmailResult = TResult<Response, "DeliveryFailed">;

/**
 * Sends a project's author the three headline findings of its evaluation. Entity-scoped on the
 * project: one ledger row per user and project (related_entity_id = reconversion_projects.id),
 * so dedup goes through the sender. Rendered lazily (the sender's `render` variant): with the
 * kill switch off, an unsubscribed author or a delivery already recorded, nothing is computed.
 * A render failure (project gone, impacts not computable) or a mailer failure leaves a "failed"
 * row, retried by the hourly sweeper, then "abandoned" at the cap.
 */
export class SendProjectImpactsSummaryEmailUseCase implements UseCase<
  Request,
  SendProjectImpactsSummaryEmailResult
> {
  private readonly sender: LifecycleEmailSender;
  private readonly projectQuery: LifecycleEmailProjectQuery;
  private readonly projectImpactsCalculator: ProjectImpactsCalculator;
  private readonly webappUrl: string;
  private readonly unsubscribeTokenService: UnsubscribeTokenService;
  private readonly logger: AppLogger;

  constructor(
    sender: LifecycleEmailSender,
    projectQuery: LifecycleEmailProjectQuery,
    projectImpactsCalculator: ProjectImpactsCalculator,
    webappUrl: string,
    unsubscribeTokenService: UnsubscribeTokenService,
    logger: AppLogger,
  ) {
    this.sender = sender;
    this.projectQuery = projectQuery;
    this.projectImpactsCalculator = projectImpactsCalculator;
    this.webappUrl = webappUrl;
    this.unsubscribeTokenService = unsubscribeTokenService;
    this.logger = logger;
  }

  async execute({
    reconversionProjectId,
    userId,
  }: Request): Promise<SendProjectImpactsSummaryEmailResult> {
    const outcome = await this.sender.send({
      userId,
      emailType: "project-impacts-summary",
      relatedEntityId: reconversionProjectId,
      render: async (recipient) => {
        try {
          return await composeProjectImpactsSummaryEmail(
            {
              projectQuery: this.projectQuery,
              projectImpactsCalculator: this.projectImpactsCalculator,
              webappUrl: this.webappUrl,
              unsubscribeTokenService: this.unsubscribeTokenService,
            },
            { projectId: reconversionProjectId, recipient },
          );
        } catch (error) {
          // The sender records the message in the ledger; the log keeps the cause (AppLogger prints the error message, not the stack).
          this.logger.error(
            `Project impacts summary could not be rendered for project ${reconversionProjectId}`,
            error,
          );
          throw error;
        }
      },
    });

    if (outcome === "failed") {
      return fail("DeliveryFailed");
    }

    return success({ outcome });
  }
}
