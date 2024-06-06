import {
  SiteImpactsDataView,
  SiteImpactsRepository,
} from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";

export class InMemorySiteImpactsRepository implements SiteImpactsRepository {
  data?: SiteImpactsDataView;

  getById() {
    return Promise.resolve(this.data);
  }

  _setData(data: SiteImpactsDataView) {
    this.data = data;
  }
}
