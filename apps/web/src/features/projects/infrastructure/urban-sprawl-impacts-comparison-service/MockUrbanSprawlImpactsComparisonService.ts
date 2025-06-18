import {
  UrbanSprawlImpactsComparisonGateway,
  UrbanSprawlImpactsComparisonResult,
} from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";
import { comparisonResultMock } from "./urbanSprawlImpactsComparison.mock";

export class MockUrbanSprawlImpactsComparisonService
  implements UrbanSprawlImpactsComparisonGateway
{
  async getImpactsUrbanSprawlComparison(): Promise<UrbanSprawlImpactsComparisonResult> {
    return Promise.resolve(comparisonResultMock);
  }
}
