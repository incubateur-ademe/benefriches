import {
  BuildingsUseDistribution,
  ExpressProjectCategory,
  expressProjectCategorySchema,
  getProjectSoilDistributionByType,
  sumListWithKey,
  sumObjectValues,
} from "shared";
import { v4 as uuid } from "uuid";

import { MockPhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";
import { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";
import { SiteViewModel } from "src/sites/core/usecases/getSiteById.usecase";
import { InMemoryUserQuery } from "src/users/adapters/secondary/user-query/InMemoryUserQuery";

import { UrbanProjectFeatures } from "../model/urbanProjects";
import { GenerateExpressReconversionProjectUseCase } from "./generateExpressReconversionProject.usecase";

const EXPRESS_CATEGORIES = expressProjectCategorySchema.options;

const EXPRESS_URBAN_PROJECT_CATEGORIES = expressProjectCategorySchema.exclude([
  "PHOTOVOLTAIC_POWER_PLANT",
]).options;

describe("GenerateAndSaveExpressReconversionProjectUseCase Use Case", () => {
  let dateProvider: DateProvider;
  let sitesQuery: InMemorySitesQuery;
  let photovoltaicPerformanceService: PhotovoltaicDataProvider;
  let userQuery: InMemoryUserQuery;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    sitesQuery = new InMemorySitesQuery();
    photovoltaicPerformanceService = new MockPhotovoltaicGeoInfoSystemApi();
    userQuery = new InMemoryUserQuery();
  });

  describe("Error cases", () => {
    test.each(EXPRESS_CATEGORIES)(
      "cannot create an express %s reconversion project with a non-existing site",
      async (expressCategory) => {
        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const siteId = uuid();
        await expect(
          usecase.execute({
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
        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          category: expressCategory,
        });

        const expressCategoryNameMap: Record<ExpressProjectCategory, string> = {
          NEW_URBAN_CENTER: "Centralité urbaine",
          PUBLIC_FACILITIES: "Équipement public",
          RESIDENTIAL_TENSE_AREA: "Résidentiel secteur tendu",
          PHOTOVOLTAIC_POWER_PLANT: "Centrale photovoltaïque",
          RESIDENTIAL_NORMAL_AREA: "Résidentiel secteur détendu",
          INDUSTRIAL_FACILITIES: "Industrie",
          OFFICES: "Tertiaire",
          RENATURATION: "Renaturation",
          TOURISM_AND_CULTURAL_FACILITIES: "Centre culturel",
        };

        const expectedName = expressCategoryNameMap[expressCategory];

        expect(result.relatedSiteId).toEqual(site.id);
        expect(result.createdBy).toEqual(creatorId);
        expect(result.createdAt).toEqual(dateProvider.now());
        expect(result.creationMode).toEqual("express");
        expect(result.name).toEqual(expectedName);
      },
    );

    test.each(EXPRESS_CATEGORIES)(
      "should create a %s project with reinstatement scheduled 1 year after current date, installation works 1 year after reinstatement and first operations 1 year after",
      async (expressCategory) => {
        dateProvider = new DeterministicDateProvider(new Date("2024-09-01T13:00:00"));

        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          category: expressCategory,
        });

        expect(result.reinstatementSchedule).toEqual({
          startDate: new Date("2025-09-01T13:00:00"),
          endDate: new Date("2026-09-01T13:00:00"),
        });
        expect(result.developmentPlan.installationSchedule).toEqual({
          startDate: new Date("2026-09-02T13:00:00"),
          endDate: new Date("2027-09-02T13:00:00"),
        });
        expect(result.operationsFirstYear).toEqual(2028);
      },
    );

    describe("Urban projects", () => {
      test.each(EXPRESS_URBAN_PROJECT_CATEGORIES)(
        "should create a %s project with site city as developer, reinstatement contract owner and no site owner",
        async (expressCategory) => {
          const usecase = new GenerateExpressReconversionProjectUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            category: expressCategory,
          });

          expect(result.futureSiteOwner).toEqual(undefined);
          expect(result.developmentPlan.developer).toEqual({
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
          expect(result.reinstatementContractOwner).toEqual({
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
        },
      );
      test.each(EXPRESS_URBAN_PROJECT_CATEGORIES)(
        "should create a %s project with expected sale after development relative to buildings floor surface area",
        async (expressCategory) => {
          const usecase = new GenerateExpressReconversionProjectUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            category: expressCategory,
          });

          let expectedResalePrice;

          switch (expressCategory) {
            case "RESIDENTIAL_TENSE_AREA":
              expectedResalePrice = 2_772_500;
              break;
            case "NEW_URBAN_CENTER":
              expectedResalePrice = 1_211_600;
              break;
            case "PUBLIC_FACILITIES":
              expectedResalePrice = 164_000;
              break;
            case "INDUSTRIAL_FACILITIES":
              expectedResalePrice = 435_000;
              break;
            case "OFFICES":
              expectedResalePrice = 2_160_000;
              break;
            case "RENATURATION":
              expectedResalePrice = 0;
              break;
            case "TOURISM_AND_CULTURAL_FACILITIES":
              expectedResalePrice = 0;
              break;
            default:
              expectedResalePrice = 570_000;
          }

          expect(result.siteResaleExpectedSellingPrice).toEqual(expectedResalePrice);
          expect(Math.round(result.siteResaleExpectedPropertyTransferDuties ?? 0)).toEqual(
            Math.round(expectedResalePrice * 0.0581),
          );
        },
      );

      test.each(EXPRESS_URBAN_PROJECT_CATEGORIES)(
        "should create a %s project with right spaces, buildings floor area and soils distribution",
        async (expressCategory) => {
          const usecase = new GenerateExpressReconversionProjectUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            category: expressCategory,
          });

          let expectedBuildingsFloorAreaDistribution: BuildingsUseDistribution = {};
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
              PUBLIC_FACILITIES: 4100,
            };
          } else if (expressCategory === "OFFICES") {
            expectedSpacesDistribution = {
              BUILDINGS_FOOTPRINT: 8_000,
              PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 500,
              PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 500,
              PRIVATE_GARDEN_AND_GRASS_ALLEYS: 1_000,
            };
            expectedBuildingsFloorAreaDistribution = {
              OFFICES: 24_000,
            };
          } else if (expressCategory === "TOURISM_AND_CULTURAL_FACILITIES") {
            expectedSpacesDistribution = {
              BUILDINGS_FOOTPRINT: 6_000,
              PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 2_000,
              PUBLIC_GREEN_SPACES: 2_000,
            };
            expectedBuildingsFloorAreaDistribution = {
              CULTURAL_PLACE: 6_000,
            };
          } else if (expressCategory === "INDUSTRIAL_FACILITIES") {
            expectedSpacesDistribution = {
              BUILDINGS_FOOTPRINT: 6_000,
              PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 3_000,
              PRIVATE_GARDEN_AND_GRASS_ALLEYS: 1_000,
            };
            expectedBuildingsFloorAreaDistribution = {
              ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 6_000,
            };
          } else if (expressCategory === "RENATURATION") {
            expectedSpacesDistribution = {
              PUBLIC_GREEN_SPACES: site.surfaceArea,
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
            (expectedSpacesDistribution.PUBLIC_PARKING_LOT ?? 0) +
            (expectedSpacesDistribution.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT ?? 0) +
            (expectedSpacesDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0);

          const expectedArtificialGrassOrBushesSoils =
            (expectedSpacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS ?? 0) +
            (expectedSpacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0) +
            (expectedSpacesDistribution.PUBLIC_GREEN_SPACES ?? 0);

          const expectedSoilsDistribution = {
            BUILDINGS: expectedSpacesDistribution.BUILDINGS_FOOTPRINT,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
              expectedArtificialGrassOrBushesSoils > 0
                ? expectedArtificialGrassOrBushesSoils
                : undefined,
            IMPERMEABLE_SOILS: expectedImpermeableSoils > 0 ? expectedImpermeableSoils : undefined,
            MINERAL_SOIL: expectedMineralSoils > 0 ? expectedMineralSoils : undefined,
          };

          const { developmentPlan, soilsDistribution = [] } = result;
          const { buildingsFloorAreaDistribution, spacesDistribution } =
            developmentPlan.features as UrbanProjectFeatures;

          expect(developmentPlan.type).toEqual("URBAN_PROJECT");

          expect(spacesDistribution).toEqual(expectedSpacesDistribution);
          expect(sumObjectValues(spacesDistribution)).toEqual(site.surfaceArea);
          expect(buildingsFloorAreaDistribution).toEqual(expectedBuildingsFloorAreaDistribution);

          const soilsDistributionByType = getProjectSoilDistributionByType(soilsDistribution);
          expect(soilsDistributionByType).toEqual(expectedSoilsDistribution);
          expect(sumListWithKey(soilsDistribution, "surfaceArea")).toEqual(site.surfaceArea);
        },
      );
    });
    describe("PHOTOVOLTAIC_POWER_PLANT", () => {
      it("should create a PHOTOVOLTAIC_POWER_PLANT project with user company as developer, reinstatement contract owner and site operator", async () => {
        const creatorId = uuid();
        userQuery._setUsers([
          {
            id: creatorId,
            structure: {
              activity: "photovoltaic_plants_developer",
              type: "company",
              name: "My company",
            },
          },
        ]);
        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          category: "PHOTOVOLTAIC_POWER_PLANT",
        });

        expect(result.futureSiteOwner).toEqual(undefined);
        expect(result.futureOperator).toEqual({
          structureType: "company",
          name: "My company",
        });
        expect(result.developmentPlan.developer).toEqual({
          structureType: "company",
          name: "My company",
        });
        expect(result.reinstatementContractOwner).toEqual({
          structureType: "company",
          name: "My company",
        });
      });
      it("should create a PHOTOVOLTAIC_POWER_PLANT project with user municipality as developer, reinstatement contract owner and site operator", async () => {
        const creatorId = uuid();
        userQuery._setUsers([
          {
            id: creatorId,
            structure: {
              activity: "municipality",
              type: "local_authority",
              name: "Mairie de Blajan",
            },
          },
        ]);
        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          category: "PHOTOVOLTAIC_POWER_PLANT",
        });

        expect(result.futureSiteOwner).toEqual(undefined);
        expect(result.futureOperator).toEqual({
          structureType: "municipality",
          name: "Mairie de Blajan",
        });
        expect(result.developmentPlan.developer).toEqual({
          structureType: "municipality",
          name: "Mairie de Blajan",
        });
        expect(result.reinstatementContractOwner).toEqual({
          structureType: "municipality",
          name: "Mairie de Blajan",
        });
      });
      it("should create a PHOTOVOLTAIC_POWER_PLANT project with site owner as developer, reinstatement contract owner and site operator", async () => {
        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          category: "PHOTOVOLTAIC_POWER_PLANT",
        });

        expect(result.futureSiteOwner).toEqual(undefined);
        expect(result.futureOperator).toEqual({
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
        expect(result.developmentPlan.developer).toEqual({
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
        expect(result.reinstatementContractOwner).toEqual({
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
      });
    });

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

        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: nonPollutedFricheWithNoBuildings.id,
          createdBy: creatorId,
          category: "RESIDENTIAL_NORMAL_AREA",
        });

        // real estate sale transaction
        expect(result.sitePurchaseSellingPrice).toEqual(720000);
        expect(result.sitePurchasePropertyTransferDuties).toEqual(41832);
        // development installation cost
        expect(result.developmentPlan.costs).toEqual([
          { purpose: "technical_studies", amount: 60000 },
          { purpose: "development_works", amount: 540000 },
          { purpose: "other", amount: 54000 },
        ]);
        // reinstatement costs
        expect(result.reinstatementCosts).toEqual([]);
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

        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: pollutedFricheWithBuildings.id,
          createdBy: creatorId,
          category: "RESIDENTIAL_NORMAL_AREA",
        });

        // real estate sale transaction
        expect(result.sitePurchaseSellingPrice).toEqual(7200000);
        expect(result.sitePurchasePropertyTransferDuties).toEqual(418320);
        // development installation cost
        expect(result.developmentPlan.costs).toEqual([
          { purpose: "technical_studies", amount: 600000 },
          { purpose: "development_works", amount: 5400000 },
          { purpose: "other", amount: 540000 },
        ]);
        // reinstatement costs
        expect(result.reinstatementCosts).toHaveLength(3);
        expect(result.reinstatementCosts).toContainEqual({
          purpose: "asbestos_removal",
          amount: 75000,
        });
        expect(result.reinstatementCosts).toContainEqual({
          purpose: "demolition",
          amount: 75000,
        });
        expect(result.reinstatementCosts).toContainEqual({
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

        const usecase = new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: allImpermeableFriche.id,
          createdBy: creatorId,
          category: "RESIDENTIAL_NORMAL_AREA",
        });

        // reinstatement costs
        expect(result.reinstatementCosts).toHaveLength(4);
        expect(result.reinstatementCosts?.at(0)).toEqual({
          purpose: "deimpermeabilization",
          amount: 64000,
        });
        expect(result.reinstatementCosts?.at(1)).toEqual({
          purpose: "sustainable_soils_reinstatement",
          amount: 270000,
        });
        expect(result.reinstatementCosts?.at(2)?.purpose).toEqual("demolition");
        expect(result.reinstatementCosts?.at(3)?.purpose).toEqual("asbestos_removal");
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
      test.each(EXPRESS_URBAN_PROJECT_CATEGORIES)(
        "should create a %s with real estate sale transaction and development installation costs based on site",
        async (expressCategory) => {
          sitesQuery._setSites([site]);
          const usecase = new GenerateExpressReconversionProjectUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            category: expressCategory,
          });

          // real estate sale transaction
          expect(result.sitePurchaseSellingPrice).toEqual(3600000);
          expect(result.sitePurchasePropertyTransferDuties).toEqual(209160);
          // development installation cost
          expect(result.developmentPlan.costs).toEqual([
            { purpose: "technical_studies", amount: 300000 },
            { purpose: "development_works", amount: 2700000 },
            { purpose: "other", amount: 270000 },
          ]);
          // reinstatement costs
          expect(result.reinstatementCosts).toEqual(undefined);
          expect(result.futureSiteOwner).toEqual({
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
        },
      );
    });

    describe("without site purchase", () => {
      test.each(EXPRESS_URBAN_PROJECT_CATEGORIES)(
        "should create a %s without real estate sale transaction and future site owner",
        async (expressCategory) => {
          const siteOwner = {
            name: "Mairie de Montrouge",
            structureType: "municipality",
          };
          sitesQuery._setSites([{ ...site, owner: siteOwner }]);
          const usecase = new GenerateExpressReconversionProjectUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            category: expressCategory,
          });

          // real estate sale transaction
          expect(result.sitePurchaseSellingPrice).toEqual(undefined);
          expect(result.sitePurchasePropertyTransferDuties).toEqual(undefined);
          expect(result.futureSiteOwner).toEqual(undefined);
        },
      );
    });
  });
});
