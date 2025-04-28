import { sumObjectValues } from "shared";
import { v4 as uuid } from "uuid";

import { InMemoryReconversionProjectRepository } from "src/reconversion-projects/adapters/secondary/repositories/reconversion-project/InMemoryReconversionProjectRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";
import { SiteViewModel } from "src/sites/core/usecases/getSiteById.usecase";

import { ReconversionProject } from "../model/reconversionProject";
import { UrbanProjectFeatures } from "../model/urbanProjects";
import { CreateExpressReconversionProjectUseCase } from "./createExpressReconversionProject.usecase";

const EXPRESS_CATEGORIES = [
  "PUBLIC_FACILITIES",
  "RESIDENTIAL_TENSE_AREA",
  "RESIDENTIAL_NORMAL_AREA",
  "NEW_URBAN_CENTER",
] as const;

describe("CreateReconversionProject Use Case", () => {
  let dateProvider: DateProvider;
  let sitesQuery: InMemorySitesQuery;
  let reconversionProjectRepository: InMemoryReconversionProjectRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    sitesQuery = new InMemorySitesQuery();
    reconversionProjectRepository = new InMemoryReconversionProjectRepository();
  });

  describe("Error cases", () => {
    test.each(EXPRESS_CATEGORIES)(
      "cannot create an express %s reconversion project with a non-existing site",
      async (expressCategory) => {
        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const siteId = uuid();
        await expect(
          usecase.execute({
            reconversionProjectId: uuid(),
            siteId,
            createdBy: uuid(),
            category: expressCategory,
          }),
        ).rejects.toThrow(`Site with id ${siteId} does not exist`);
      },
    );
  });

  describe("On friche site", () => {
    const site: SiteViewModel = {
      id: uuid(),
      name: "Base site",
      nature: "FRICHE",
      isExpressSite: false,
      surfaceArea: 10000,
      soilsDistribution: {
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
        IMPERMEABLE_SOILS: 3000,
        MINERAL_SOIL: 2000,
      },
      contaminatedSoilSurface: 0,
      owner: {
        name: "Mairie de Montrouge",
        structureType: "municipality",
      },
      address: {
        city: "Montrouge",
        streetName: "Avenue Pierre Brossolette",
        streetNumber: "155bis",
        value: "155 bis Av. Pierre Brossolette, 92120 Montrouge",
        banId: "92049_7161_00155_bis",
        cityCode: "92049",
        postCode: "92120",
        long: 2.305116,
        lat: 48.815679,
      },
      yearlyExpenses: [],
      yearlyIncomes: [],
    };

    beforeEach(() => {
      sitesQuery._setSites([site]);
    });

    test.each(EXPRESS_CATEGORIES)(
      "should create a %s project with default name, given related site id, createdBy, createdAt and creationMode",
      async (expressCategory) => {
        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const reconversionProjectId = uuid();
        const creatorId = uuid();
        await usecase.execute({
          reconversionProjectId,
          siteId: site.id,
          createdBy: creatorId,
          category: expressCategory,
        });

        let expectedName = "";
        if (expressCategory === "NEW_URBAN_CENTER") {
          expectedName = "Centralité urbaine";
        } else if (expressCategory === "PUBLIC_FACILITIES") {
          expectedName = "Équipement public";
        } else if (expressCategory === "RESIDENTIAL_TENSE_AREA") {
          expectedName = "Résidentiel secteur tendu";
        } else {
          expectedName = "Résidentiel secteur détendu";
        }

        const createdReconversionProjects: ReconversionProject[] =
          reconversionProjectRepository._getReconversionProjects();
        expect(createdReconversionProjects).toHaveLength(1);
        const createdReconversionProject = createdReconversionProjects[0];
        expect(createdReconversionProject?.relatedSiteId).toEqual(site.id);
        expect(createdReconversionProject?.createdBy).toEqual(creatorId);
        expect(createdReconversionProject?.createdAt).toEqual(dateProvider.now());
        expect(createdReconversionProject?.creationMode).toEqual("express");
        expect(createdReconversionProject?.name).toEqual(expectedName);
      },
    );

    test.each(EXPRESS_CATEGORIES)(
      "should create a %s project with reinstatement scheduled 1 year after current date, installation works 1 year after reinstatement and first operations 1 year after",
      async (expressCategory) => {
        dateProvider = new DeterministicDateProvider(new Date("2024-09-01T13:00:00"));

        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const reconversionProjectId = uuid();
        const creatorId = uuid();
        await usecase.execute({
          reconversionProjectId,
          siteId: site.id,
          createdBy: creatorId,
          category: expressCategory,
        });

        const createdReconversionProjects: ReconversionProject[] =
          reconversionProjectRepository._getReconversionProjects();
        expect(createdReconversionProjects).toHaveLength(1);
        const createdReconversionProject = createdReconversionProjects[0];
        expect(createdReconversionProject?.reinstatementSchedule).toEqual({
          startDate: new Date("2025-09-01T13:00:00"),
          endDate: new Date("2026-09-01T13:00:00"),
        });
        expect(createdReconversionProject?.developmentPlan.installationSchedule).toEqual({
          startDate: new Date("2026-09-02T13:00:00"),
          endDate: new Date("2027-09-02T13:00:00"),
        });
        expect(createdReconversionProject?.operationsFirstYear).toEqual(2028);
      },
    );

    test.each(EXPRESS_CATEGORIES)(
      "should create a %s project with site city as developer, reinstatement contract owner and no site owner",
      async (expressCategory) => {
        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const reconversionProjectId = uuid();
        const creatorId = uuid();
        await usecase.execute({
          reconversionProjectId,
          siteId: site.id,
          createdBy: creatorId,
          category: expressCategory,
        });

        const createdReconversionProjects: ReconversionProject[] =
          reconversionProjectRepository._getReconversionProjects();
        expect(createdReconversionProjects).toHaveLength(1);
        const createdReconversionProject = createdReconversionProjects[0];
        expect(createdReconversionProject?.futureSiteOwner).toEqual(undefined);
        expect(createdReconversionProject?.developmentPlan.developer).toEqual({
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
        expect(createdReconversionProject?.reinstatementContractOwner).toEqual({
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
      },
    );

    test.each(EXPRESS_CATEGORIES)(
      "should create a %s project with right spaces, buildings floor area and soils distribution",
      async (expressCategory) => {
        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const reconversionProjectId = uuid();
        const creatorId = uuid();
        await usecase.execute({
          reconversionProjectId,
          siteId: site.id,
          createdBy: creatorId,
          category: expressCategory,
        });

        let expectedBuildingsFloorAreaDistribution;
        let expectedSpacesDistribution;

        if (expressCategory === "RESIDENTIAL_TENSE_AREA") {
          expectedSpacesDistribution = {
            BUILDINGS_FOOTPRINT: 4200,
            PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 350,
            PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 350,
            PRIVATE_GARDEN_AND_GRASS_ALLEYS: 2100,
            PUBLIC_GREEN_SPACES: 1500,
            PUBLIC_PARKING_LOT: 500,
            PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 200,
            PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 400,
            PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 400,
          };
          expectedBuildingsFloorAreaDistribution = {
            RESIDENTIAL: 8500,
            LOCAL_STORE: 400,
            OFFICES: 500,
            LOCAL_SERVICES: 600,
          };
        } else if (expressCategory === "NEW_URBAN_CENTER") {
          expectedSpacesDistribution = {
            BUILDINGS_FOOTPRINT: 2925,
            PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 325,
            PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 325,
            PRIVATE_GARDEN_AND_GRASS_ALLEYS: 2925,
            PUBLIC_GREEN_SPACES: 1500,
            PUBLIC_PARKING_LOT: 900,
            PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 100,
            PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 500,
            PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 500,
          };
          expectedBuildingsFloorAreaDistribution = {
            RESIDENTIAL: 4960,
            LOCAL_STORE: 160,
            OFFICES: 320,
            LOCAL_SERVICES: 640,
            ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 160,
            PUBLIC_FACILITIES: 160,
          };
        } else if (expressCategory === "PUBLIC_FACILITIES") {
          expectedSpacesDistribution = {
            BUILDINGS_FOOTPRINT: 4100,
            PUBLIC_GREEN_SPACES: 3800,
            PUBLIC_PARKING_LOT: 1000,
            PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 1100,
          };
          expectedBuildingsFloorAreaDistribution = {
            PUBLIC_FACILITIES: 2000,
          };
        } else {
          expectedSpacesDistribution = {
            BUILDINGS_FOOTPRINT: 2000,
            PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 700,
            PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 200,
            PRIVATE_GARDEN_AND_GRASS_ALLEYS: 3700,
            PUBLIC_GREEN_SPACES: 1900,
            PUBLIC_PARKING_LOT: 500,
            PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 400,
            PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 200,
            PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 400,
          };
          expectedBuildingsFloorAreaDistribution = {
            RESIDENTIAL: 3800,
          };
        }

        const expectedMineralSoils =
          (expectedSpacesDistribution.PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT ?? 0) +
          (expectedSpacesDistribution.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0);

        const expectedImpermeableSoils =
          expectedSpacesDistribution.PUBLIC_PARKING_LOT +
          (expectedSpacesDistribution.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT ?? 0) +
          expectedSpacesDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS;

        const expectedArtifitialGrassOrBushesSoils =
          (expectedSpacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS ?? 0) +
          (expectedSpacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0) +
          expectedSpacesDistribution.PUBLIC_GREEN_SPACES;

        const expectedSoilsDistribution = {
          BUILDINGS: expectedSpacesDistribution.BUILDINGS_FOOTPRINT,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
            expectedArtifitialGrassOrBushesSoils > 0
              ? expectedArtifitialGrassOrBushesSoils
              : undefined,
          IMPERMEABLE_SOILS: expectedImpermeableSoils > 0 ? expectedImpermeableSoils : undefined,
          MINERAL_SOIL: expectedMineralSoils > 0 ? expectedMineralSoils : undefined,
        };

        const createdReconversionProjects: ReconversionProject[] =
          reconversionProjectRepository._getReconversionProjects();
        expect(createdReconversionProjects).toHaveLength(1);

        const { developmentPlan, soilsDistribution } = createdReconversionProjects[0] ?? {};
        const { buildingsFloorAreaDistribution, spacesDistribution } =
          developmentPlan?.features as UrbanProjectFeatures;

        expect(developmentPlan?.type).toEqual("URBAN_PROJECT");

        expect(spacesDistribution).toEqual(expectedSpacesDistribution);
        expect(sumObjectValues(spacesDistribution)).toEqual(site.surfaceArea);
        expect(buildingsFloorAreaDistribution).toEqual(expectedBuildingsFloorAreaDistribution);
        expect(soilsDistribution).toEqual(expectedSoilsDistribution);
        expect(sumObjectValues(soilsDistribution as Record<string, number>)).toEqual(
          site.surfaceArea,
        );
      },
    );

    test.each(EXPRESS_CATEGORIES)(
      "should create a %s project with expected sale after development relative to buildings floor surface area",
      async (expressCategory) => {
        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const reconversionProjectId = uuid();
        const creatorId = uuid();
        await usecase.execute({
          reconversionProjectId,
          siteId: site.id,
          createdBy: creatorId,
          category: expressCategory,
        });

        const createdReconversionProjects: ReconversionProject[] =
          reconversionProjectRepository._getReconversionProjects();
        expect(createdReconversionProjects).toHaveLength(1);
        const createdReconversionProject = createdReconversionProjects[0];

        let expectedResalePrice;

        switch (expressCategory) {
          case "RESIDENTIAL_TENSE_AREA":
            expectedResalePrice = 2772500;
            break;
          case "NEW_URBAN_CENTER":
            expectedResalePrice = 1211600;
            break;
          case "PUBLIC_FACILITIES":
            expectedResalePrice = 80000;
            break;
          default:
            expectedResalePrice = 570000;
        }

        expect(createdReconversionProject?.siteResaleExpectedSellingPrice).toEqual(
          expectedResalePrice,
        );
        expect(
          Math.round(createdReconversionProject?.siteResaleExpectedPropertyTransferDuties ?? 0),
        ).toEqual(Math.round(expectedResalePrice * 0.0581));
      },
    );

    describe("with non-polluted soils and no buildings", () => {
      const nonPollutedFricheWithNoBuildings = {
        ...site,
        owner: {
          name: "Monsieur Dupont",
          structureType: "private_individual",
        },
        contaminatedSoilSurface: 0,
      };
      it("should create a RESIDENTIAL_NORMAL_AREA with reinstatement costs, real estate sale transaction and development installation costs", async () => {
        sitesQuery._setSites([nonPollutedFricheWithNoBuildings]);

        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const reconversionProjectId = uuid();
        const creatorId = uuid();
        await usecase.execute({
          reconversionProjectId,
          siteId: nonPollutedFricheWithNoBuildings.id,
          createdBy: creatorId,
          category: "RESIDENTIAL_NORMAL_AREA",
        });

        const createdReconversionProjects: ReconversionProject[] =
          reconversionProjectRepository._getReconversionProjects();
        expect(createdReconversionProjects).toHaveLength(1);
        const createdReconversionProject = createdReconversionProjects[0];
        // real estate sale transaction
        expect(createdReconversionProject?.sitePurchaseSellingPrice).toEqual(720000);
        expect(createdReconversionProject?.sitePurchasePropertyTransferDuties).toEqual(41832);
        // development installation cost
        expect(createdReconversionProject?.developmentPlan.costs).toEqual([
          { purpose: "technical_studies", amount: 60000 },
          { purpose: "development_works", amount: 540000 },
          { purpose: "other", amount: 54000 },
        ]);
        // reinstatement costs
        expect(createdReconversionProject?.reinstatementCosts).toEqual([]);
      });
    });

    describe("with polluted soils and buildings", () => {
      const pollutedFricheWithBuildings = {
        ...site,
        owner: {
          name: "Monsieur Dupont",
          structureType: "private_individual",
        },
        surfaceArea: 100000,
        name: "Base site with polluted soils and buildings",
        soilsDistribution: {
          BUILDINGS: 1000,
          IMPERMEABLE_SOILS: 30000,
          MINERAL_SOIL: 69000,
        },
        contaminatedSoilSurface: 50000,
      };
      it("should create a RESIDENTIAL_NORMAL_AREA should create a %s with reinstatement costs, real estate sale transaction and development installation costs based on site data", async () => {
        sitesQuery._setSites([pollutedFricheWithBuildings]);

        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const reconversionProjectId = uuid();
        const creatorId = uuid();
        await usecase.execute({
          reconversionProjectId,
          siteId: pollutedFricheWithBuildings.id,
          createdBy: creatorId,
          category: "RESIDENTIAL_NORMAL_AREA",
        });

        const createdReconversionProjects: ReconversionProject[] =
          reconversionProjectRepository._getReconversionProjects();
        expect(createdReconversionProjects).toHaveLength(1);
        const createdReconversionProject = createdReconversionProjects[0];
        // real estate sale transaction
        expect(createdReconversionProject?.sitePurchaseSellingPrice).toEqual(7200000);
        expect(createdReconversionProject?.sitePurchasePropertyTransferDuties).toEqual(418320);
        // development installation cost
        expect(createdReconversionProject?.developmentPlan.costs).toEqual([
          { purpose: "technical_studies", amount: 600000 },
          { purpose: "development_works", amount: 5400000 },
          { purpose: "other", amount: 540000 },
        ]);
        // reinstatement costs
        expect(createdReconversionProject?.reinstatementCosts).toHaveLength(3);
        expect(createdReconversionProject?.reinstatementCosts).toContainEqual({
          purpose: "asbestos_removal",
          amount: 75000,
        });
        expect(createdReconversionProject?.reinstatementCosts).toContainEqual({
          purpose: "demolition",
          amount: 75000,
        });
        expect(createdReconversionProject?.reinstatementCosts).toContainEqual({
          purpose: "remediation",
          amount: 2475000,
        });
      });
    });

    describe("with less impermeable soils once developed", () => {
      const allImpermeableFriche = {
        ...site,
        soilsDistribution: {
          BUILDINGS: 7000,
          IMPERMEABLE_SOILS: 3000,
        },
      };

      it("should create a RESIDENTIAL_NORMAL_AREA with deimpermeabilization and sustainable soils reinstatement expenses", async () => {
        sitesQuery._setSites([allImpermeableFriche]);

        const usecase = new CreateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          reconversionProjectRepository,
        );

        const reconversionProjectId = uuid();
        const creatorId = uuid();
        await usecase.execute({
          reconversionProjectId,
          siteId: allImpermeableFriche.id,
          createdBy: creatorId,
          category: "RESIDENTIAL_NORMAL_AREA",
        });

        const createdReconversionProjects: ReconversionProject[] =
          reconversionProjectRepository._getReconversionProjects();
        expect(createdReconversionProjects).toHaveLength(1);
        const createdReconversionProject = createdReconversionProjects[0];
        // reinstatement costs
        expect(createdReconversionProject?.reinstatementCosts).toHaveLength(4);
        expect(createdReconversionProject?.reinstatementCosts?.at(0)).toEqual({
          purpose: "deimpermeabilization",
          amount: 64000,
        });
        expect(createdReconversionProject?.reinstatementCosts?.at(1)).toEqual({
          purpose: "sustainable_soils_reinstatement",
          amount: 270000,
        });
        expect(createdReconversionProject?.reinstatementCosts?.at(2)?.purpose).toEqual(
          "demolition",
        );
        expect(createdReconversionProject?.reinstatementCosts?.at(3)?.purpose).toEqual(
          "asbestos_removal",
        );
      });
    });
  });

  describe("On agricultural operation", () => {
    const site = {
      id: uuid(),
      nature: "AGRICULTURAL_OPERATION",
      isExpressSite: true,
      name: "Base site",
      surfaceArea: 50000,
      soilsDistribution: {
        PRAIRIE_GRASS: 30000,
        FOREST_MIXED: 18900,
        WATER: 600,
        MINERAL_SOIL: 500,
      },
      contaminatedSoilSurface: 0,
      address: {
        city: "Montrouge",
        streetName: "Avenue Pierre Brossolette",
        streetNumber: "155bis",
        value: "155 bis Av. Pierre Brossolette, 92120 Montrouge",
        banId: "92049_7161_00155_bis",
        cityCode: "92049",
        postCode: "92120",
        long: 2.305116,
        lat: 48.815679,
      },
      yearlyExpenses: [],
      yearlyIncomes: [],
      owner: {
        name: "Monsieur Dupont",
        structureType: "private_individual",
      },
    } as const satisfies SiteViewModel;
    describe("with site purchase", () => {
      test.each(EXPRESS_CATEGORIES)(
        "should create a %s with real estate sale transaction and development installation costs based on site",
        async (expressCategory) => {
          sitesQuery._setSites([site]);
          const usecase = new CreateExpressReconversionProjectUseCase(
            dateProvider,
            sitesQuery,
            reconversionProjectRepository,
          );

          const reconversionProjectId = uuid();
          const creatorId = uuid();
          await usecase.execute({
            reconversionProjectId,
            siteId: site.id,
            createdBy: creatorId,
            category: expressCategory,
          });

          const createdReconversionProjects: ReconversionProject[] =
            reconversionProjectRepository._getReconversionProjects();
          expect(createdReconversionProjects).toHaveLength(1);
          const createdReconversionProject = createdReconversionProjects[0];
          // real estate sale transaction
          expect(createdReconversionProject?.sitePurchaseSellingPrice).toEqual(3600000);
          expect(createdReconversionProject?.sitePurchasePropertyTransferDuties).toEqual(209160);
          // development installation cost
          expect(createdReconversionProject?.developmentPlan.costs).toEqual([
            { purpose: "technical_studies", amount: 300000 },
            { purpose: "development_works", amount: 2700000 },
            { purpose: "other", amount: 270000 },
          ]);
          // reinstatement costs
          expect(createdReconversionProject?.reinstatementCosts).toEqual(undefined);
          expect(createdReconversionProject?.futureSiteOwner).toEqual({
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
        },
      );
    });

    describe("without site purchase", () => {
      test.each(EXPRESS_CATEGORIES)(
        "should create a %s without real estate sale transaction and future site owner",
        async (expressCategory) => {
          const siteOwner = {
            name: "Mairie de Montrouge",
            structureType: "municipality",
          };
          sitesQuery._setSites([{ ...site, owner: siteOwner }]);
          const usecase = new CreateExpressReconversionProjectUseCase(
            dateProvider,
            sitesQuery,
            reconversionProjectRepository,
          );

          const reconversionProjectId = uuid();
          const creatorId = uuid();
          await usecase.execute({
            reconversionProjectId,
            siteId: site.id,
            createdBy: creatorId,
            category: expressCategory,
          });

          const createdReconversionProjects: ReconversionProject[] =
            reconversionProjectRepository._getReconversionProjects();
          expect(createdReconversionProjects).toHaveLength(1);
          const createdReconversionProject = createdReconversionProjects[0];
          // real estate sale transaction
          expect(createdReconversionProject?.sitePurchaseSellingPrice).toEqual(undefined);
          expect(createdReconversionProject?.sitePurchasePropertyTransferDuties).toEqual(undefined);
          expect(createdReconversionProject?.futureSiteOwner).toEqual(undefined);
        },
      );
    });
  });
});
