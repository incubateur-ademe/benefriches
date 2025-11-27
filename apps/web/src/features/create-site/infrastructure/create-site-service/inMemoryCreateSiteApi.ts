import { CreateExpressSiteDto } from "shared";

import { CreateSiteGateway, CustomSitePayload } from "../../core/actions/finalStep.actions";

export class InMemoryCreateSiteService implements CreateSiteGateway {
  _customSites: CustomSitePayload[] = [];
  _expressSites: CreateExpressSiteDto[] = [];
  private shouldFail = false;

  shouldFailOnCall() {
    this.shouldFail = true;
  }

  async saveCustom(newSite: CustomSitePayload) {
    if (this.shouldFail) throw new Error("InMemoryCreateSiteService intended test failure");
    await Promise.resolve(this._customSites.push(newSite));
  }

  async saveExpress(newSite: CreateExpressSiteDto) {
    if (this.shouldFail) throw new Error("InMemoryCreateSiteService intended test failure");
    await Promise.resolve(this._expressSites.push(newSite));
  }
}
