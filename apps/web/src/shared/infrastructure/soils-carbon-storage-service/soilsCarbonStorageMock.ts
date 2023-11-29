import {
  SoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/shared/domain/gateways/SoilsCarbonStorageApi";

export class SoilsCarbonStorageMock implements SoilsCarbonStorageGateway {
  constructor(
    private result: SoilsCarbonStorageResult,
    private shouldFail: boolean = false,
  ) {}

  async getForCityCodeAndSoils() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
