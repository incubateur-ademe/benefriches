import {
  BuildingsUseDistribution,
  ReconversionProjectTemplate,
  reconversionProjectTemplateSchema,
  sumListWithKey,
  ReconversionProjectSoilsDistribution,
} from "shared";
import { v4 as uuid } from "uuid";

import { MockPhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";
import { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";
import { SiteFeaturesView } from "src/sites/core/models/views";
import { InMemoryUserQuery } from "src/users/adapters/secondary/user-query/InMemoryUserQuery";

import { ReconversionProjectSaveDto } from "../model/reconversionProject";
import { UrbanProjectFeatures } from "../model/urbanProjects";
import { GenerateReconversionProjectFromTemplateUseCase } from "./generateReconversionProjectFromTemplate.usecase";

const URBAN_PROJECT_TEMPLATES = reconversionProjectTemplateSchema.exclude([
  "PHOTOVOLTAIC_POWER_PLANT",
]).options;

describe("GenerateAndSaveReconversionProjectFromTemplateUseCase Use Case", () => {
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
    test.each(reconversionProjectTemplateSchema.options)(
      "cannot create a template %s reconversion project with a non-existing site",
      async (template) => {
        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const siteId = uuid();
        const result = await usecase.execute({
          siteId,
          createdBy: uuid(),
          template: template,
        });

        expect(result.isFailure()).toBe(true);
        expect((result as FailureResult).getError()).toBe("SiteNotFound");
      },
    );
  });

  describe("On friche site", () => {
    const site: SiteFeaturesView = {
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

    test.each(reconversionProjectTemplateSchema.options)(
      "should create a %s project with default name, given related site id, createdBy, createdAt and creationMode",
      async (template) => {
        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          template: template,
        });

        const templateNameMap: Record<ReconversionProjectTemplate, string> = {
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

        const expectedName = templateNameMap[template];

        expect(result.isSuccess()).toBe(true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        expect(data.relatedSiteId).toEqual(site.id);
        expect(data.createdBy).toEqual(creatorId);
        expect(data.createdAt).toEqual(dateProvider.now());
        expect(data.creationMode).toEqual("express");
        expect(data.name).toEqual(expectedName);
      },
    );

    test.each(reconversionProjectTemplateSchema.options)(
      "should create a %s project with reinstatement scheduled 1 year after current date, installation works 1 year after reinstatement and first operations 1 year after",
      async (template) => {
        dateProvider = new DeterministicDateProvider(new Date("2024-09-01T13:00:00"));

        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          template: template,
        });

        expect(result.isSuccess()).toBe(true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        expect(data.reinstatementSchedule).toEqual({
          startDate: new Date("2025-09-01T13:00:00"),
          endDate: new Date("2026-09-01T13:00:00"),
        });
        expect(data.developmentPlan.installationSchedule).toEqual({
          startDate: new Date("2026-09-02T13:00:00"),
          endDate: new Date("2027-09-02T13:00:00"),
        });
        expect(data.operationsFirstYear).toEqual(2028);
      },
    );

    describe("Urban projects", () => {
      test.each(URBAN_PROJECT_TEMPLATES)(
        "should create a %s project with site city as developer, reinstatement contract owner and no site owner",
        async (template) => {
          const usecase = new GenerateReconversionProjectFromTemplateUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            template: template,
          });

          expect(result.isSuccess()).toBe(true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          expect(data.futureSiteOwner).toEqual(undefined);
          expect(data.developmentPlan.developer).toEqual({
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
          expect(data.reinstatementContractOwner).toEqual({
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
        },
      );
      test.each(URBAN_PROJECT_TEMPLATES)(
        "should create a %s project with expected sale after development relative to buildings floor surface area",
        async (template) => {
          const usecase = new GenerateReconversionProjectFromTemplateUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            template: template,
          });

          let expectedResalePrice;

          switch (template) {
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

          expect(result.isSuccess()).toBe(true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          expect(data.siteResaleExpectedSellingPrice).toEqual(expectedResalePrice);
          expect(Math.round(data.siteResaleExpectedPropertyTransferDuties ?? 0)).toEqual(
            Math.round(expectedResalePrice * 0.0581),
          );
        },
      );

      test.each(URBAN_PROJECT_TEMPLATES)(
        "should create a %s project with right spaces, buildings floor area and soils distribution",
        async (template) => {
          const usecase = new GenerateReconversionProjectFromTemplateUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            template: template,
          });

          let expectedBuildingsFloorAreaDistribution: BuildingsUseDistribution = {};
          let expectedSoilsDistribution: ReconversionProjectSoilsDistribution = [];

          if (template === "RESIDENTIAL_TENSE_AREA") {
            expectedSoilsDistribution = [
              {
                soilType: "BUILDINGS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 4200,
              },
              {
                soilType: "IMPERMEABLE_SOILS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 350,
              },
              {
                soilType: "MINERAL_SOIL",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 350,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 2100,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_GREEN_SPACE",
                surfaceArea: 1500,
              },
              { soilType: "IMPERMEABLE_SOILS", spaceCategory: "PUBLIC_SPACE", surfaceArea: 700 },
              { soilType: "MINERAL_SOIL", spaceCategory: "PUBLIC_SPACE", surfaceArea: 400 },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_SPACE",
                surfaceArea: 400,
              },
            ];
            expectedBuildingsFloorAreaDistribution = {
              RESIDENTIAL: 8500,
              LOCAL_STORE: 400,
              OFFICES: 500,
              LOCAL_SERVICES: 600,
            };
          } else if (template === "NEW_URBAN_CENTER") {
            expectedSoilsDistribution = [
              {
                soilType: "BUILDINGS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 2925,
              },
              {
                soilType: "IMPERMEABLE_SOILS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 325,
              },
              {
                soilType: "MINERAL_SOIL",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 325,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 2925,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_GREEN_SPACE",
                surfaceArea: 1500,
              },
              { soilType: "IMPERMEABLE_SOILS", spaceCategory: "PUBLIC_SPACE", surfaceArea: 1000 },
              { soilType: "MINERAL_SOIL", spaceCategory: "PUBLIC_SPACE", surfaceArea: 500 },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_SPACE",
                surfaceArea: 500,
              },
            ];
            expectedBuildingsFloorAreaDistribution = {
              RESIDENTIAL: 4960,
              LOCAL_STORE: 160,
              OFFICES: 320,
              LOCAL_SERVICES: 640,
              ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 160,
              PUBLIC_FACILITIES: 160,
            };
          } else if (template === "PUBLIC_FACILITIES") {
            expectedSoilsDistribution = [
              {
                soilType: "BUILDINGS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 4100,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_GREEN_SPACE",
                surfaceArea: 3800,
              },
              { soilType: "IMPERMEABLE_SOILS", spaceCategory: "PUBLIC_SPACE", surfaceArea: 2100 },
            ];
            expectedBuildingsFloorAreaDistribution = {
              PUBLIC_FACILITIES: 4100,
            };
          } else if (template === "OFFICES") {
            expectedSoilsDistribution = [
              {
                soilType: "BUILDINGS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 8_000,
              },
              {
                soilType: "IMPERMEABLE_SOILS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 500,
              },
              {
                soilType: "MINERAL_SOIL",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 500,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 1_000,
              },
            ];
            expectedBuildingsFloorAreaDistribution = {
              OFFICES: 24_000,
            };
          } else if (template === "TOURISM_AND_CULTURAL_FACILITIES") {
            expectedSoilsDistribution = [
              {
                soilType: "BUILDINGS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 6_000,
              },
              {
                soilType: "IMPERMEABLE_SOILS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 2_000,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_GREEN_SPACE",
                surfaceArea: 2_000,
              },
            ];
            expectedBuildingsFloorAreaDistribution = {
              CULTURAL_PLACE: 6_000,
            };
          } else if (template === "INDUSTRIAL_FACILITIES") {
            expectedSoilsDistribution = [
              {
                soilType: "BUILDINGS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 6_000,
              },
              {
                soilType: "IMPERMEABLE_SOILS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 3_000,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 1_000,
              },
            ];
            expectedBuildingsFloorAreaDistribution = {
              ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 6_000,
            };
          } else if (template === "RENATURATION") {
            expectedSoilsDistribution = [
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_GREEN_SPACE",
                surfaceArea: site.surfaceArea,
              },
            ];
          } else {
            expectedSoilsDistribution = [
              {
                soilType: "BUILDINGS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 2000,
              },
              {
                soilType: "IMPERMEABLE_SOILS",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 700,
              },
              {
                soilType: "MINERAL_SOIL",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 200,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
                surfaceArea: 3700,
              },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_GREEN_SPACE",
                surfaceArea: 1900,
              },
              { soilType: "IMPERMEABLE_SOILS", spaceCategory: "PUBLIC_SPACE", surfaceArea: 900 },
              { soilType: "MINERAL_SOIL", spaceCategory: "PUBLIC_SPACE", surfaceArea: 200 },
              {
                soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                spaceCategory: "PUBLIC_SPACE",
                surfaceArea: 400,
              },
            ];
            expectedBuildingsFloorAreaDistribution = {
              RESIDENTIAL: 3800,
            };
          }

          expect(result.isSuccess()).toBe(true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          const { developmentPlan, soilsDistribution = [] } = data;
          const { buildingsFloorAreaDistribution } =
            developmentPlan.features as UrbanProjectFeatures;

          expect(developmentPlan.type).toEqual("URBAN_PROJECT");

          expect(sumListWithKey(soilsDistribution, "surfaceArea")).toEqual(site.surfaceArea);
          expect(buildingsFloorAreaDistribution).toEqual(expectedBuildingsFloorAreaDistribution);

          expect(soilsDistribution).toEqual(expectedSoilsDistribution);
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
        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          template: "PHOTOVOLTAIC_POWER_PLANT",
        });

        expect(result.isSuccess()).toBe(true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        expect(data.futureSiteOwner).toEqual(undefined);
        expect(data.futureOperator).toEqual({
          structureType: "company",
          name: "My company",
        });
        expect(data.developmentPlan.developer).toEqual({
          structureType: "company",
          name: "My company",
        });
        expect(data.reinstatementContractOwner).toEqual({
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
        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          template: "PHOTOVOLTAIC_POWER_PLANT",
        });

        expect(result.isSuccess()).toBe(true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        expect(data.futureSiteOwner).toEqual(undefined);
        expect(data.futureOperator).toEqual({
          structureType: "municipality",
          name: "Mairie de Blajan",
        });
        expect(data.developmentPlan.developer).toEqual({
          structureType: "municipality",
          name: "Mairie de Blajan",
        });
        expect(data.reinstatementContractOwner).toEqual({
          structureType: "municipality",
          name: "Mairie de Blajan",
        });
      });
      it("should create a PHOTOVOLTAIC_POWER_PLANT project with site owner as developer, reinstatement contract owner and site operator", async () => {
        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: site.id,
          createdBy: creatorId,
          template: "PHOTOVOLTAIC_POWER_PLANT",
        });

        expect(result.isSuccess()).toBe(true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        expect(data.futureSiteOwner).toEqual(undefined);
        expect(data.futureOperator).toEqual({
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
        expect(data.developmentPlan.developer).toEqual({
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
        expect(data.reinstatementContractOwner).toEqual({
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

        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: nonPollutedFricheWithNoBuildings.id,
          createdBy: creatorId,
          template: "RESIDENTIAL_NORMAL_AREA",
        });

        expect(result.isSuccess()).toBe(true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        // real estate sale transaction
        expect(data.sitePurchaseSellingPrice).toEqual(720000);
        expect(data.sitePurchasePropertyTransferDuties).toEqual(41832);
        // development installation cost
        expect(data.developmentPlan.costs).toEqual([
          { purpose: "technical_studies", amount: 60000 },
          { purpose: "development_works", amount: 540000 },
          { purpose: "other", amount: 54000 },
        ]);
        // reinstatement costs
        expect(data.reinstatementCosts).toEqual([]);
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

        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: pollutedFricheWithBuildings.id,
          createdBy: creatorId,
          template: "RESIDENTIAL_NORMAL_AREA",
        });

        expect(result.isSuccess()).toBe(true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        // real estate sale transaction
        expect(data.sitePurchaseSellingPrice).toEqual(7200000);
        expect(data.sitePurchasePropertyTransferDuties).toEqual(418320);
        // development installation cost
        expect(data.developmentPlan.costs).toEqual([
          { purpose: "technical_studies", amount: 600000 },
          { purpose: "development_works", amount: 5400000 },
          { purpose: "other", amount: 540000 },
        ]);
        // reinstatement costs
        expect(data.reinstatementCosts).toHaveLength(3);
        expect(data.reinstatementCosts).toContainEqual({
          purpose: "asbestos_removal",
          amount: 75000,
        });
        expect(data.reinstatementCosts).toContainEqual({
          purpose: "demolition",
          amount: 75000,
        });
        expect(data.reinstatementCosts).toContainEqual({
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

        const usecase = new GenerateReconversionProjectFromTemplateUseCase(
          dateProvider,
          sitesQuery,
          photovoltaicPerformanceService,
          userQuery,
        );

        const creatorId = uuid();
        const result = await usecase.execute({
          siteId: allImpermeableFriche.id,
          createdBy: creatorId,
          template: "RESIDENTIAL_NORMAL_AREA",
        });

        expect(result.isSuccess()).toBe(true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        // reinstatement costs
        expect(data.reinstatementCosts).toHaveLength(4);
        expect(data.reinstatementCosts?.at(0)).toEqual({
          purpose: "deimpermeabilization",
          amount: 64000,
        });
        expect(data.reinstatementCosts?.at(1)).toEqual({
          purpose: "sustainable_soils_reinstatement",
          amount: 270000,
        });
        expect(data.reinstatementCosts?.at(2)?.purpose).toEqual("demolition");
        expect(data.reinstatementCosts?.at(3)?.purpose).toEqual("asbestos_removal");
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
    } as const satisfies SiteFeaturesView;
    describe("with site purchase", () => {
      test.each(URBAN_PROJECT_TEMPLATES)(
        "should create a %s with real estate sale transaction and development installation costs based on site",
        async (template) => {
          sitesQuery._setSites([site]);
          const usecase = new GenerateReconversionProjectFromTemplateUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            template: template,
          });

          expect(result.isSuccess()).toBe(true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          // real estate sale transaction
          expect(data.sitePurchaseSellingPrice).toEqual(3600000);
          expect(data.sitePurchasePropertyTransferDuties).toEqual(209160);
          // development installation cost
          expect(data.developmentPlan.costs).toEqual([
            { purpose: "technical_studies", amount: 300000 },
            { purpose: "development_works", amount: 2700000 },
            { purpose: "other", amount: 270000 },
          ]);
          // reinstatement costs
          expect(data.reinstatementCosts).toEqual(undefined);
          expect(data.futureSiteOwner).toEqual({
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
        },
      );
    });

    describe("without site purchase", () => {
      test.each(URBAN_PROJECT_TEMPLATES)(
        "should create a %s without real estate sale transaction and future site owner",
        async (template) => {
          const siteOwner = {
            name: "Mairie de Montrouge",
            structureType: "municipality",
          };
          sitesQuery._setSites([{ ...site, owner: siteOwner }]);
          const usecase = new GenerateReconversionProjectFromTemplateUseCase(
            dateProvider,
            sitesQuery,
            photovoltaicPerformanceService,
            userQuery,
          );

          const creatorId = uuid();
          const result = await usecase.execute({
            siteId: site.id,
            createdBy: creatorId,
            template: template,
          });

          expect(result.isSuccess()).toBe(true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          // real estate sale transaction
          expect(data.sitePurchaseSellingPrice).toEqual(undefined);
          expect(data.sitePurchasePropertyTransferDuties).toEqual(undefined);
          expect(data.futureSiteOwner).toEqual(undefined);
        },
      );
    });
  });
});
