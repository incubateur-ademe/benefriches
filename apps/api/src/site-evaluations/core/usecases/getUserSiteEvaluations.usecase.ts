import { MutabilityUsage } from "shared";

import type { AppLogger } from "src/shared-kernel/logger";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { getSiteEditability, SiteEditability } from "src/sites/core/models/siteEditability";

import { MutabilityEvaluationQuery } from "../gateways/MutabilityEvaluationQuery";
import { SiteEvaluationDataView, SiteEvaluationQuery } from "../gateways/SiteEvaluationQuery";

export type UserSiteEvaluation = Pick<
  SiteEvaluationDataView,
  "reconversionProjects" | "isExpressSite" | "siteId" | "siteName" | "siteNature"
> &
  SiteEditability & {
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
  private readonly siteEvaluationQuery: SiteEvaluationQuery;
  private readonly mutafrichesEvaluationQuery: MutabilityEvaluationQuery;
  private readonly logger: AppLogger;
  constructor(
    siteEvaluationQuery: SiteEvaluationQuery,
    mutafrichesEvaluationQuery: MutabilityEvaluationQuery,
    logger: AppLogger,
  ) {
    this.siteEvaluationQuery = siteEvaluationQuery;
    this.mutafrichesEvaluationQuery = mutafrichesEvaluationQuery;
    this.logger = logger;
  }

  async execute({ userId }: Request): Promise<UserSiteEvaluationResult> {
    if (!userId) {
      return fail("UserIdRequired");
    }

    const result = await this.siteEvaluationQuery.getUserSiteEvaluations(userId);

    const userSiteEvaluations = await Promise.all(
      result.map((evaluation) => this.toUserSiteEvaluation(evaluation, userId)),
    );

    return success(userSiteEvaluations);
  }

  private async toUserSiteEvaluation(
    evaluation: SiteEvaluationDataView,
    userId: string,
  ): Promise<UserSiteEvaluation> {
    // The definition of "has an active reconversion project" must stay identical across the
    // read and write paths — `total` here already counts only status = 'active' projects
    // (see SqlSiteEvaluationQuery), so reusing it is what guarantees this response can't
    // disagree with the update endpoint's own check.
    const editability = getSiteEditability(
      {
        createdBy: evaluation.siteCreatedBy,
        creationMode: evaluation.siteCreationMode,
        hasActiveReconversionProject: evaluation.reconversionProjects.total > 0,
      },
      userId,
    );

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
            ...editability,
            compatibilityEvaluation: {
              ...evaluation.compatibilityEvaluation,
              top3Usages: mutafrichesEvaluationResult.usages.slice(0, 3),
            },
          };
        }
      } catch (err) {
        this.logger.error(
          `Failed to get mutafriches evaluation for siteId ${evaluation.siteId}`,
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
      ...editability,
    };
  }
}
