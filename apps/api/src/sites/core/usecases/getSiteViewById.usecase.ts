import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { MutabilityEvaluationQuery } from "src/site-evaluations/core/gateways/MutabilityEvaluationQuery";

import { SitesQuery } from "../gateways/SitesQuery";
import { SiteView } from "../models/views";

type Request = {
  siteId: string;
};

export type GetSiteViewByIdResult = TResult<{ site: SiteView }, "SiteNotFound">;

export class GetSiteViewByIdUseCase implements UseCase<Request, GetSiteViewByIdResult> {
  constructor(
    private readonly sitesQuery: SitesQuery,
    private readonly mutabilityEvaluationQuery: MutabilityEvaluationQuery,
  ) {}

  async execute({ siteId }: Request): Promise<GetSiteViewByIdResult> {
    const site = await this.sitesQuery.getViewById(siteId);

    if (!site) {
      return fail("SiteNotFound");
    }

    const mutafrichesId = await this.sitesQuery.getMutafrichesIdBySiteId(siteId);
    let compatibilityEvaluation = null;

    if (mutafrichesId) {
      const evaluation = await this.mutabilityEvaluationQuery.getEvaluation(mutafrichesId);
      if (evaluation) {
        compatibilityEvaluation = {
          results: evaluation.usages.map(({ usage, score }) => ({ usage, score })),
          reliabilityScore: evaluation.reliabilityScore,
        };
      }
    }

    // Add compatibilityEvaluation field to site
    const siteWithEvaluation = {
      ...site,
      compatibilityEvaluation,
    };

    return success({ site: siteWithEvaluation as SiteView });
  }
}
