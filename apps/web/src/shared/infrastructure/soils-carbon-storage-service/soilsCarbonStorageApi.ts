import {
  GetSoilsCarbonStoragePayload,
  SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/features/create-project/application/soilsCarbonStorage.actions";
import {
  GetSiteSoilsCarbonStoragePayload,
  SiteSoilsCarbonStorageResult,
  SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway,
} from "@/features/create-site/application/siteSoilsCarbonStorage.actions";
import { objectToQueryParams } from "@/shared/services/object-query-parameters/objectToQueryParameters";

export class SoilsCarbonStorageApi
  implements SiteSoilsCarbonStorageGateway, ProjectSoilsCarbonStorageGateway
{
  async getForCityCodeAndSoils({
    cityCode,
    soils,
  }: GetSoilsCarbonStoragePayload | GetSiteSoilsCarbonStoragePayload) {
    const queryString = objectToQueryParams({ cityCode, soils });
    const response = await fetch(`/api/carbon-storage/site-soils?${queryString}`);

    if (!response.ok) throw new Error("Error while computing carbon storage");

    const jsonResponse = (await response.json()) as
      | SoilsCarbonStorageResult
      | SiteSoilsCarbonStorageResult;
    return jsonResponse;
  }
}
