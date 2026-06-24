import type { TResult } from "src/shared-kernel/result";
import { fail, success } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { SitesQuery } from "../gateways/SitesQuery";
import type { SiteFeaturesView } from "../models/views";

type Request = {
  siteId: string;
};

type GetSiteByIdResult = TResult<{ site: SiteFeaturesView }, "SiteNotFound">;

export class GetSiteByIdUseCase implements UseCase<Request, GetSiteByIdResult> {
  constructor(private readonly sitesQuery: SitesQuery) {}

  async execute({ siteId }: Request): Promise<GetSiteByIdResult> {
    const site = await this.sitesQuery.getSiteFeaturesById(siteId);

    if (!site) {
      return fail("SiteNotFound");
    }

    return success({ site });
  }
}
