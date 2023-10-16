import {
  GetSiteSoilsCarbonSequestrationPayload,
  SiteSoilsCarbonSequestrationResult,
  SoilsCarbonSequestrationGateway,
} from "../../application/siteSoilsCarbonSequestration.actions";

export class SoilsCarbonSequestrationApi
  implements SoilsCarbonSequestrationGateway
{
  constructor() {}

  async getForCityCodeAndSoils({
    cityCode,
  }: GetSiteSoilsCarbonSequestrationPayload) {
    const response = await fetch(
      `/api/site-soils-carbon-sequestration?cityCode=${cityCode}`,
    );

    if (!response.ok)
      throw new Error("Error while computing carbon sequestration");

    const jsonResponse =
      (await response.json()) as SiteSoilsCarbonSequestrationResult;
    return jsonResponse;
  }
}
