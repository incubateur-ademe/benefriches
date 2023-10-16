import {
  SiteSoilsCarbonSequestrationResult,
  SoilsCarbonSequestrationGateway,
} from "../../application/siteSoilsCarbonSequestration.actions";

export class SoilsCarbonSequestrationMock
  implements SoilsCarbonSequestrationGateway
{
  constructor(
    private result: SiteSoilsCarbonSequestrationResult,
    private shouldFail: boolean = false,
  ) {}

  async getForCityCodeAndSoils() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
