/* eslint-disable @typescript-eslint/dot-notation */
import { EcosystemServicesImpact } from "shared";

import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";
import { EnvironmentalSoilsRelatedImpactsService } from "./EnvironmentalSoilsRelatedImpactsService";

describe("EnvironmentalSoilsRelatedService.spec", () => {
  describe("computeSoilsDifferential", () => {
    it("return empty object", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1200,
        baseSoilsDistribution: {},
        forecastSoilsDistribution: {},
        siteContaminatedSurfaceArea: 0,
        projectDecontaminedSurfaceArea: 0,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });
      expect(environmentalSoilsRelatedImpactService["soilsDifferential"]).toEqual({});
    });

    it("return no difference", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1200,
        baseSoilsDistribution: { PRAIRIE_BUSHES: 1000, FOREST_CONIFER: 200 },
        forecastSoilsDistribution: { PRAIRIE_BUSHES: 1000, FOREST_CONIFER: 200 },
        siteContaminatedSurfaceArea: 0,
        projectDecontaminedSurfaceArea: 0,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });
      expect(environmentalSoilsRelatedImpactService["soilsDifferential"]).toEqual({
        PRAIRIE_BUSHES: 0,
        FOREST_CONIFER: 0,
      });
    });

    it("compute soils differential between base and forecast", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1200,
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
        siteContaminatedSurfaceArea: 0,
        projectDecontaminedSurfaceArea: 0,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });

      expect(environmentalSoilsRelatedImpactService["soilsDifferential"]).toEqual({
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
  describe("socioEconomicList result", () => {
    it("returns no impact when no soils differential", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1200,
        baseSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
          FOREST_CONIFER: 200,
        },
        forecastSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
          FOREST_CONIFER: 200,
        },
        siteContaminatedSurfaceArea: 0,
        projectDecontaminedSurfaceArea: 0,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });
      expect(environmentalSoilsRelatedImpactService.getSocioEconomicList()).toEqual([]);
    });

    it("returns no carbon storage impact if no base and forecast provided", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1200,
        baseSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
          FOREST_CONIFER: 200,
        },
        forecastSoilsDistribution: {
          PRAIRIE_BUSHES: 1200,
        },
        siteContaminatedSurfaceArea: 0,
        projectDecontaminedSurfaceArea: 0,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });
      const socioEconomicList = environmentalSoilsRelatedImpactService.getSocioEconomicList();
      const ecosystemServicesResult = socioEconomicList.find(
        ({ impact }) => impact === "ecosystem_services",
      ) as EcosystemServicesImpact | undefined;
      expect(ecosystemServicesResult).toBeDefined();
      expect(
        ecosystemServicesResult?.details.find(({ impact }) => impact === "soils_co2_eq_storage"),
      ).toEqual(undefined);
    });

    it("returns positive environmental monetary value for soils differential", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1200,
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
        baseSoilsCo2eqStorage: 366.666,
        forecastSoilsCo2eqStorage: 550,
        projectDecontaminedSurfaceArea: 1000,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      });
      expect(environmentalSoilsRelatedImpactService.getSocioEconomicList()).toContainEqual({
        amount: 213,
        impact: "water_regulation",
        impactCategory: "environmental_monetary",
        actor: "community",
      });
      expect(environmentalSoilsRelatedImpactService.getSocioEconomicList()).toContainEqual({
        amount: 29627,
        impact: "ecosystem_services",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: [
          { amount: 27500, impact: "soils_co2_eq_storage" },
          { amount: 60, impact: "nature_related_wellness_and_leisure" },
          { amount: 108, impact: "pollination" },
          { amount: 40, impact: "invasive_species_regulation" },
          { amount: 1523, impact: "water_cycle" },
          { amount: 103, impact: "nitrogen_cycle" },
          { amount: 293, impact: "soil_erosion" },
        ],
      });
    });

    it("returns negative environmental monetary value for soils differential", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1200,
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
        baseSoilsCo2eqStorage: 916.666,
        forecastSoilsCo2eqStorage: 550,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      });

      expect(environmentalSoilsRelatedImpactService.getSocioEconomicList()).toContainEqual({
        amount: -58,
        impact: "water_regulation",
        impactCategory: "environmental_monetary",
        actor: "community",
      });

      expect(environmentalSoilsRelatedImpactService.getSocioEconomicList()).toContainEqual({
        amount: -55795,
        impact: "ecosystem_services",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: [
          { amount: -55000, impact: "soils_co2_eq_storage" },
          { amount: -46, impact: "nature_related_wellness_and_leisure" },
          { amount: -46, impact: "pollination" },
          { amount: -672, impact: "water_cycle" },
          { amount: -31, impact: "nitrogen_cycle" },
        ],
      });
    });
  });

  describe("nonContaminatedSurfaceAreaImpact", () => {
    it("returns 1000 for current and forecast impact when no contamination a 1000 square meters site", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1000,
        baseSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
        },
        forecastSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
        },
        siteContaminatedSurfaceArea: 0,
        projectDecontaminedSurfaceArea: 0,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });

      expect(
        environmentalSoilsRelatedImpactService.getEnvironmentalImpacts().nonContaminatedSurfaceArea,
      ).toEqual({
        base: 1000,
        forecast: 1000,
        difference: 0,
      });
    });

    it("returns 750 for current and 1000 for forecast impact when 250 square meters of contaminated surface are on a 1000 square meters site", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1000,
        baseSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
        },
        forecastSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
        },
        siteContaminatedSurfaceArea: 250,
        projectDecontaminedSurfaceArea: 250,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });

      expect(
        environmentalSoilsRelatedImpactService.getEnvironmentalImpacts().nonContaminatedSurfaceArea,
      ).toEqual({
        base: 750,
        forecast: 1000,
        difference: 250,
      });
    });

    it("returns 750 for current and 850 for forecast impact when 100 m² will be decontaminated", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1000,
        baseSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
        },
        forecastSoilsDistribution: {
          PRAIRIE_BUSHES: 1000,
        },
        siteContaminatedSurfaceArea: 250,
        projectDecontaminedSurfaceArea: 100,
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });
      expect(
        environmentalSoilsRelatedImpactService.getEnvironmentalImpacts().nonContaminatedSurfaceArea,
      ).toEqual({
        base: 750,
        forecast: 850,
        difference: 100,
      });
    });
  });

  describe("permeableSurfaceArea impact", () => {
    it("returns no difference when no change in soils distribution", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1055,
        baseSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 25,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        forecastSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 25,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });
      expect(
        environmentalSoilsRelatedImpactService.getEnvironmentalImpacts().permeableSurfaceArea,
      ).toEqual({
        base: 920,
        forecast: 920,
        difference: 0,
        greenSoil: {
          base: 600,
          forecast: 600,
          difference: 0,
        },
        mineralSoil: {
          base: 320,
          forecast: 320,
          difference: 0,
        },
      });
    });

    it("returns impact when more mineral soils in forecast", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1055,
        baseSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 25,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        forecastSoilsDistribution: {
          IMPERMEABLE_SOILS: 100,
          BUILDINGS: 25,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 420,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });

      expect(
        environmentalSoilsRelatedImpactService.getEnvironmentalImpacts().permeableSurfaceArea,
      ).toEqual({
        base: 920,
        forecast: 1020,
        difference: 100,
        greenSoil: {
          base: 600,
          forecast: 600,
          difference: 0,
        },
        mineralSoil: {
          base: 320,
          forecast: 420,
          difference: 100,
        },
      });
    });
    it("returns impact when more green soils in forecast", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1055,
        baseSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        forecastSoilsDistribution: {
          IMPERMEABLE_SOILS: 100,
          BUILDINGS: 0,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 300,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });

      expect(
        environmentalSoilsRelatedImpactService.getEnvironmentalImpacts().permeableSurfaceArea,
      ).toEqual({
        base: 920,
        forecast: 1120,
        difference: 200,
        greenSoil: {
          base: 600,
          forecast: 800,
          difference: 200,
        },
        mineralSoil: {
          base: 320,
          forecast: 320,
          difference: 0,
        },
      });
    });
    it("returns impact when more green and mineral soils in forecast", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1055,
        baseSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        forecastSoilsDistribution: {
          IMPERMEABLE_SOILS: 0,
          BUILDINGS: 0,
          MINERAL_SOIL: 420,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 300,
          PRAIRIE_GRASS: 500,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });

      expect(
        environmentalSoilsRelatedImpactService.getEnvironmentalImpacts().permeableSurfaceArea,
      ).toEqual({
        base: 920,
        forecast: 1220,
        difference: 300,
        greenSoil: {
          base: 600,
          forecast: 800,
          difference: 200,
        },
        mineralSoil: {
          base: 320,
          forecast: 420,
          difference: 100,
        },
      });
    });
    it("returns negative impact when everything is impermeable in forecast", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1055,
        baseSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        forecastSoilsDistribution: {
          IMPERMEABLE_SOILS: 1000,
          BUILDINGS: 220,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2024,
        }),
      });
      expect(
        environmentalSoilsRelatedImpactService.getEnvironmentalImpacts().permeableSurfaceArea,
      ).toEqual({
        base: 920,
        forecast: 0,
        difference: -920,
        greenSoil: {
          base: 600,
          forecast: 0,
          difference: -600,
        },
        mineralSoil: {
          base: 320,
          forecast: 0,
          difference: -320,
        },
      });
    });
  });
});
