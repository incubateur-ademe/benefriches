import { GetReconversionProjectImpactsResultDto } from "shared";

import {
  ReconversionProjectImpactsGateway,
  ReconversionProjectImpactsResult,
} from "../../application/project-impacts/actions";

export class MockReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  data: ReconversionProjectImpactsResult | undefined = undefined;
  dataBreakEvenLevel: GetReconversionProjectImpactsResultDto | undefined = undefined;

  async getReconversionProjectImpacts(): Promise<ReconversionProjectImpactsResult> {
    if (!this.data) throw new Error("MockReconversionProjectImpactsApi error: no data");
    return Promise.resolve(this.data);
  }

  async getReconversionProjectImpactsBreakEvenLevel(): Promise<GetReconversionProjectImpactsResultDto> {
    if (!this.dataBreakEvenLevel)
      throw new Error("MockReconversionProjectImpactsApi error: no dataBreakEvenLevel");
    return Promise.resolve(this.dataBreakEvenLevel);
  }

  _setReconversionProjectImpacts(data: ReconversionProjectImpactsResult) {
    this.data = data;
  }

  _setReconversionProjectImpactsBreakEvenLevel(data: GetReconversionProjectImpactsResultDto) {
    this.dataBreakEvenLevel = data;
  }
}
