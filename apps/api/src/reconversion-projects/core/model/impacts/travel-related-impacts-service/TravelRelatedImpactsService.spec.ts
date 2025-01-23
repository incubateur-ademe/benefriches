/* eslint-disable @typescript-eslint/dot-notation */
import { TravelRelatedImpactsService } from "./TravelRelatedImpactsService";

describe("TravelRelatedImpactsService", () => {
  describe("TravelRelatedImpactsService: public methods", () => {
    let travelRelatedImpactsService: TravelRelatedImpactsService;
    beforeAll(() => {
      travelRelatedImpactsService = new TravelRelatedImpactsService({
        siteSquareMetersSurfaceArea: 10000,
        citySquareMetersSurfaceArea: 6000000000,
        cityPopulation: 300000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          TERTIARY_ACTIVITIES: 1500,
          GROUND_FLOOR_RETAIL: 500,
          SHIPPING_OR_INDUSTRIAL_BUILDINGS: 200,
        },
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });
    });

    it("computes influence radius from economic activity and public cultural and sportive buildings surfaces", () => {
      expect(travelRelatedImpactsService["influenceRadius"]).toEqual(500);

      const props = {
        siteSquareMetersSurfaceArea: 10000,
        citySquareMetersSurfaceArea: 6000000000,
        cityPopulation: 300000,
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      };

      travelRelatedImpactsService = new TravelRelatedImpactsService({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          TERTIARY_ACTIVITIES: 100,
          GROUND_FLOOR_RETAIL: 45,
        },
      });
      expect(travelRelatedImpactsService["influenceRadius"]).toEqual(100);
      travelRelatedImpactsService = new TravelRelatedImpactsService({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
        },
      });
      expect(travelRelatedImpactsService["influenceRadius"]).toEqual(0);

      travelRelatedImpactsService = new TravelRelatedImpactsService({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          TERTIARY_ACTIVITIES: 150,
          GROUND_FLOOR_RETAIL: 35,
          SHIPPING_OR_INDUSTRIAL_BUILDINGS: 100,
        },
      });
      expect(travelRelatedImpactsService["influenceRadius"]).toEqual(200);

      travelRelatedImpactsService = new TravelRelatedImpactsService({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          TERTIARY_ACTIVITIES: 250,
          GROUND_FLOOR_RETAIL: 55,
          SHIPPING_OR_INDUSTRIAL_BUILDINGS: 200,
          SOCIO_CULTURAL_PLACE: 30,
        },
      });
      expect(travelRelatedImpactsService["influenceRadius"]).toEqual(500);
    });

    it("computes avoided accidents injuries and deaths for duration with low avoided kilometers", () => {
      expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuries()).toEqual(0);
      expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuries()).toEqual(0);
      expect(travelRelatedImpactsService.getAvoidedAccidentsDeaths()).toEqual(0);

      expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesMonetaryValue()).toEqual(
        0,
      );
      expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesMonetaryValue()).toEqual(
        0,
      );
      expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesMonetaryValue()).toEqual(
        0,
      );
    });

    it("computes avoided accidents injuries and deaths for duration with high avoided kilometers", () => {
      travelRelatedImpactsService = new TravelRelatedImpactsService({
        siteSquareMetersSurfaceArea: 10000,
        citySquareMetersSurfaceArea: 6000000000,
        cityPopulation: 300000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 160000000,
          TERTIARY_ACTIVITIES: 1500,
          GROUND_FLOOR_RETAIL: 500,
          SHIPPING_OR_INDUSTRIAL_BUILDINGS: 200,
        },
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });
      expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuries()).toEqual(443);
      expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuries()).toEqual(27);
      expect(travelRelatedImpactsService.getAvoidedAccidentsDeaths()).toEqual(8);

      expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesMonetaryValue()).toEqual(
        7088000,
      );
      expect(
        travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesMonetaryValue(),
      ).toBeCloseTo(10800000);
      expect(travelRelatedImpactsService.getAvoidedAccidentsDeathsMonetaryValue()).toBeCloseTo(
        25600000,
      );
    });

    it("returns socioeconomic, social and environment impacts related to travel", () => {
      const travelRelatedImpactsService = new TravelRelatedImpactsService({
        siteSquareMetersSurfaceArea: 15000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 1500,
          GROUND_FLOOR_RETAIL: 1000,
          TERTIARY_ACTIVITIES: 1000,
          SOCIO_CULTURAL_PLACE: 500,
          SPORTS_FACILITIES: 1000,
        },
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });

      expect(travelRelatedImpactsService.getSocioEconomicList()).toEqual([
        {
          actor: "french_society",
          amount: 30990.09,
          impact: "avoided_air_pollution",
          impactCategory: "social_monetary",
        },
        {
          actor: "local_people",
          amount: 196139.79,
          impact: "avoided_car_related_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "french_society",
          amount: 586.05,
          impact: "avoided_property_damages_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "local_people",
          amount: 790007.5,
          impact: "travel_time_saved",
          impactCategory: "social_monetary",
        },
      ]);
      expect(travelRelatedImpactsService.getEnvironmentalImpacts()).toEqual({
        avoidedCarTrafficCo2EqEmissions: 308.33,
      });
      expect(travelRelatedImpactsService.getAvoidedCo2EqEmissionsDetails()).toEqual([
        {
          amount: 76438.22,
          impact: "avoided_traffic_co2_eq_emissions",
        },
      ]);
      expect(travelRelatedImpactsService.getSocialImpacts()).toMatchObject({
        travelTimeSaved: 79000.75,
      });
    });
  });
});
