import { MockLocalDataInseeService } from "src/location-features/adapters/secondary/city-data-provider/LocalDataInseeService.mock";
import { MockDV3FApiService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService.mock";
import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";

import {
  getLocalPropertyValueIncreaseRelatedImpacts,
  getTravelRelatedImpacts,
  getUrbanFreshnessRelatedImpacts,
} from "./mixedUseNeighbourhoodImpacts";

describe("Mixed use neighbourhood specific impacts", () => {
  describe("Urban Freshness related impacts", () => {
    it("returns no urban freshness impacts if there is no public green spaces in project", () => {
      const result = getUrbanFreshnessRelatedImpacts({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        features: {
          buildingsFloorAreaDistribution: {},
          spacesDistribution: {},
        },
        siteSurfaceArea: 15000,
        cityPopulation: 18000,
        citySurfaceArea: 15000000,
      });

      const expected = {
        socioeconomic: [],
      };
      expect(result).toEqual(expected);
    });

    it("returns no urban freshness impacts if there is not enough public green spaces in project for public green space < 5000 m²", () => {
      const result = getUrbanFreshnessRelatedImpacts({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 500,
            GROUND_FLOOR_RETAIL: 100,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 400,
          },
        },
        siteSurfaceArea: 1000,
        cityPopulation: 18000,
        citySurfaceArea: 15000000,
      });

      const expected = {
        socioeconomic: [],
      };
      expect(result).toEqual(expected);
    });

    it("returns no urban freshness impacts if there is not enough public green spaces in project for 5000 < public green space < 10000 m²", () => {
      const result = getUrbanFreshnessRelatedImpacts({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 5000,
            GROUND_FLOOR_RETAIL: 2600,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 400,
          },
        },
        siteSurfaceArea: 8000,
        cityPopulation: 18000,
        citySurfaceArea: 15000000,
      });

      const expected = {
        socioeconomic: [],
      };
      expect(result).toEqual(expected);
    });

    it("returns urban freshness impacts proportional to site surfaceArea and public green space surface for public green space < 5000m²", () => {
      const params = {
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        citySurfaceArea: 15000000,
        cityPopulation: 18000,
        siteSurfaceArea: 4000,
      };

      const newResidentsEffect = getUrbanFreshnessRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 2100,
          },
        },
      });

      const newResidentsAndInfluenceRadiusEffect = getUrbanFreshnessRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 3995,
          },
        },
      });

      const expected = {
        socioeconomic: [
          {
            actor: "human_society",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_co2_eq_emissions",
            impactCategory: "environmental_monetary",
          },
          {
            actor: "local_residents",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
          {
            actor: "local_companies",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
        ],
        avoidedAirConditioningCo2EqEmissions: expect.any(Number) as number,
      };

      expect(newResidentsEffect).toMatchObject(expected);
      expect(newResidentsAndInfluenceRadiusEffect).toMatchObject(expected);

      expect(
        newResidentsEffect.socioeconomic.every(({ amount, impact: smallImpact }) => {
          const bigImpact = newResidentsAndInfluenceRadiusEffect.socioeconomic.find(
            ({ impact: bigImpactName }) => bigImpactName === smallImpact,
          );
          return bigImpact && bigImpact.amount > amount;
        }),
      ).toBe(true);

      expect(
        newResidentsEffect.avoidedAirConditioningCo2EqEmissions &&
          newResidentsAndInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions &&
          newResidentsEffect.avoidedAirConditioningCo2EqEmissions <
            newResidentsAndInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions,
      ).toBe(true);
    });

    it("returns urban freshness impacts proportional to site surfaceArea and public green space surface for public green space surface > 5000m² and < 10000m²", () => {
      const params = {
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        citySurfaceArea: 15000000,
        cityPopulation: 18000,
        siteSurfaceArea: 20000,
      };

      const lowInfluenceRadiusEffect = getUrbanFreshnessRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 5100,
          },
        },
      });

      const highInfluenceRadiusEffect = getUrbanFreshnessRelatedImpacts({
        ...params,
        siteSurfaceArea: 10000,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 9990,
          },
        },
      });

      const expected = {
        socioeconomic: [
          {
            actor: "human_society",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_co2_eq_emissions",
            impactCategory: "environmental_monetary",
          },
          {
            actor: "local_residents",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
          {
            actor: "local_companies",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
        ],
        avoidedAirConditioningCo2EqEmissions: expect.any(Number) as number,
      };

      expect(lowInfluenceRadiusEffect).toMatchObject(expected);
      expect(highInfluenceRadiusEffect).toMatchObject(expected);

      expect(
        lowInfluenceRadiusEffect.socioeconomic.every(({ amount, impact: smallImpact }) => {
          const bigImpact = highInfluenceRadiusEffect.socioeconomic.find(
            ({ impact: bigImpactName }) => bigImpactName === smallImpact,
          );
          return bigImpact && bigImpact.amount > amount;
        }),
      ).toBe(true);

      expect(
        lowInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions &&
          highInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions &&
          lowInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions <
            highInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions,
      ).toBe(true);
    });

    it("returns urban freshness impacts proportional to site surfaceArea and public green space surface for public green space surface > 10000m²", () => {
      const params = {
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        citySurfaceArea: 15000000,
        cityPopulation: 18000,
        siteSurfaceArea: 120000,
      };

      const newResidentsEffect = getUrbanFreshnessRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 11111,
          },
        },
      });

      const lowInfluenceRadiusEffect = getUrbanFreshnessRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 65600,
          },
        },
      });

      const highInfluenceRadiusEffect = getUrbanFreshnessRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 119000,
          },
        },
      });

      const expected = {
        socioeconomic: [
          {
            actor: "human_society",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_co2_eq_emissions",
            impactCategory: "environmental_monetary",
          },
          {
            actor: "local_residents",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
          {
            actor: "local_companies",
            amount: expect.any(Number) as number,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
        ],
        avoidedAirConditioningCo2EqEmissions: expect.any(Number) as number,
      };
      expect(newResidentsEffect).toMatchObject(expected);
      expect(lowInfluenceRadiusEffect).toMatchObject(expected);
      expect(highInfluenceRadiusEffect).toMatchObject(expected);

      expect(
        newResidentsEffect.socioeconomic.every(({ amount, impact: smallImpact }) => {
          const bigImpact = lowInfluenceRadiusEffect.socioeconomic.find(
            ({ impact: bigImpactName }) => bigImpactName === smallImpact,
          );
          return bigImpact && bigImpact.amount > amount;
        }),
      ).toBe(true);

      expect(
        newResidentsEffect.avoidedAirConditioningCo2EqEmissions &&
          lowInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions &&
          newResidentsEffect.avoidedAirConditioningCo2EqEmissions <
            lowInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions,
      ).toBe(true);

      expect(
        lowInfluenceRadiusEffect.socioeconomic.every(({ amount, impact: smallImpact }) => {
          const bigImpact = highInfluenceRadiusEffect.socioeconomic.find(
            ({ impact: bigImpactName }) => bigImpactName === smallImpact,
          );
          return bigImpact && bigImpact.amount > amount;
        }),
      ).toBe(true);

      expect(
        lowInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions &&
          highInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions &&
          lowInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions <
            highInfluenceRadiusEffect.avoidedAirConditioningCo2EqEmissions,
      ).toBe(true);
    });
  });

  describe("Travel related impacts", () => {
    it("returns socioeconomic, social and environment impacts related to travel", () => {
      const result = getTravelRelatedImpacts({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 1500,
          },
        },
        siteSurfaceArea: 15000,
        cityPopulation: 18000,
        citySurfaceArea: 15000000,
      });

      const expected = {
        socioeconomic: [
          {
            actor: "human_society",
            amount: expect.any(Number) as number,
            impact: "avoided_traffic_co2_eq_emissions",
            impactCategory: "environmental_monetary",
          },
          {
            actor: "human_society",
            amount: expect.any(Number) as number,
            impact: "avoided_air_pollution",
            impactCategory: "environmental_monetary",
          },
          {
            actor: "local_residents",
            amount: expect.any(Number) as number,
            impact: "avoided_car_related_expenses",
            impactCategory: "economic_indirect",
          },
          {
            actor: "local_workers",
            amount: expect.any(Number) as number,
            impact: "avoided_car_related_expenses",
            impactCategory: "economic_indirect",
          },
          {
            actor: "french_society",
            amount: expect.any(Number) as number,
            impact: "avoided_property_damages_expenses",
            impactCategory: "economic_indirect",
          },
          {
            actor: "local_residents",
            amount: expect.any(Number) as number,
            impact: "travel_time_saved",
            impactCategory: "social_monetary",
          },
          {
            actor: "local_workers",
            amount: expect.any(Number) as number,
            impact: "travel_time_saved",
            impactCategory: "social_monetary",
          },
        ],
        avoidedVehiculeKilometers: expect.any(Number) as number,
        travelTimeSaved: expect.any(Number) as number,
        avoidedCarTrafficCo2EqEmissions: expect.any(Number) as number,
      };
      expect(result).toMatchObject(expected);
    });

    it("returns impacts related to travel proportionaly to surface created", () => {
      const params = {
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        siteSurfaceArea: 15000,
        cityPopulation: 18000,
        citySurfaceArea: 15000000,
      };
      const residentsInfluenceImpact = getTravelRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 0,
          },
          spacesDistribution: {},
        },
      });

      const firstLevelInfluenceRadiusImpact = getTravelRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 100,
          },
          spacesDistribution: {},
        },
      });

      const secondLevelInfluenceRadiusImpact = getTravelRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 200,
          },
          spacesDistribution: {},
        },
      });

      const thirdLevelInfluenceRadiusImpact = getTravelRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 350,
          },
          spacesDistribution: {},
        },
      });

      const withPublicCulturalAndSportsFacilitiesSurface = getTravelRelatedImpacts({
        ...params,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 250,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 200,
          },
        },
      });

      expect(
        residentsInfluenceImpact.socioeconomic.every(({ amount, impact: smallImpact }) => {
          const bigImpact = firstLevelInfluenceRadiusImpact.socioeconomic.find(
            ({ impact: bigImpactName }) => bigImpactName === smallImpact,
          );
          return bigImpact && bigImpact.amount > amount;
        }),
      ).toBe(true);

      expect(
        firstLevelInfluenceRadiusImpact.socioeconomic.every(({ amount, impact: smallImpact }) => {
          const bigImpact = secondLevelInfluenceRadiusImpact.socioeconomic.find(
            ({ impact: bigImpactName }) => bigImpactName === smallImpact,
          );
          return bigImpact && bigImpact.amount > amount;
        }),
      ).toBe(true);

      expect(
        secondLevelInfluenceRadiusImpact.socioeconomic.every(({ amount, impact: smallImpact }) => {
          const bigImpact = thirdLevelInfluenceRadiusImpact.socioeconomic.find(
            ({ impact: bigImpactName }) => bigImpactName === smallImpact,
          );
          return bigImpact && bigImpact.amount > amount;
        }),
      ).toBe(true);

      expect(
        secondLevelInfluenceRadiusImpact.socioeconomic.every(({ amount, impact: smallImpact }) => {
          const bigImpact = withPublicCulturalAndSportsFacilitiesSurface.socioeconomic.find(
            ({ impact: bigImpactName }) => bigImpactName === smallImpact,
          );
          return bigImpact && bigImpact.amount > amount;
        }),
      ).toBe(true);
    });
  });

  describe("Local property value increase related impacts", () => {
    it("returns socioeconomic impacts related to local property value increase for friche", async () => {
      const result = await getLocalPropertyValueIncreaseRelatedImpacts({
        evaluationPeriodInYears: 10,
        siteSurfaceArea: 15000,
        cityPopulation: 18000,
        citySurfaceArea: 15000000,
        siteIsFriche: true,
        siteCityCode: "38522",
        getCityRelatedDataService: new GetCityRelatedDataService(
          new MockLocalDataInseeService(),
          new MockDV3FApiService(),
        ),
      });

      const expected = [
        {
          actor: "local_residents",
          amount: expect.any(Number) as number,
          impact: "local_property_value_increase",
          impactCategory: "economic_indirect",
        },
        {
          actor: "community",
          amount: expect.any(Number) as number,
          impact: "local_transfer_duties_increase",
          impactCategory: "economic_indirect",
        },
      ];
      expect(result).toEqual(expected);
    });

    it("returns no impacts related to local property value increase for non friche", async () => {
      const result = await getLocalPropertyValueIncreaseRelatedImpacts({
        evaluationPeriodInYears: 10,
        siteSurfaceArea: 15000,
        cityPopulation: 18000,
        citySurfaceArea: 15000000,
        siteIsFriche: false,
        siteCityCode: "38522",
        getCityRelatedDataService: new GetCityRelatedDataService(
          new MockLocalDataInseeService(),
          new MockDV3FApiService(),
        ),
      });

      expect(result).toEqual([]);
    });
  });
});
