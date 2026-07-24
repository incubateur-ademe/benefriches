import {
  SoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/shared/core/gateways/SoilsCarbonStorageGateway";

export class SoilsCarbonStorageMock implements SoilsCarbonStorageGateway {
  private result: SoilsCarbonStorageResult;
  private shouldFail: boolean;

  constructor(result: SoilsCarbonStorageResult, shouldFail: boolean = false) {
    this.result = result;
    this.shouldFail = shouldFail;
  }

  async getForCityCodeAndSoils() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
