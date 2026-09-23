import type { GetReconversionProjectImpactsResultDto } from "shared";

import type { QuickUrbanProjectImpactsGateway } from "../../application/project-impacts/actions/fetchQuickImpactsForUrbanProjectOnFriche.action";

export class MockQuickUrbanProjectImpactsService implements QuickUrbanProjectImpactsGateway {
  data: GetReconversionProjectImpactsResultDto | undefined = undefined;

  async getImpacts(): Promise<GetReconversionProjectImpactsResultDto> {
    if (!this.data) throw new Error("MockQuickUrbanProjectImpactsService error: no data");
    return Promise.resolve(this.data);
  }

  _setImpacts(data: GetReconversionProjectImpactsResultDto) {
    this.data = data;
  }
}
