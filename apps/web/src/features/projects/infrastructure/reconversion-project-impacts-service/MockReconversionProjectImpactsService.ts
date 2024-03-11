import {
  ReconversionProjectImpactsGateway,
  ReconversionProjectImpactsResult,
} from "../../application/fetchReconversionProjectImpacts.action";

export class MockReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  data: ReconversionProjectImpactsResult | undefined = undefined;

  async getReconversionProjectImpacts(): Promise<ReconversionProjectImpactsResult> {
    if (!this.data) throw new Error("MockReconversionProjectImpactsApi error: no data");
    return Promise.resolve(this.data);
  }

  _setReconversionProjectImpacts(data: ReconversionProjectImpactsResult) {
    this.data = data;
  }
}
