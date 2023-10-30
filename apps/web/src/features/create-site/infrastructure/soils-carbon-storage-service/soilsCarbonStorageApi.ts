import {
  GetSiteSoilsCarbonStoragePayload,
  SiteSoilsCarbonStorageResult,
  SoilsCarbonStorageGateway,
} from "../../application/siteSoilsCarbonStorage.actions";

import { objectToQueryParams } from "@/shared/services/object-query-parameters/objectToQueryParameters";

export class SoilsCarbonStorageApi implements SoilsCarbonStorageGateway {
  constructor() {}

  async getForCityCodeAndSoils({
    cityCode,
    soils,
  }: GetSiteSoilsCarbonStoragePayload) {
    const queryString = objectToQueryParams({ cityCode, soils });
    const response = await fetch(
      `/api/site-soils-carbon-storage?${queryString}`,
    );

    if (!response.ok) throw new Error("Error while computing carbon storage");

    const jsonResponse =
      (await response.json()) as SiteSoilsCarbonStorageResult;
    return jsonResponse;
  }
}
