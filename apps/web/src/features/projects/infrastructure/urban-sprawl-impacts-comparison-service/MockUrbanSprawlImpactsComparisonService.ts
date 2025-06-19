import {
  UrbanSprawlImpactsComparisonGateway,
  UrbanSprawlImpactsComparisonObj,
} from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";
import { comparisonResultMock } from "./urbanSprawlImpactsComparison.mock";

export class MockUrbanSprawlImpactsComparisonService
  implements UrbanSprawlImpactsComparisonGateway
{
  data: UrbanSprawlImpactsComparisonObj = comparisonResultMock;

  async getImpactsUrbanSprawlComparison(): Promise<UrbanSprawlImpactsComparisonObj> {
    return Promise.resolve(this.data);
  }

  _setUrbanSprawlImpactsComparison(data: UrbanSprawlImpactsComparisonObj) {
    this.data = data;
  }
}
