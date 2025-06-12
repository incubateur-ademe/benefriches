import {
  QuickUrbanProjectImpactsGateway,
  ReconversionProjectImpactsResult,
} from "../../application/project-impacts/fetchQuickImpactsForUrbanProjectOnFriche.action";

export class MockQuickUrbanProjectImpactsService implements QuickUrbanProjectImpactsGateway {
  data: ReconversionProjectImpactsResult | undefined = undefined;

  async getImpacts(): Promise<ReconversionProjectImpactsResult> {
    if (!this.data) throw new Error("MockQuickUrbanProjectImpactsService error: no data");
    return Promise.resolve(this.data);
  }

  _setImpacts(data: ReconversionProjectImpactsResult) {
    this.data = data;
  }
}
