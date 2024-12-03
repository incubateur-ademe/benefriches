import { MockLocalDataInseeService } from "src/location-features/adapters/secondary/city-data-provider/LocalDataInseeService.mock";
import { MockDV3FApiService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService.mock";
import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";

import { getDevelopmentPlanRelatedImpacts } from "./developmentPlanFeaturesImpacts";

describe("Photovoltaic power plant specific impacts: Avoided CO2 eq emissions with EnR production", () => {
  it("returns householdsPoweredByRenewableEnergy, avoidedCO2TonsWithEnergyProduction and socioEconomic avoidedCO2TonsWithEnergyProduction", async () => {
    const result = await getDevelopmentPlanRelatedImpacts({
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
      siteCityCode: "69000",
      siteIsFriche: true,
      siteSurfaceArea: 20000,
      developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
      developmentPlanFeatures: {
        surfaceArea: 5000,
        electricalPowerKWc: 53,
        contractDuration: 20,
        expectedAnnualProduction: 4679,
      },
      getCityRelatedDataService: new GetCityRelatedDataService(
        new MockLocalDataInseeService(),
        new MockDV3FApiService(),
      ),
    });

    expect(result).toMatchObject({
      socioeconomic: [
        {
          amount: expect.any(Number) as number,
          impact: "avoided_co2_eq_with_enr",
          impactCategory: "environmental_monetary",
          actor: "human_society",
        },
      ],
      avoidedCO2TonsWithEnergyProduction: { current: 0, forecast: expect.any(Number) as number },
      householdsPoweredByRenewableEnergy: { current: 0, forecast: expect.any(Number) as number },
    });
  });
});

describe("Urban project specific impacts: Local property value increase related impacts", () => {
  it("returns socioeconomic impacts related to local property value increase for friche", async () => {
    const result = await getDevelopmentPlanRelatedImpacts({
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
      siteSurfaceArea: 15000,
      siteIsFriche: true,
      siteCityCode: "38522",
      developmentPlanType: "URBAN_PROJECT",
      developmentPlanFeatures: {
        buildingsFloorAreaDistribution: { RESIDENTIAL: 11000 },
        spacesDistribution: { BUILDINGS_FOOTPRINT: 1000 },
      },
      getCityRelatedDataService: new GetCityRelatedDataService(
        new MockLocalDataInseeService(),
        new MockDV3FApiService(),
      ),
    });

    expect(result.socioeconomic).toContainEqual({
      actor: "local_residents",
      amount: expect.any(Number) as number,
      impact: "local_property_value_increase",
      impactCategory: "economic_indirect",
    });
    expect(result.socioeconomic).toContainEqual({
      actor: "community",
      amount: expect.any(Number) as number,
      impact: "local_transfer_duties_increase",
      impactCategory: "economic_indirect",
    });
  });

  it("returns no impacts related to local property value increase for non friche", async () => {
    const result = await getDevelopmentPlanRelatedImpacts({
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
      siteSurfaceArea: 15000,
      siteIsFriche: false,
      siteCityCode: "38522",
      getCityRelatedDataService: new GetCityRelatedDataService(
        new MockLocalDataInseeService(),
        new MockDV3FApiService(),
      ),
    });

    expect(
      result.socioeconomic.some(({ impact }) => impact === "local_property_value_increase"),
    ).toBe(false);
    expect(
      result.socioeconomic.some(({ impact }) => impact === "local_transfer_duties_increase"),
    ).toBe(false);
  });
});
