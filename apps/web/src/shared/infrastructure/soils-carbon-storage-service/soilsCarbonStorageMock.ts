import {
  SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/features/create-project/application/soilsCarbonStorage.actions";
import { SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway } from "@/features/create-site/application/siteSoilsCarbonStorage.actions";

export class SoilsCarbonStorageMock
  implements ProjectSoilsCarbonStorageGateway, SiteSoilsCarbonStorageGateway
{
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
