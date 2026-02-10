import { v4 as uuid } from "uuid";

import { IDateProvider } from "../../../adapters/IDateProvider";
import { DeterministicDateProvider } from "../../_common/project-generator/DateProvider.mock";
import { MockPhotovoltaicPerformanceService } from "./PhotovoltaicPerformanceService.mock";
import { PhotovoltaicPowerPlantProjectGenerator } from "./PhotovoltaicPowerPlantProjectGenerator";

const siteData = {
  id: uuid(),
  nature: "FRICHE",
  surfaceArea: 15000,
  soilsDistribution: {
    PRAIRIE_TREES: 5000,
    BUILDINGS: 2500,
    IMPERMEABLE_SOILS: 2500,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
  },
  contaminatedSoilSurface: 5000,
  owner: {
    structureType: "municipality",
    name: "Current owner",
  },
  address: {
    lat: 48.859,
    long: 2.347,
  },
} as const;

const userData = {
  id: uuid(),
  structureType: "company",
  structureName: "User company name",
};

describe("PhotovoltaicPowerPlantProjectGenerator", () => {
  let dateProvider: IDateProvider;
  let photovoltaicPerformanceService: MockPhotovoltaicPerformanceService;
  const fakeNow = new Date("2024-01-05");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    photovoltaicPerformanceService = new MockPhotovoltaicPerformanceService();
  });
  describe("get soilsDistributionForTransformation", () => {
    it("should replace prairie_trees by prairie_grass", () => {
      const generator = new PhotovoltaicPowerPlantProjectGenerator({
        dateProvider,
        photovoltaicPerformanceService,
        reconversionProjectId: uuid(),
        siteData,
        userData,
      });
      expect(generator.soilsDistributionForTransformation).toEqual({
        PRAIRIE_GRASS: 5000,
        IMPERMEABLE_SOILS: 2500,
        MINERAL_SOIL: 2500,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
      });
    });

    it("should replace all soils by their suitable equivalent", () => {
      const generator = new PhotovoltaicPowerPlantProjectGenerator({
        dateProvider,
        photovoltaicPerformanceService,
        reconversionProjectId: uuid(),
        siteData: {
          ...siteData,
          soilsDistribution: {
            PRAIRIE_TREES: 5000,
            FOREST_DECIDUOUS: 5000,
            ARTIFICIAL_TREE_FILLED: 5000,
          },
        },
        userData,
      });
      expect(generator.soilsDistributionForTransformation).toEqual({
        PRAIRIE_GRASS: 10000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
      });
    });

    it("should replace only soils non suitable by their suitable equivalent", () => {
      const generator = new PhotovoltaicPowerPlantProjectGenerator({
        dateProvider,
        photovoltaicPerformanceService,
        reconversionProjectId: uuid(),
        siteData: {
          ...siteData,
          soilsDistribution: {
            IMPERMEABLE_SOILS: 1000,
            MINERAL_SOIL: 1000,
            BUILDINGS: 2000,
            ARTIFICIAL_TREE_FILLED: 2000,
            PRAIRIE_TREES: 2000,
            ORCHARD: 2000,
            FOREST_CONIFER: 1000,
            FOREST_DECIDUOUS: 2000,
            FOREST_POPLAR: 1000,
            FOREST_MIXED: 1000,
          },
        },
        userData,
      });
      expect(generator.soilsDistributionForTransformation).toEqual({
        IMPERMEABLE_SOILS: 1000,
        MINERAL_SOIL: 3000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2000,
        PRAIRIE_GRASS: 9000,
      });
    });
  });

  describe("getReconversionProject", () => {
    it("should return PV project on friche site", async () => {
      const projectId = uuid();
      const generator = new PhotovoltaicPowerPlantProjectGenerator({
        dateProvider,
        photovoltaicPerformanceService,
        reconversionProjectId: projectId,
        siteData,
        userData,
      });
      expect(await generator.getReconversionProject()).toEqual({
        id: projectId,
        createdBy: userData.id,
        createdAt: fakeNow,
        creationMode: "express",
        projectPhase: "setup",
        status: "active",
        soilsDistribution: [
          {
            soilType: "IMPERMEABLE_SOILS",
            surfaceArea: 2500,
          },
          {
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            surfaceArea: 5000,
          },
          {
            soilType: "PRAIRIE_GRASS",
            surfaceArea: 5000,
          },
          {
            soilType: "MINERAL_SOIL",
            surfaceArea: 2500,
          },
        ],
        decontaminatedSoilSurface: 3750,
        yearlyProjectedCosts: [
          {
            amount: 6000,
            purpose: "rent",
          },
          {
            amount: 16500,
            purpose: "maintenance",
          },
          {
            amount: 6591,
            purpose: "taxes",
          },
          {
            amount: 0,
            purpose: "other",
          },
        ],
        yearlyProjectedRevenues: [
          {
            amount: 146445,
            source: "operations",
          },
        ],
        relatedSiteId: siteData.id,
        futureSiteOwner: undefined,
        futureOperator: {
          structureType: userData.structureType,
          name: userData.structureName,
        },
        reinstatementCosts: [
          {
            amount: 25000,
            purpose: "deimpermeabilization",
          },
          {
            amount: 247500,
            purpose: "remediation",
          },
          {
            amount: 187500,
            purpose: "demolition",
          },
          {
            amount: 187500,
            purpose: "asbestos_removal",
          },
        ],
        reinstatementSchedule: {
          startDate: new Date("2025-01-05"),
          endDate: new Date("2026-01-05"),
        },
        reinstatementContractOwner: {
          structureType: userData.structureType,
          name: userData.structureName,
        },
        operationsFirstYear: 2028,
        name: "Centrale photovoltaïque",
        developmentPlan: {
          developer: {
            structureType: userData.structureType,
            name: userData.structureName,
          },
          features: {
            surfaceArea: 15000,
            electricalPowerKWc: 1500,
            expectedAnnualProduction: 2253,
            contractDuration: 20,
          },
          installationSchedule: {
            startDate: new Date("2026-01-06"),
            endDate: new Date("2027-01-06"),
          },
          type: "PHOTOVOLTAIC_POWER_PLANT",
          costs: [
            {
              amount: 52500,
              purpose: "technical_studies",
            },
            {
              amount: 1110000,
              purpose: "installation_works",
            },
            {
              amount: 112500,
              purpose: "other",
            },
          ],
        },
      });
    });

    it("should return PV project on non friche site", async () => {
      const projectId = uuid();
      const generator = new PhotovoltaicPowerPlantProjectGenerator({
        dateProvider,
        photovoltaicPerformanceService,
        reconversionProjectId: projectId,
        siteData: {
          ...siteData,
          nature: "AGRICULTURAL_OPERATION",
          contaminatedSoilSurface: undefined,
          soilsDistribution: {
            PRAIRIE_TREES: 5000,
            CULTIVATION: 9000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000,
          },
        },
        userData,
      });
      expect(await generator.getReconversionProject()).toEqual({
        id: projectId,
        createdBy: userData.id,
        createdAt: fakeNow,
        creationMode: "express",
        status: "active",
        projectPhase: "setup",
        soilsDistribution: [
          {
            soilType: "IMPERMEABLE_SOILS",
            surfaceArea: 30,
          },
          {
            soilType: "MINERAL_SOIL",
            surfaceArea: 1320,
          },
          {
            soilType: "CULTIVATION",
            surfaceArea: 9000,
          },
          {
            soilType: "PRAIRIE_GRASS",
            surfaceArea: 4650,
          },
        ],

        decontaminatedSoilSurface: undefined,
        yearlyProjectedCosts: [
          {
            amount: 6000,
            purpose: "rent",
          },
          {
            amount: 16500,
            purpose: "maintenance",
          },
          {
            amount: 6591,
            purpose: "taxes",
          },
          {
            amount: 0,
            purpose: "other",
          },
        ],
        yearlyProjectedRevenues: [
          {
            amount: 146445,
            source: "operations",
          },
        ],
        relatedSiteId: siteData.id,
        futureSiteOwner: undefined,
        futureOperator: {
          structureType: userData.structureType,
          name: userData.structureName,
        },
        reinstatementCosts: undefined,
        reinstatementSchedule: undefined,
        reinstatementContractOwner: undefined,
        operationsFirstYear: 2026,
        name: "Centrale photovoltaïque",
        developmentPlan: {
          developer: {
            structureType: userData.structureType,
            name: userData.structureName,
          },
          features: {
            surfaceArea: 15000,
            electricalPowerKWc: 1500,
            expectedAnnualProduction: 2253,
            contractDuration: 20,
          },
          installationSchedule: {
            startDate: new Date("2024-01-05"),
            endDate: new Date("2025-01-05"),
          },
          type: "PHOTOVOLTAIC_POWER_PLANT",
          costs: [
            {
              amount: 52500,
              purpose: "technical_studies",
            },
            {
              amount: 1110000,
              purpose: "installation_works",
            },
            {
              amount: 112500,
              purpose: "other",
            },
          ],
        },
      });
    });

    it("should not fail if photovoltaicPerformanceService fail to return value", async () => {
      const projectId = uuid();
      photovoltaicPerformanceService.shouldFail();
      const generator = new PhotovoltaicPowerPlantProjectGenerator({
        dateProvider,
        photovoltaicPerformanceService,
        reconversionProjectId: projectId,
        siteData: siteData,
        userData,
      });
      const result = await generator.getReconversionProject();
      expect(result).toBeDefined();
      const { expectedAnnualProduction } = result.developmentPlan.features as {
        surfaceArea: number;
        electricalPowerKWc: number;
        expectedAnnualProduction: number;
        contractDuration: number;
      };
      expect(result.developmentPlan.type).toEqual("PHOTOVOLTAIC_POWER_PLANT");
      expect(expectedAnnualProduction).toEqual(1800);
    });
  });
});
