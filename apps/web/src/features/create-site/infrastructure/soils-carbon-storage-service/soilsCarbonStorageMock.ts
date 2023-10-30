import {
  SiteSoilsCarbonStorageResult,
  SoilsCarbonStorageGateway,
} from "../../application/siteSoilsCarbonStorage.actions";

export class SoilsCarbonStorageMock implements SoilsCarbonStorageGateway {
  constructor(
    private result: SiteSoilsCarbonStorageResult,
    private shouldFail: boolean = false,
  ) {}

  async getForCityCodeAndSoils() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
