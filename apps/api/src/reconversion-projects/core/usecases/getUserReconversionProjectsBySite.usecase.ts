import { SiteNature } from "shared";

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

class UserIdRequiredError extends Error {
  constructor() {
    super(`GetUserReconversionProjectsBySite: userId is required`);
    this.name = "UserIdRequiredError";
  }
}

type Request = {
  userId: string;
};

export class GetUserReconversionProjectsBySiteUseCase
  implements UseCase<Request, ReconversionProjectsGroupedBySite>
{
  constructor(private readonly reconversionProjectsQuery: ReconversionProjectsListQuery) {}

  async execute({ userId }: Request): Promise<ReconversionProjectsGroupedBySite> {
    if (!userId) {
      throw new UserIdRequiredError();
    }

    const result = await this.reconversionProjectsQuery.getGroupedBySite({ userId });
    return result;
  }
}
