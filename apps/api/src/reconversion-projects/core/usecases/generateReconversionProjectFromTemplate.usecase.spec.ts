import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import type {
  BuildingsUseDistribution,
  ReconversionProjectTemplate,
  ReconversionProjectSoilsDistribution,
} from "shared";
import { reconversionProjectTemplateSchema, sumListWithKey } from "shared";
import { v4 as uuid } from "uuid";

import { FakePhotovoltaicDataProvider } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/FakePhotovoltaicDataProvider";
import type { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";
import type { SiteFeaturesView } from "src/sites/core/models/views";
import { InMemoryUserQuery } from "src/users/adapters/secondary/user-query/InMemoryUserQuery";

import type { ReconversionProjectSaveDto } from "../model/reconversionProject";
import type { UrbanProjectFeatures } from "../model/urbanProjects";
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
    photovoltaicPerformanceService = new FakePhotovoltaicDataProvider();
    userQuery = new InMemoryUserQuery();
  });

  describe("Error cases", () => {
    for (const template of reconversionProjectTemplateSchema.options) {
      it(`cannot create a template ${template} reconversion project with a non-existing site`, async () => {
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

        assert.strictEqual(result.isFailure(), true);
        assert.strictEqual((result as FailureResult).getError(), "SiteNotFound");
      });
    }
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

    for (const template of reconversionProjectTemplateSchema.options) {
      it(`should create a ${template} project with default name, given related site id, createdBy, createdAt and creationMode`, async () => {
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

        assert.strictEqual(result.isSuccess(), true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        assert.deepStrictEqual(data.relatedSiteId, site.id);
        assert.deepStrictEqual(data.createdBy, creatorId);
        assert.deepStrictEqual(data.createdAt, dateProvider.now());
        assert.deepStrictEqual(data.creationMode, "express");
        assert.deepStrictEqual(data.name, expectedName);
      });
    }

    for (const template of reconversionProjectTemplateSchema.options) {
      it(`should create a ${template} project with reinstatement scheduled 1.5 years after current date, installation works 1.5 years after reinstatement and first operations 1 year after`, async () => {
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

        assert.strictEqual(result.isSuccess(), true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        assert.deepStrictEqual(data.reinstatementSchedule, {
          startDate: new Date("2026-03-01T13:00:00"),
          endDate: new Date("2027-09-01T13:00:00"),
        });
        assert.deepStrictEqual(data.developmentPlan.installationSchedule, {
          startDate: new Date("2027-09-02T13:00:00"),
          endDate: new Date("2028-09-02T13:00:00"),
        });
        assert.deepStrictEqual(data.operationsFirstYear, 2029);
      });
    }

    describe("Urban projects", () => {
      for (const template of URBAN_PROJECT_TEMPLATES) {
        it(`should create a ${template} project with site city as developer, reinstatement contract owner and no site owner`, async () => {
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

          assert.strictEqual(result.isSuccess(), true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          assert.strictEqual(data.futureSiteOwner, undefined);
          assert.deepStrictEqual(data.developmentPlan.developer, {
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
          assert.deepStrictEqual(data.reinstatementContractOwner, {
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
        });
      }

      for (const template of URBAN_PROJECT_TEMPLATES) {
        it(`should create a ${template} project with expected sale after development relative to buildings floor surface area`, async () => {
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

          assert.strictEqual(result.isSuccess(), true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          assert.deepStrictEqual(data.siteResaleExpectedSellingPrice, expectedResalePrice);
          assert.deepStrictEqual(
            Math.round(data.siteResaleExpectedPropertyTransferDuties ?? 0),
            Math.round(expectedResalePrice * 0.0581),
          );
        });
      }

      for (const template of URBAN_PROJECT_TEMPLATES) {
        it(`should create a ${template} project with right spaces, buildings floor area and soils distribution`, async () => {
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
              OTHER_CULTURAL_PLACE: 6_000,
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

          assert.strictEqual(result.isSuccess(), true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          const { developmentPlan, soilsDistribution = [] } = data;
          const { buildingsFloorAreaDistribution } =
            developmentPlan.features as UrbanProjectFeatures;

          assert.deepStrictEqual(developmentPlan.type, "URBAN_PROJECT");

          assert.deepStrictEqual(
            sumListWithKey(soilsDistribution, "surfaceArea"),
            site.surfaceArea,
          );
          assert.deepStrictEqual(
            buildingsFloorAreaDistribution,
            expectedBuildingsFloorAreaDistribution,
          );

          assert.deepStrictEqual(soilsDistribution, expectedSoilsDistribution);
          assert.deepStrictEqual(
            sumListWithKey(soilsDistribution, "surfaceArea"),
            site.surfaceArea,
          );
        });
      }
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

        assert.strictEqual(result.isSuccess(), true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        assert.strictEqual(data.futureSiteOwner, undefined);
        assert.deepStrictEqual(data.futureOperator, {
          structureType: "company",
          name: "My company",
        });
        assert.deepStrictEqual(data.developmentPlan.developer, {
          structureType: "company",
          name: "My company",
        });
        assert.deepStrictEqual(data.reinstatementContractOwner, {
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

        assert.strictEqual(result.isSuccess(), true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        assert.strictEqual(data.futureSiteOwner, undefined);
        assert.deepStrictEqual(data.futureOperator, {
          structureType: "municipality",
          name: "Mairie de Blajan",
        });
        assert.deepStrictEqual(data.developmentPlan.developer, {
          structureType: "municipality",
          name: "Mairie de Blajan",
        });
        assert.deepStrictEqual(data.reinstatementContractOwner, {
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

        assert.strictEqual(result.isSuccess(), true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        assert.strictEqual(data.futureSiteOwner, undefined);
        assert.deepStrictEqual(data.futureOperator, {
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
        assert.deepStrictEqual(data.developmentPlan.developer, {
          structureType: "municipality",
          name: "Mairie de Montrouge",
        });
        assert.deepStrictEqual(data.reinstatementContractOwner, {
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

        assert.strictEqual(result.isSuccess(), true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        // real estate sale transaction
        assert.deepStrictEqual(data.sitePurchaseSellingPrice, 720000);
        assert.deepStrictEqual(data.sitePurchasePropertyTransferDuties, 41832);
        // development installation cost
        assert.deepStrictEqual(data.developmentPlan.costs, [
          { purpose: "technical_studies", amount: 60000 },
          { purpose: "development_works", amount: 540000 },
          { purpose: "other", amount: 54000 },
        ]);
        // reinstatement costs
        assert.deepStrictEqual(data.reinstatementCosts, []);
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

      it("should create a RESIDENTIAL_NORMAL_AREA with reinstatement costs, real estate sale transaction and development installation costs based on site data", async () => {
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

        assert.strictEqual(result.isSuccess(), true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        // real estate sale transaction
        assert.deepStrictEqual(data.sitePurchaseSellingPrice, 7200000);
        assert.deepStrictEqual(data.sitePurchasePropertyTransferDuties, 418320);
        // development installation cost
        assert.deepStrictEqual(data.developmentPlan.costs, [
          { purpose: "technical_studies", amount: 600000 },
          { purpose: "development_works", amount: 5400000 },
          { purpose: "other", amount: 540000 },
        ]);
        // reinstatement costs
        assert.strictEqual((data.reinstatementCosts ?? []).length, 3);
        {
          const found = (data.reinstatementCosts ?? []).find((i) => {
            try {
              assert.deepStrictEqual(i, { purpose: "asbestos_removal", amount: 75000 });
              return true;
            } catch {
              return false;
            }
          });
          assert.ok(found !== undefined);
        }
        {
          const found = (data.reinstatementCosts ?? []).find((i) => {
            try {
              assert.deepStrictEqual(i, { purpose: "demolition", amount: 75000 });
              return true;
            } catch {
              return false;
            }
          });
          assert.ok(found !== undefined);
        }
        {
          const found = (data.reinstatementCosts ?? []).find((i) => {
            try {
              assert.deepStrictEqual(i, { purpose: "remediation", amount: 2475000 });
              return true;
            } catch {
              return false;
            }
          });
          assert.ok(found !== undefined);
        }
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

        assert.strictEqual(result.isSuccess(), true);
        const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
        // reinstatement costs
        assert.strictEqual((data.reinstatementCosts ?? []).length, 4);
        assert.deepStrictEqual(data.reinstatementCosts?.at(0), {
          purpose: "deimpermeabilization",
          amount: 64000,
        });
        assert.deepStrictEqual(data.reinstatementCosts?.at(1), {
          purpose: "sustainable_soils_reinstatement",
          amount: 270000,
        });
        assert.deepStrictEqual(data.reinstatementCosts?.at(2)?.purpose, "demolition");
        assert.deepStrictEqual(data.reinstatementCosts?.at(3)?.purpose, "asbestos_removal");
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
      agriculturalOperationActivity: "CATTLE_FARMING",
      soilsDistribution: {
        PRAIRIE_GRASS: 30000,
        FOREST_MIXED: 18900,
        WATER: 600,
        MINERAL_SOIL: 500,
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
      owner: {
        name: "Monsieur Dupont",
        structureType: "private_individual",
      },
    } as const satisfies SiteFeaturesView;

    describe("with site purchase", () => {
      for (const template of URBAN_PROJECT_TEMPLATES) {
        it(`should create a ${template} with real estate sale transaction and development installation costs based on site`, async () => {
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

          assert.strictEqual(result.isSuccess(), true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          // real estate sale transaction
          assert.deepStrictEqual(data.sitePurchaseSellingPrice, 3600000);
          assert.deepStrictEqual(data.sitePurchasePropertyTransferDuties, 209160);
          // development installation cost
          assert.deepStrictEqual(data.developmentPlan.costs, [
            { purpose: "technical_studies", amount: 300000 },
            { purpose: "development_works", amount: 2700000 },
            { purpose: "other", amount: 270000 },
          ]);
          // reinstatement costs
          assert.strictEqual(data.reinstatementCosts, undefined);
          assert.deepStrictEqual(data.futureSiteOwner, {
            structureType: "municipality",
            name: "Mairie de Montrouge",
          });
        });
      }
    });

    describe("without site purchase", () => {
      for (const template of URBAN_PROJECT_TEMPLATES) {
        it(`should create a ${template} without real estate sale transaction and future site owner`, async () => {
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

          assert.strictEqual(result.isSuccess(), true);
          const data = (result as SuccessResult<ReconversionProjectSaveDto>).getData();
          // real estate sale transaction
          assert.strictEqual(data.sitePurchaseSellingPrice, undefined);
          assert.strictEqual(data.sitePurchasePropertyTransferDuties, undefined);
          assert.strictEqual(data.futureSiteOwner, undefined);
        });
      }
    });
  });
});
