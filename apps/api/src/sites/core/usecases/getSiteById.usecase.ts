import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesQuery, SiteViewModel } from "../gateways/SitesQuery";

type Request = {
  siteId: string;
};

type GetSiteByIdResult = TResult<{ site: SiteViewModel }, "SiteNotFound">;

export class GetSiteByIdUseCase implements UseCase<Request, GetSiteByIdResult> {
  constructor(private readonly sitesQuery: SitesQuery) {}

  async execute({ siteId }: Request): Promise<GetSiteByIdResult> {
    const site = await this.sitesQuery.getById(siteId);

    if (!site) {
      return fail("SiteNotFound");
    }

    return success({ site });
  }
}
