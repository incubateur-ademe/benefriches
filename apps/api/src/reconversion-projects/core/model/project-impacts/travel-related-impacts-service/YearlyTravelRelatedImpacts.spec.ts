/* eslint-disable @typescript-eslint/dot-notation */
import { YearlyTravelRelatedImpacts } from "./YearlyTravelRelatedImpacts";

describe("YearlyTravelRelatedImpacts", () => {
  const props = {
    siteSquareMetersSurfaceArea: 10000,
    citySquareMetersSurfaceArea: 6000000000,
    cityPopulation: 300000,
    evaluationPeriodInYears: 10,
    operationsFirstYear: 2025,
  };
  describe("Influence radius", () => {
    it("returns influence radius of 500 meters", () => {
      const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
        siteSquareMetersSurfaceArea: 10000,
        citySquareMetersSurfaceArea: 6000000000,
        cityPopulation: 300000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          OFFICES: 1500,
          LOCAL_STORE: 500,
          ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
        },
      });
      expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(500);
    });
    it("returns influence radius of 100 meters", () => {
      const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          OFFICES: 100,
          LOCAL_STORE: 45,
        },
      });
      expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(100);
    });
    it("returns no influence radius", () => {
      const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
        },
      });
      expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(0);
    });
    it("returns influence radius of 200 meters", () => {
      const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          OFFICES: 150,
          LOCAL_STORE: 35,
          ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 100,
        },
      });
      expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(200);
    });
    it("returns influence radius of 500 meters with CULTURAL_PLACE", () => {
      const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          OFFICES: 250,
          LOCAL_STORE: 55,
          ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
          CULTURAL_PLACE: 30,
        },
      });
      expect(yearlyTravelRelatedImpacts["influenceRadius"]).toEqual(500);
    });
  });
  it("computes avoided accidents injuries and deaths and their costs for a year", () => {
    const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
      siteSquareMetersSurfaceArea: 10000,
      citySquareMetersSurfaceArea: 6000000000,
      cityPopulation: 300000,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 160000000,
        OFFICES: 1500,
        LOCAL_STORE: 500,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
      },
    });
    expect(yearlyTravelRelatedImpacts["avoidedMinorInjuriesPerYear"]).toBeCloseTo(44.4, 1);
    expect(yearlyTravelRelatedImpacts["avoidedSevereInjuriesPerYear"]).toBeCloseTo(2.8, 1);
    expect(yearlyTravelRelatedImpacts["avoidedDeathsPerYear"]).toBeCloseTo(0.8, 1);

    expect(yearlyTravelRelatedImpacts["avoidedAccidentsMinorInjuriesExpensesPerYear"]).toBeCloseTo(
      860302,
      0,
    );
    expect(yearlyTravelRelatedImpacts["avoidedAccidentsSevereInjuriesExpensesPerYear"]).toBeCloseTo(
      1344244,
      0,
    );
    expect(yearlyTravelRelatedImpacts["avoidedAccidentsDeathsExpensesPerYear"]).toBeCloseTo(
      3212221,
      0,
    );
  });

  it("computes avoided yearly impacts related to avoided travel", () => {
    const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
      siteSquareMetersSurfaceArea: 15000,
      citySquareMetersSurfaceArea: 15000000,
      cityPopulation: 18000,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 1500,
        LOCAL_STORE: 1000,
        OFFICES: 1000,
        CULTURAL_PLACE: 500,
        SPORTS_FACILITIES: 1000,
      },
    });

    expect(yearlyTravelRelatedImpacts["avoidedPropertyDamageExpensesPerYear"]).toBeCloseTo(58.6, 1);
    expect(yearlyTravelRelatedImpacts["avoidedAirPollutionHealthExpensesPerYear"]).toBeCloseTo(
      3099,
      1,
    );
    expect(yearlyTravelRelatedImpacts["avoidedKilometersPerVehiculeExpensesPerYear"]).toBeCloseTo(
      23536.78,
    );
    expect(yearlyTravelRelatedImpacts["travelTimeSavedPerTravelerPerYear"]).toBeCloseTo(7900.07);
    expect(yearlyTravelRelatedImpacts["travelTimeAvoidedCostsPerTravelerPerYear"]).toBeCloseTo(
      78763.75,
    );
  });
});
