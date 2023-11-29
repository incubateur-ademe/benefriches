import {
  GetSoilsCarbonStoragePayload,
  SoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/shared/domain/gateways/SoilsCarbonStorageApi";
import { objectToQueryParams } from "@/shared/services/object-query-parameters/objectToQueryParameters";

export class SoilsCarbonStorageApi implements SoilsCarbonStorageGateway {
  constructor() {}

  async getForCityCodeAndSoils({
    cityCode,
    soils,
  }: GetSoilsCarbonStoragePayload) {
    const queryString = objectToQueryParams({ cityCode, soils });
    const response = await fetch(
      `/api/carbon-storage/site-soils?${queryString}`,
    );

    if (!response.ok) throw new Error("Error while computing carbon storage");

    const jsonResponse = (await response.json()) as SoilsCarbonStorageResult;
    return jsonResponse;
  }
}
