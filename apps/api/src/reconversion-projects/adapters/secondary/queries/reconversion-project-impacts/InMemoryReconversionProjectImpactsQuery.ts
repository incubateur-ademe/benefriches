import {
  ReconversionProjectImpactsDataView,
  ReconversionProjectImpactsQuery,
} from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";

export class InMemoryReconversionProjectImpactsQuery implements ReconversionProjectImpactsQuery {
  data?: ReconversionProjectImpactsDataView = undefined;

  getById() {
    return Promise.resolve(this.data);
  }

  _setData(data: ReconversionProjectImpactsDataView) {
    this.data = data;
  }
}
