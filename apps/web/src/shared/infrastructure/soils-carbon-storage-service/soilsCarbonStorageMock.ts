import {
  SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/features/create-project/core/project-form/soilsCarbonStorage.types";
import { SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";

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
