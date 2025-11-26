import type { DomainEvent } from "src/shared-kernel/domainEvent";

export const SITE_CREATED_FROM_EVALUATION = "reconversion-compatibility-evaluation.site-created";

export type SiteCreatedFromEvaluationEvent = DomainEvent<
  typeof SITE_CREATED_FROM_EVALUATION,
  {
    evaluationId: string;
    relatedSiteId: string;
  }
>;

export const createSiteCreatedFromEvaluationEvent = (
  id: string,
  payload: SiteCreatedFromEvaluationEvent["payload"],
): SiteCreatedFromEvaluationEvent => ({
  id,
  name: SITE_CREATED_FROM_EVALUATION,
  payload,
});
