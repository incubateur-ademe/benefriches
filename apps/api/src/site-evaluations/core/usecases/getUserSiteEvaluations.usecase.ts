import { MutabilityUsage } from "shared";

import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { MutabilityEvaluationQuery } from "../gateways/MutabilityEvaluationQuery";
import { SiteEvaluationDataView, SiteEvaluationQuery } from "../gateways/SiteEvaluationQuery";

export type UserSiteEvaluation = Pick<
  SiteEvaluationDataView,
  "reconversionProjects" | "isExpressSite" | "siteId" | "siteName" | "siteNature"
> & {
  compatibilityEvaluation?: SiteEvaluationDataView["compatibilityEvaluation"] & {
    top3Usages: {
      usage: MutabilityUsage;
      score: number;
      rank: number;
    }[];
  };
};

type Request = {
  userId: string;
};

type UserSiteEvaluationResult = TResult<UserSiteEvaluation[], "UserIdRequired">;

export class GetUserSiteEvaluationsUseCase implements UseCase<Request, UserSiteEvaluationResult> {
  constructor(
    private readonly siteEvaluationQuery: SiteEvaluationQuery,
    private readonly mutafrichesEvaluationQuery: MutabilityEvaluationQuery,
  ) {}

  async execute({ userId }: Request): Promise<UserSiteEvaluationResult> {
    if (!userId) {
      return fail("UserIdRequired");
    }

    const result = await this.siteEvaluationQuery.getUserSiteEvaluations(userId);

    const userSiteEvaluations = await Promise.all(
      result.map(async (evaluation) => {
        if (evaluation.compatibilityEvaluation?.mutafrichesEvaluationId) {
          try {
            const mutafrichesEvaluationResult = await this.mutafrichesEvaluationQuery.getEvaluation(
              evaluation.compatibilityEvaluation.mutafrichesEvaluationId,
            );

            if (mutafrichesEvaluationResult) {
              return {
                siteId: evaluation.siteId,
                siteName: evaluation.siteName,
                isExpressSite: evaluation.isExpressSite,
                siteNature: evaluation.siteNature,
                reconversionProjects: evaluation.reconversionProjects,
                compatibilityEvaluation: {
                  ...evaluation.compatibilityEvaluation,
                  top3Usages: mutafrichesEvaluationResult?.usages.slice(0, 3),
                },
              };
            }
          } catch (err) {
            // oxlint-disable-next-line no-console
            console.error(
              `Fail to get mutafrichesEvaluationResult in GetUserSiteEvaluationsUseCase for siteId ${evaluation.siteId}`,
              err,
            );
          }
        }
        return {
          siteId: evaluation.siteId,
          siteName: evaluation.siteName,
          isExpressSite: evaluation.isExpressSite,
          siteNature: evaluation.siteNature,
          reconversionProjects: evaluation.reconversionProjects,
        };
      }),
    );

    return success(userSiteEvaluations);
  }
}
