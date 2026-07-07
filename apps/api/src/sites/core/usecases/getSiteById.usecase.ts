import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesQuery } from "../gateways/SitesQuery";
import { SiteFeaturesView } from "../models/views";

type Request = {
  siteId: string;
};

type GetSiteByIdResult = TResult<{ site: SiteFeaturesView }, "SiteNotFound">;

export class GetSiteByIdUseCase implements UseCase<Request, GetSiteByIdResult> {
  private readonly sitesQuery: SitesQuery;
  constructor(sitesQuery: SitesQuery) {
    this.sitesQuery = sitesQuery;
  }

  async execute({ siteId }: Request): Promise<GetSiteByIdResult> {
    const site = await this.sitesQuery.getSiteFeaturesById(siteId);

    if (!site) {
      return fail("SiteNotFound");
    }

    return success({ site });
  }
}
