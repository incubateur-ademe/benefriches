/* oxlint-disable typescript/dot-notation */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

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
      assert.strictEqual(yearlyTravelRelatedImpacts["influenceRadius"], 500);
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
      assert.strictEqual(yearlyTravelRelatedImpacts["influenceRadius"], 100);
    });
    it("returns no influence radius", () => {
      const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
        },
      });
      assert.strictEqual(yearlyTravelRelatedImpacts["influenceRadius"], 0);
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
      assert.strictEqual(yearlyTravelRelatedImpacts["influenceRadius"], 200);
    });
    it("returns influence radius of 500 meters with OTHER_CULTURAL_PLACE", () => {
      const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          OFFICES: 250,
          LOCAL_STORE: 55,
          ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
          OTHER_CULTURAL_PLACE: 30,
        },
      });
      assert.strictEqual(yearlyTravelRelatedImpacts["influenceRadius"], 500);
    });
    it("returns influence radius of 500 meters with THEATER AND SPORTS_FACILITIES", () => {
      const yearlyTravelRelatedImpacts = new YearlyTravelRelatedImpacts({
        ...props,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 10000,
          OFFICES: 250,
          LOCAL_STORE: 55,
          ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
          THEATER: 30,
          SPORTS_FACILITIES: 30,
        },
      });
      assert.strictEqual(yearlyTravelRelatedImpacts["influenceRadius"], 500);
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
    assert.deepStrictEqual(yearlyTravelRelatedImpacts["avoidedMinorInjuriesPerYear"], 44);
    assert.deepStrictEqual(yearlyTravelRelatedImpacts["avoidedSevereInjuriesPerYear"], 2);
    assert.deepStrictEqual(yearlyTravelRelatedImpacts["avoidedDeathsPerYear"], 0);

    assert.deepStrictEqual(
      yearlyTravelRelatedImpacts["avoidedAccidentsMinorInjuriesExpensesPerYear"],
      852940,
    );
    assert.deepStrictEqual(
      yearlyTravelRelatedImpacts["avoidedAccidentsSevereInjuriesExpensesPerYear"],
      969266,
    );
    assert.deepStrictEqual(yearlyTravelRelatedImpacts["avoidedAccidentsDeathsExpensesPerYear"], 0);
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
        OTHER_CULTURAL_PLACE: 500,
        SPORTS_FACILITIES: 1000,
      },
    });

    assert.ok(
      Math.abs(yearlyTravelRelatedImpacts["avoidedPropertyDamageExpensesPerYear"] - 58.6) <
        Math.pow(10, -1) / 2,
    );
    assert.ok(
      Math.abs(yearlyTravelRelatedImpacts["avoidedAirPollutionHealthExpensesPerYear"] - 3099) <
        Math.pow(10, -1) / 2,
    );
    assert.ok(
      Math.abs(
        yearlyTravelRelatedImpacts["avoidedKilometersPerVehiculeExpensesPerYear"] - 23536.78,
      ) < 0.005,
    );
    assert.ok(
      Math.abs(yearlyTravelRelatedImpacts["travelTimeSavedPerTravelerPerYear"] - 7900.07) < 0.005,
    );
    assert.ok(
      Math.abs(yearlyTravelRelatedImpacts["travelTimeAvoidedCostsPerTravelerPerYear"] - 78763.75) <
        0.005,
    );
  });
});
