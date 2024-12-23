/* eslint-disable @typescript-eslint/dot-notation */
import { EcosystemServicesImpact } from "shared";

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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      expect(environmentalSoilsRelatedImpactService.formatImpacts().socioEconomicList).toEqual([]);
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      const { socioEconomicList } = environmentalSoilsRelatedImpactService.formatImpacts();
      const ecosystemServicesResult = socioEconomicList.find(
        ({ impact }) => impact === "ecosystem_services",
      ) as EcosystemServicesImpact | undefined;
      expect(ecosystemServicesResult).toBeDefined();
      expect(
        ecosystemServicesResult?.details.find(({ impact }) => impact === "carbon_storage"),
      ).toEqual(undefined);
    });

    it("returns positive enviromental monetary value for soils differential", () => {
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
        baseSoilsCarbonStorage: {
          totalCarbonStorage: 100,
          soilsCarbonStorage: [
            {
              type: "FOREST_CONIFER",
              surfaceArea: 200,
              carbonStorage: 100,
              carbonStorageInTonPerSquareMeters: 100,
            },
          ],
        },
        forecastSoilsCarbonStorage: {
          totalCarbonStorage: 150,
          soilsCarbonStorage: [
            {
              type: "FOREST_CONIFER",
              surfaceArea: 200,
              carbonStorage: 150,
              carbonStorageInTonPerSquareMeters: 100,
            },
          ],
        },
        projectDecontaminedSurfaceArea: 1000,
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().socioEconomicList,
      ).toContainEqual({
        amount: 236,
        impact: "water_regulation",
        impactCategory: "environmental_monetary",
        actor: "community",
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().socioEconomicList,
      ).toContainEqual({
        amount: 27190,
        impact: "ecosystem_services",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: [
          { amount: 24829, impact: "carbon_storage" },
          { amount: 67, impact: "nature_related_wellness_and_leisure" },
          { amount: 120, impact: "pollination" },
          { amount: 44, impact: "invasive_species_regulation" },
          { amount: 1690, impact: "water_cycle" },
          { amount: 115, impact: "nitrogen_cycle" },
          { amount: 325, impact: "soil_erosion" },
        ],
      });
    });

    it("returns negative enviromental monetary value for soils differential", () => {
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
        baseSoilsCarbonStorage: {
          totalCarbonStorage: 250,
          soilsCarbonStorage: [
            {
              type: "FOREST_CONIFER",
              surfaceArea: 200,
              carbonStorage: 100,
              carbonStorageInTonPerSquareMeters: 100,
            },
          ],
        },
        forecastSoilsCarbonStorage: {
          totalCarbonStorage: 150,
          soilsCarbonStorage: [
            {
              type: "FOREST_CONIFER",
              surfaceArea: 200,
              carbonStorage: 150,
              carbonStorageInTonPerSquareMeters: 100,
            },
          ],
        },

        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().socioEconomicList,
      ).toContainEqual({
        amount: -65,
        impact: "water_regulation",
        impactCategory: "environmental_monetary",
        actor: "community",
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().socioEconomicList,
      ).toContainEqual({
        amount: -50540,
        impact: "ecosystem_services",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        details: [
          { amount: -49658, impact: "carbon_storage" },
          { amount: -51, impact: "nature_related_wellness_and_leisure" },
          { amount: -51, impact: "pollination" },
          { amount: -746, impact: "water_cycle" },
          { amount: -34, impact: "nitrogen_cycle" },
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });

      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental
          .nonContaminatedSurfaceArea,
      ).toEqual({
        current: 1000,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });

      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental
          .nonContaminatedSurfaceArea,
      ).toEqual({
        current: 750,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental
          .nonContaminatedSurfaceArea,
      ).toEqual({
        current: 750,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental.permeableSurfaceArea,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });

      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental.permeableSurfaceArea,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });

      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental.permeableSurfaceArea,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });

      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental.permeableSurfaceArea,
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental.permeableSurfaceArea,
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

  describe("computeSoilsCarbonStorage", () => {
    it("returns isSuccess = false if base and forecast not provided", () => {
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
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental.soilsCarbonStorage,
      ).toEqual({ isSuccess: false });
    });
    it("returns negative impact if soils are artificialized", () => {
      const environmentalSoilsRelatedImpactService = new EnvironmentalSoilsRelatedImpactsService({
        siteTotalSurfaceArea: 1055,
        baseSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
        },
        forecastSoilsDistribution: {
          IMPERMEABLE_SOILS: 1000,
          BUILDINGS: 220,
        },
        baseSoilsCarbonStorage: {
          totalCarbonStorage: 632,
          soilsCarbonStorage: [
            {
              type: "IMPERMEABLE_SOILS",
              surfaceArea: 100,
              carbonStorage: 75,
              carbonStorageInTonPerSquareMeters: 75 / 100,
            },
            {
              type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surfaceArea: 100,
              carbonStorage: 557.61,
              carbonStorageInTonPerSquareMeters: 0.018587,
            },
            {
              type: "PRAIRIE_GRASS",
              surfaceArea: 432,
              carbonStorage: 557.61,
              carbonStorageInTonPerSquareMeters: 0.018587,
            },
          ],
        },
        forecastSoilsCarbonStorage: {
          totalCarbonStorage: 9.5,
          soilsCarbonStorage: [
            {
              type: "IMPERMEABLE_SOILS",
              surfaceArea: 1000,
              carbonStorage: 7.5,
              carbonStorageInTonPerSquareMeters: 7.5 / 1000,
            },
            {
              type: "BUILDINGS",
              surfaceArea: 220,
              carbonStorage: 1.5,
              carbonStorageInTonPerSquareMeters: 1.5 / 220,
            },
          ],
        },
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      });
      expect(
        environmentalSoilsRelatedImpactService.formatImpacts().environmental.soilsCarbonStorage,
      ).toEqual({
        isSuccess: true,
        current: {
          total: 632,
          soils: [
            {
              type: "IMPERMEABLE_SOILS",
              surfaceArea: 100,
              carbonStorage: 75,
            },
            {
              type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
              surfaceArea: 100,
              carbonStorage: 557.61,
            },
            {
              type: "PRAIRIE_GRASS",
              surfaceArea: 432,
              carbonStorage: 557.61,
            },
          ],
        },
        forecast: {
          total: 9.5,
          soils: [
            {
              type: "IMPERMEABLE_SOILS",
              surfaceArea: 1000,
              carbonStorage: 7.5,
            },
            {
              type: "BUILDINGS",
              surfaceArea: 220,
              carbonStorage: 1.5,
            },
          ],
        },
      });
    });
  });
});
