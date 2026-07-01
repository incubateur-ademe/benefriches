import { GetReconversionProjectImpactsResultDto } from "shared";

import { ReconversionProjectImpactsGateway } from "../../application/project-impacts/actions";

export class MockReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  data: GetReconversionProjectImpactsResultDto | undefined = undefined;

  async getReconversionProjectImpacts(): Promise<GetReconversionProjectImpactsResultDto> {
    if (!this.data) throw new Error("MockReconversionProjectImpactsApi error: no data");
    return Promise.resolve(this.data);
  }

  _setReconversionProjectImpacts(data: GetReconversionProjectImpactsResultDto) {
    this.data = data;
  }
}
