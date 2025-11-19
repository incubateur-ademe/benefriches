import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { SitesQuery } from "../gateways/SitesQuery";
import { SiteView } from "../models/views";

type Request = {
  siteId: string;
};

export type GetSiteViewByIdResult = TResult<{ site: SiteView }, "SiteNotFound">;

export class GetSiteViewByIdUseCase implements UseCase<Request, GetSiteViewByIdResult> {
  constructor(private readonly sitesQuery: SitesQuery) {}

  async execute({ siteId }: Request): Promise<GetSiteViewByIdResult> {
    const site = await this.sitesQuery.getViewById(siteId);

    if (!site) {
      return fail("SiteNotFound");
    }

    return success({ site });
  }
}
