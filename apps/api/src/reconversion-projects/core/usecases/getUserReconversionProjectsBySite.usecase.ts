import { SiteNature } from "shared";

import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { DevelopmentPlan } from "../model/reconversionProject";

export type ReconversionProjectsGroupedBySite = {
  siteName: string;
  siteId: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
  fricheActivity?: string;
  reconversionProjects: {
    id: string;
    name: string;
    type: DevelopmentPlan["type"];
    isExpressProject: boolean;
  }[];
}[];

export interface ReconversionProjectsListQuery {
  getGroupedBySite({ userId }: { userId: string }): Promise<ReconversionProjectsGroupedBySite>;
}

type Request = {
  userId: string;
};

type GetUserReconversionProjectsBySiteResult = TResult<
  ReconversionProjectsGroupedBySite,
  "UserIdRequired"
>;

export class GetUserReconversionProjectsBySiteUseCase implements UseCase<
  Request,
  GetUserReconversionProjectsBySiteResult
> {
  constructor(private readonly reconversionProjectsQuery: ReconversionProjectsListQuery) {}

  async execute({ userId }: Request): Promise<GetUserReconversionProjectsBySiteResult> {
    if (!userId) {
      return fail("UserIdRequired");
    }

    const result = await this.reconversionProjectsQuery.getGroupedBySite({ userId });
    return success(result);
  }
}
