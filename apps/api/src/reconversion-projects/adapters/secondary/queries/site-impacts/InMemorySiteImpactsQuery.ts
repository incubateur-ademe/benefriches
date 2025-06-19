import { SiteImpactsDataView } from "shared";

import { SiteImpactsQuery } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";

export class InMemorySiteImpactsQuery implements SiteImpactsQuery {
  data?: SiteImpactsDataView;

  getById() {
    return Promise.resolve(this.data);
  }

  _setData(data: SiteImpactsDataView) {
    this.data = data;
  }
}
