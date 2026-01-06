import {
  UrbanSprawlImpactsComparisonGateway,
  UrbanSprawlImpactsComparisonObj,
} from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";

export class MockUrbanSprawlImpactsComparisonService implements UrbanSprawlImpactsComparisonGateway {
  data: UrbanSprawlImpactsComparisonObj | undefined = undefined;

  async getImpactsUrbanSprawlComparison(): Promise<UrbanSprawlImpactsComparisonObj> {
    if (!this.data) throw new Error("MockUrbanSprawlImpactsComparisonService error: no data");
    return Promise.resolve(this.data);
  }

  _setUrbanSprawlImpactsComparison(data: UrbanSprawlImpactsComparisonObj) {
    this.data = data;
  }
}
