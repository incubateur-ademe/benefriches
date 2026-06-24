import { ReconversionProjectImpactsQuery } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";

import { ReconversionProjectImpactsQueryResult } from "./SqlReconversionProjectImpactsQuery";

export class InMemoryReconversionProjectImpactsQuery implements ReconversionProjectImpactsQuery {
  data?: ReconversionProjectImpactsQueryResult = undefined;

  getById() {
    return Promise.resolve(this.data);
  }

  _setData(data: ReconversionProjectImpactsQueryResult) {
    this.data = data;
  }
}
