import type { UpdateCustomSiteDto } from "shared";

import type { SiteUpdateView, UpdateSiteServiceGateway } from "../../core/updateSite.types";

export class InMemoryUpdateSiteService implements UpdateSiteServiceGateway {
  _siteView: SiteUpdateView | undefined = undefined;
  _savedPayloads: { siteId: string; payload: UpdateCustomSiteDto }[] = [];

  private readonly shouldFail: boolean;

  constructor(shouldFail = false) {
    this.shouldFail = shouldFail;
  }

  async getById(_siteId: string): Promise<SiteUpdateView | undefined> {
    return await Promise.resolve(this._siteView);
  }

  async save(siteId: string, payload: UpdateCustomSiteDto): Promise<void> {
    if (this.shouldFail) throw new Error("Intended error");
    this._savedPayloads.push({ siteId, payload });
    await Promise.resolve();
  }
}
