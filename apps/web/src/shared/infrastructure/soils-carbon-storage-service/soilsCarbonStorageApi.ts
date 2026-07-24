import {
  GetSoilsCarbonStoragePayload,
  SoilsCarbonStorageGateway,
  SoilsCarbonStorageResult,
} from "@/shared/core/gateways/SoilsCarbonStorageGateway";
import { objectToQueryParams } from "@/shared/core/object-query-parameters/objectToQueryParameters";

export class SoilsCarbonStorageApi implements SoilsCarbonStorageGateway {
  async getForCityCodeAndSoils({
    cityCode,
    soils,
  }: GetSoilsCarbonStoragePayload): Promise<SoilsCarbonStorageResult> {
    const soilsDistributionAsArray: { type: string; surfaceArea: number }[] = Object.entries(
      soils,
    ).map(([type, surfaceArea]) => ({
      type,
      surfaceArea,
    }));
    const queryString = objectToQueryParams({ cityCode, soils: soilsDistributionAsArray });
    const response = await fetch(`/api/carbon-storage/site-soils?${queryString}`);

    if (!response.ok) throw new Error("Error while computing carbon storage");

    const jsonResponse = (await response.json()) as SoilsCarbonStorageResult;
    return jsonResponse;
  }
}
