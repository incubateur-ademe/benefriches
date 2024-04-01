import {
  computeCO2eqMonetaryValueForYear,
  computeEnvironmentalMonetaryImpacts,
  computeSoilsCarbonStorage,
  computeSoilsDifferential,
  type EnvironmentalMonetaryImpactResult,
} from "./computeEnvironmentalMonetaryImpacts";

describe("Environmental monetary impacts", () => {
  it("returns no impact when no soils differential", () => {
    const result = computeEnvironmentalMonetaryImpacts({
      evaluationPeriodInYears: 10,
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      baseSoilsCarbonStorage: 0,
      forecastSoilsCarbonStorage: 0,
      operationsFirstYear: 2024,
    });
    expect(result).toEqual<EnvironmentalMonetaryImpactResult>([]);
  });

  describe("computeSoilsDifferential", () => {
    it("return empty object", () => {
      const result = computeSoilsDifferential({}, {});
      expect(result).toEqual({});
    });

    it("return no difference", () => {
      const result = computeSoilsDifferential(
        { PRAIRIE_BUSHES: 1000, FOREST_CONIFER: 200 },
        { PRAIRIE_BUSHES: 1000, FOREST_CONIFER: 200 },
      );
      expect(result).toEqual({ PRAIRIE_BUSHES: 0, FOREST_CONIFER: 0 });
    });

    it("compute soils differential between base and forecast", () => {
      const result = computeSoilsDifferential(
        {
          PRAIRIE_BUSHES: 1000,
          FOREST_CONIFER: 200,
          WET_LAND: 250,
          CULTIVATION: 100,
          VINEYARD: 50,
          ORCHARD: 50,
          MINERAL_SOIL: 85,
        },
        {
          PRAIRIE_BUSHES: 2000,
          FOREST_CONIFER: 150,
          WET_LAND: 300,
          ARTIFICIAL_TREE_FILLED: 300,
        },
      );
      expect(result).toEqual({
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: -50,
        WET_LAND: 50,
        CULTIVATION: -100,
        VINEYARD: -50,
        ORCHARD: -50,
        MINERAL_SOIL: -85,
        ARTIFICIAL_TREE_FILLED: 300,
      });
    });
  });

  it("returns positive enviromental monetary value for soils differential", () => {
    const result = computeEnvironmentalMonetaryImpacts({
      evaluationPeriodInYears: 10,
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 250,
        CULTIVATION: 100,
        VINEYARD: 50,
        ORCHARD: 50,
        MINERAL_SOIL: 85,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 2000,
        FOREST_CONIFER: 150,
        WET_LAND: 300,
        ARTIFICIAL_TREE_FILLED: 300,
      },
      baseSoilsCarbonStorage: 100,
      forecastSoilsCarbonStorage: 150,
      operationsFirstYear: 2024,
      avoidedCO2TonsWithEnergyProduction: 10000,
    });
    expect(result).toEqual<EnvironmentalMonetaryImpactResult>([
      {
        amount: 13500000,
        impact: "avoided_co2_eq_with_enr",
        impactCategory: "environmental_monetary",
        actor: "human_society",
      },
      {
        amount: 27111,
        impact: "ecosystem_services",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: [
          { amount: 24750, impact: "carbon_storage" },
          { amount: 67, impact: "nature_related_wellness_and_leisure" },
          { amount: 120, impact: "pollination" },
          { amount: 44, impact: "invasive_species_regulation" },
          { amount: 1690, impact: "water_cycle" },
          { amount: 115, impact: "nitrogen_cycle" },
          { amount: 325, impact: "soil_erosion" },
        ],
      },
    ]);
  });

  it("returns negative enviromental monetary value for soils differential", () => {
    const result = computeEnvironmentalMonetaryImpacts({
      evaluationPeriodInYears: 10,
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 250,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 500,
        FOREST_CONIFER: 150,
        WET_LAND: 250,
        IMPERMEABLE_SOILS: 500,
      },
      baseSoilsCarbonStorage: 250,
      forecastSoilsCarbonStorage: 150,
      operationsFirstYear: 2024,
    });
    expect(result).toEqual<EnvironmentalMonetaryImpactResult>([
      {
        amount: -50382,
        impact: "ecosystem_services",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: [
          { amount: -49500, impact: "carbon_storage" },
          { amount: -51, impact: "nature_related_wellness_and_leisure" },
          { amount: -51, impact: "pollination" },
          { amount: -746, impact: "water_cycle" },
          { amount: -34, impact: "nitrogen_cycle" },
        ],
      },
    ]);
  });

  describe("computeSoilsCarbonStorage", () => {
    it("compute CO2 eq monetary value for a year", () => {
      expect(computeCO2eqMonetaryValueForYear(2025)).toEqual(150);
      expect(computeCO2eqMonetaryValueForYear(2027)).toEqual(184);
      expect(computeCO2eqMonetaryValueForYear(2030)).toEqual(250);
    });

    it("compute with operationsFirstYear", () => {
      const result = computeSoilsCarbonStorage(25, 30, 2028);
      expect(Math.round(result)).toEqual(3740);
    });
  });
});
