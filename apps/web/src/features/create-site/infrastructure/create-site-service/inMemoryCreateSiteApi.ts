import { CreateSiteGateway, CreateSiteGatewayPayload } from "../../application/createSite.actions";

export class InMemoryCreateSiteService implements CreateSiteGateway {
  _sites: CreateSiteGatewayPayload[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async save(newSite: CreateSiteGatewayPayload) {
    if (this.shouldFail) throw new Error("Intended error");

    await Promise.resolve(this._sites.push(newSite));
  }
}
