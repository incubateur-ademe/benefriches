import {
  ReconversionProjectImpactsDataView,
  ReconversionProjectImpactsRepository,
} from "src/reconversion-projects/domain/usecases/computeReconversionProjectImpacts.usecase";

export class InMemoryReconversionProjectImpactsRepository
  implements ReconversionProjectImpactsRepository
{
  data?: ReconversionProjectImpactsDataView = undefined;

  getById() {
    return Promise.resolve(this.data);
  }

  _setData(data: ReconversionProjectImpactsDataView) {
    this.data = data;
  }
}
