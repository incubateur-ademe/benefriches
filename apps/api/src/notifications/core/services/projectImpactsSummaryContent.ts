import {
  cropImpactsByEvaluationPeriod,
  getBreakEvenHorizon,
  getDefaultEvaluationPeriodInYears,
  getKeyImpactIndicatorsList,
  getSummaryHeadlineIndicators,
} from "shared";

import type { LifecycleEmailProjectQuery } from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import type { LifecycleEmailRecipient } from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import type { LifecycleEmailMessage } from "src/notifications/core/gateways/Mailer";
import type { ProjectImpactsCalculator } from "src/notifications/core/gateways/ProjectImpactsCalculator";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import {
  buildProjectImpactsSummaryEmail,
  type ProjectImpactsSummaryContent,
} from "src/notifications/core/templates/projectImpactsSummaryEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import { fail, success, type TResult } from "src/shared-kernel/result";

// The project impacts summary's one derivation, shared by the send use case, the retry sweeper
// (through composeProjectImpactsSummaryEmail) and the preview's real-project path (through
// loadProjectImpactsSummaryContent), so the three can never disagree with each other or with
// the web Synthèse.

export type ProjectImpactsSummarySources = {
  projectQuery: LifecycleEmailProjectQuery;
  projectImpactsCalculator: ProjectImpactsCalculator;
};

export type ProjectImpactsSummaryContentResult = TResult<
  ProjectImpactsSummaryContent,
  "ReconversionProjectNotFound" | "ProjectImpactsNotComputed",
  { calculatorError: string } | undefined
>;

// Loads the project, computes its impacts (50 years, the API default) and derives the three
// headlines in the web's order (BEN-12 "Evaluation period note"): crop to the plan type's default
// evaluation period, then the key indicators and the break-even horizon on the cropped impacts.
// Skipping the crop would make a photovoltaic plant's email disagree with the app. A thrown error
// (DB, OFGL HTTP call) propagates.
export async function loadProjectImpactsSummaryContent(
  sources: ProjectImpactsSummarySources,
  projectId: string,
): Promise<ProjectImpactsSummaryContentResult> {
  // The cheap read first: no computation for a project that no longer exists.
  const project = await sources.projectQuery.getById(projectId);
  if (!project) {
    return fail("ReconversionProjectNotFound");
  }

  const result = await sources.projectImpactsCalculator.execute({
    reconversionProjectId: projectId,
  });
  if (result.isFailure()) {
    return fail("ProjectImpactsNotComputed", { calculatorError: result.getError() });
  }

  // Names and date come from `project` (one source); contextData only feeds the derivation.
  const { impacts, contextData } = result.getData();
  const evaluationPeriodInYears = getDefaultEvaluationPeriodInYears(
    contextData.projectDevelopmentPlan.type,
  );
  const croppedImpacts = cropImpactsByEvaluationPeriod(impacts, evaluationPeriodInYears);
  const { zanCompliance, mainImpactIndicator } = getSummaryHeadlineIndicators(
    getKeyImpactIndicatorsList(croppedImpacts, contextData),
  );
  // The same fields the web selector selectProjectSummaryDataView reads.
  const breakEvenHorizon = getBreakEvenHorizon({
    breakEvenYear: croppedImpacts.aggregatedReconversionImpacts.breakEvenYear,
    projectionYears: croppedImpacts.projectionYears,
  });

  return success({
    project,
    evaluationPeriodInYears,
    zanCompliance,
    breakEvenHorizon,
    mainImpactIndicator,
  });
}

// The message for a genuine send (send use case and retry sweeper): the recipient's address and
// their own unsubscribe link. A missing project or a failed computation throws: the sender
// records the message as the delivery's error_message ("failed", retried by the sweeper).
export async function composeProjectImpactsSummaryEmail(
  sources: ProjectImpactsSummarySources & {
    webappUrl: string;
    unsubscribeTokenService: UnsubscribeTokenService;
  },
  { projectId, recipient }: { projectId: string; recipient: LifecycleEmailRecipient },
): Promise<LifecycleEmailMessage> {
  const result = await loadProjectImpactsSummaryContent(sources, projectId);
  if (result.isFailure()) {
    if (result.getError() === "ReconversionProjectNotFound") {
      throw new Error(`Reconversion project ${projectId} not found`);
    }
    throw new Error(
      `Project impacts could not be computed for project ${projectId}: ${result.getIssues()?.calculatorError}`,
    );
  }

  return {
    to: recipient.email,
    ...buildProjectImpactsSummaryEmail({
      ...result.getData(),
      webappUrl: sources.webappUrl,
      unsubscribeUrl: buildUnsubscribeUrl(
        sources.webappUrl,
        sources.unsubscribeTokenService.sign(recipient.id),
      ),
    }),
  };
}
