import { SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import {
  SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/shared/core/wizard-form/soilsCarbonStorage.action";

export class SoilsCarbonStorageMock
  implements ProjectSoilsCarbonStorageGateway, SiteSoilsCarbonStorageGateway
{
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
