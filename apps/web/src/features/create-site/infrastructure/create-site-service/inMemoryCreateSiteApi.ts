import {
  CreateSiteGateway,
  CustomSitePayload,
  ExpressSitePayload,
} from "../../core/actions/finalStep.actions";

export class InMemoryCreateSiteService implements CreateSiteGateway {
  _customSites: CustomSitePayload[] = [];
  _expressSites: ExpressSitePayload[] = [];
  private shouldFail = false;

  shouldFailOnCall() {
    this.shouldFail = true;
  }

  async saveCustom(newSite: CustomSitePayload) {
    if (this.shouldFail) throw new Error("Intended error");
    await Promise.resolve(this._customSites.push(newSite));
  }

  async saveExpress(newSite: ExpressSitePayload) {
    if (this.shouldFail) throw new Error("Intended error");
    await Promise.resolve(this._expressSites.push(newSite));
  }
}
