import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { MutabilityEvaluationQuery } from "src/site-evaluations/core/gateways/MutabilityEvaluationQuery";

import { SitesQuery } from "../gateways/SitesQuery";
import { getSiteEditability } from "../models/siteEditability";
import { SiteView } from "../models/views";

type Request = {
  siteId: string;
  userId: string;
};

export type GetSiteViewByIdResult = TResult<{ site: SiteView }, "SiteNotFound">;

export class GetSiteViewByIdUseCase implements UseCase<Request, GetSiteViewByIdResult> {
  private readonly sitesQuery: SitesQuery;
  private readonly mutabilityEvaluationQuery: MutabilityEvaluationQuery;
  constructor(sitesQuery: SitesQuery, mutabilityEvaluationQuery: MutabilityEvaluationQuery) {
    this.sitesQuery = sitesQuery;
    this.mutabilityEvaluationQuery = mutabilityEvaluationQuery;
  }

  async execute({ siteId, userId }: Request): Promise<GetSiteViewByIdResult> {
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

    const { createdBy, creationMode, ...view } = site;

    // The definition of "has an active reconversion project" must stay identical across the read
    // and write paths — getViewById already filters reconversionProjects to status = 'active', so
    // reusing its length here is what guarantees this response can't disagree with the update
    // endpoint's own check.
    const hasActiveReconversionProject = view.reconversionProjects.length > 0;

    const editability = getSiteEditability(
      { createdBy, creationMode, hasActiveReconversionProject },
      userId,
    );

    return success({
      site: {
        ...view,
        compatibilityEvaluation,
        ...editability,
      },
    });
  }
}
