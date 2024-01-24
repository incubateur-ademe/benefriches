import { GetLocalAuthoritiesResult as GetProjectSiteLocalAuthoritiesResult } from "@/features/create-project/application/projectSiteLocalAuthorities.actions";
import { LocalAuthoritiesGateway as ProjectLocalAuthoritiesGateway } from "@/features/create-project/application/projectSiteLocalAuthorities.actions";
import { GetLocalAuthoritiesResult as GetSiteLocalAuthoritiesResult } from "@/features/create-site/application/siteLocalAuthorities.actions";
import { LocalAuthoritiesGateway as SiteLocalAuthoritiesGateway } from "@/features/create-site/application/siteLocalAuthorities.actions";

export class LocalAuthoritiesMock
  implements ProjectLocalAuthoritiesGateway, SiteLocalAuthoritiesGateway
{
  constructor(
    private result: GetSiteLocalAuthoritiesResult | GetProjectSiteLocalAuthoritiesResult,
    private shouldFail: boolean = false,
  ) {}

  async getLocalAuthoritiesForCityCode() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
