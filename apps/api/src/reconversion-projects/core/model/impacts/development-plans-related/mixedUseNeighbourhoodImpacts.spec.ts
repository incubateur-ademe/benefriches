import {
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

    it("returns urban freshness impacts only for site housing if public green spaces in project are small", () => {
      const result = getUrbanFreshnessRelatedImpacts({
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
            amount: 121.23,
            impact: "avoided_air_conditioning_co2_eq_emissions",
            impactCategory: "environmental_monetary",
          },
          {
            actor: "local_residents",
            amount: 745.7386363636363,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
          {
            actor: "local_companies",
            amount: 600,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
        ],
        avoidedAirConditioningCo2EqEmissions: 0.489,
      };
      expect(result).toMatchObject(expected);
    });

    it("returns urban freshness impacts around 500 meters if public green spaces in project are high", () => {
      const result = getUrbanFreshnessRelatedImpacts({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        features: {
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 14000,
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
            amount: 1552.72,
            impact: "avoided_air_conditioning_co2_eq_emissions",
            impactCategory: "environmental_monetary",
          },
          {
            actor: "local_residents",
            amount: 19883.965304603178,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
          {
            actor: "local_companies",
            amount: 600,
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
          },
        ],
        avoidedAirConditioningCo2EqEmissions: 6.263276389045988,
      };
      expect(result).toMatchObject(expected);
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
  });
});
