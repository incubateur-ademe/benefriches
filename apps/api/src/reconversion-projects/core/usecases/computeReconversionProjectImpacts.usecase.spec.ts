import { v4 as uuid } from "uuid";

import { MockDV3FApiService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService.mock";
import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { InMemoryReconversionProjectImpactsQuery } from "src/reconversion-projects/adapters/secondary/queries/reconversion-project-impacts/InMemoryReconversionProjectImpactsQuery";
import { InMemorySiteImpactsQuery } from "src/reconversion-projects/adapters/secondary/queries/site-impacts/InMemorySiteImpactsQuery";
import { MockCityDataService } from "src/reconversion-projects/adapters/secondary/services/city-service/MockCityDataService";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { FakeGetSoilsCarbonStorageService } from "../gateways/FakeGetSoilsCarbonStorageService";
import {
  ComputeReconversionProjectImpactsUseCase,
  ReconversionProjectImpactsDataView,
  Result,
  SiteImpactsDataView,
} from "./computeReconversionProjectImpacts.usecase";

describe("ComputeReconversionProjectImpactsUseCase", () => {
  let dateProvider: DateProvider;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
  });

  describe("Error cases", () => {
    it("throws error when reconversion project does not exist", async () => {
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      const siteQuery = new InMemorySiteImpactsQuery();

      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectQuery,
        siteQuery,
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
        new GetCityRelatedDataService(new MockCityDataService(), new MockDV3FApiService()),
      );

      const reconversionProjectId = uuid();
      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({ reconversionProjectId, evaluationPeriodInYears }),
      ).rejects.toThrow(`ReconversionProject with id ${reconversionProjectId} not found`);
    });

    it("throws error when reconversion project development plan does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData({
        id: reconversionProjectId,
        isExpressProject: false,
        name: "Test reconversion project",
        relatedSiteId: siteId,
        soilsDistribution: {},
        sitePurchaseTotalAmount: 0,
        reinstatementExpenses: [],
        developmentPlanInstallationExpenses: [],
        financialAssistanceRevenues: [],
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
      });
      const siteQuery = new InMemorySiteImpactsQuery();
      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectQuery,
        siteQuery,
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
        new GetCityRelatedDataService(new MockCityDataService(), new MockDV3FApiService()),
      );
      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({ reconversionProjectId, evaluationPeriodInYears }),
      ).rejects.toThrow(
        `ComputeReconversionProjectImpacts: ReconversionProject with id ${reconversionProjectId} has no development plan`,
      );
    });

    it("throws error when reconversion project related site does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData({
        id: reconversionProjectId,
        isExpressProject: false,
        name: "Test reconversion project",
        developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
        relatedSiteId: siteId,
        soilsDistribution: {},
        sitePurchaseTotalAmount: 0,
        reinstatementExpenses: [],
        developmentPlanInstallationExpenses: [],
        financialAssistanceRevenues: [],
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
      });
      const siteQuery = new InMemorySiteImpactsQuery();
      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectQuery,
        siteQuery,
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
        new GetCityRelatedDataService(new MockCityDataService(), new MockDV3FApiService()),
      );

      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({ reconversionProjectId, evaluationPeriodInYears }),
      ).rejects.toThrow(`Site with id ${siteId} not found`);
    });
  });

  describe("Success cases", () => {
    const reconversionProjectImpactDataView = {
      id: uuid(),
      name: "Project with big impacts",
      relatedSiteId: uuid(),
      isExpressProject: false,
      soilsDistribution: {
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
        PRAIRIE_TREES: 20000,
        BUILDINGS: 20000,
        MINERAL_SOIL: 20000,
        IMPERMEABLE_SOILS: 30000,
      },
      conversionSchedule: {
        startDate: new Date("2025-07-01"),
        endDate: new Date("2026-07-01"),
      },
      reinstatementSchedule: {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2026-01-01"),
      },
      futureOperatorName: "Mairie de Blajan",
      futureSiteOwnerName: "Mairie de Blajan",
      reinstatementContractOwnerName: "Mairie de Blajan",
      sitePurchaseTotalAmount: 150000,
      reinstatementExpenses: [{ amount: 500000, purpose: "demolition" }],
      developmentPlanInstallationExpenses: [{ amount: 200000, purpose: "installation_works" }],
      developmentPlanFeatures: {
        electricalPowerKWc: 258,
        surfaceArea: 20000,
        contractDuration: 30,
        expectedAnnualProduction: 4679,
      },
      developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
      developmentPlanDeveloperName: "Mairie de Blajan",
      financialAssistanceRevenues: [{ amount: 150000, source: "public_subsidies" }],
      yearlyProjectedExpenses: [
        { amount: 1000, purpose: "taxes" },
        { amount: 10000, purpose: "maintenance" },
      ],
      yearlyProjectedRevenues: [
        { amount: 10000, source: "rent" },
        { amount: 1000, source: "other" },
      ],
      sitePurchasePropertyTransferDutiesAmount: 5432,
      operationsFirstYear: 2025,
      decontaminatedSoilSurface: 20000,
    } as const satisfies ReconversionProjectImpactsDataView;
    const site = {
      id: reconversionProjectImpactDataView.relatedSiteId,
      contaminatedSoilSurface: 20000,
      name: "My base site",
      isFriche: true,
      fricheActivity: "AGRICULTURAL",
      surfaceArea: 50000,
      soilsDistribution: {
        ...reconversionProjectImpactDataView.soilsDistribution,
        PRAIRIE_TREES: 0,
        IMPERMEABLE_SOILS: 10000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
      },
      addressCityCode: "23456",
      addressLabel: "Blajan",
      ownerName: "Current owner",
      ownerStructureType: "company",
      tenantName: "Current tenant",
      hasAccidents: true,
      accidentsDeaths: 0,
      accidentsMinorInjuries: 1,
      accidentsSevereInjuries: 2,
      yearlyExpenses: [
        { amount: 54000, bearer: "tenant", purpose: "rent" },
        { amount: 11600, bearer: "tenant", purpose: "security" },
        { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
        { amount: 500, bearer: "owner", purpose: "propertyTaxes" },
      ],
    } as const satisfies Required<SiteImpactsDataView>;

    it("returns impacts over 10 years for a reconversion project dedicated to renewable energy production on friche with contaminated soil", async () => {
      const evaluationPeriodInYears = 10;
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData(reconversionProjectImpactDataView);
      const siteQuery = new InMemorySiteImpactsQuery();
      siteQuery._setData(site);

      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectQuery,
        siteQuery,
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
        new GetCityRelatedDataService(new MockCityDataService(), new MockDV3FApiService()),
      );
      const result = await usecase.execute({
        reconversionProjectId: reconversionProjectImpactDataView.id,
        evaluationPeriodInYears,
      });
      expect(result).toEqual<Result>({
        id: reconversionProjectImpactDataView.id,
        name: reconversionProjectImpactDataView.name,
        relatedSiteId: site.id,
        relatedSiteName: site.name,
        projectData: {
          soilsDistribution: reconversionProjectImpactDataView.soilsDistribution,
          isExpressProject: reconversionProjectImpactDataView.isExpressProject,
          contaminatedSoilSurface: 0,
          developmentPlan: {
            contractDuration: 30,
            electricalPowerKWc: 258,
            expectedAnnualProduction: 4679,
            surfaceArea: 20000,
            type: "PHOTOVOLTAIC_POWER_PLANT",
          },
        },
        siteData: {
          addressLabel: "Blajan",
          contaminatedSoilSurface: 20000,
          soilsDistribution: {
            ...reconversionProjectImpactDataView.soilsDistribution,
            PRAIRIE_TREES: 0,
            IMPERMEABLE_SOILS: 10000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
          },
          surfaceArea: 50000,
          isFriche: true,
          fricheActivity: "AGRICULTURAL",
          owner: {
            structureType: "company",
            name: "Current owner",
          },
        },
        impacts: {
          socioeconomic: {
            total: -79146,
            impacts: [
              {
                actor: "Current owner",
                amount: -446515,
                impact: "rental_income",
                impactCategory: "economic_direct",
              },
              {
                actor: "Current tenant",
                amount: 108321,
                impact: "avoided_friche_costs",
                impactCategory: "economic_direct",
                details: [
                  { amount: 95918, impact: "avoided_security_costs" },
                  { amount: 12403, impact: "avoided_illegal_dumping_costs" },
                ],
              },

              {
                actor: "community",
                amount: 5432,
                impact: "property_transfer_duties_income",
                impactCategory: "economic_direct",
              },
              {
                actor: "community",
                amount: 4252,
                impact: "water_regulation",
                impactCategory: "environmental_monetary",
              },
              {
                actor: "human_society",
                amount: 26864,
                impact: "ecosystem_services",
                impactCategory: "environmental_monetary",
                details: [
                  {
                    amount: 1279,
                    impact: "nature_related_wellness_and_leisure",
                  },
                  {
                    amount: 1658,
                    impact: "pollination",
                  },
                  {
                    amount: 613,
                    impact: "invasive_species_regulation",
                  },
                  {
                    amount: 17567,
                    impact: "water_cycle",
                  },
                  {
                    amount: 1243,
                    impact: "nitrogen_cycle",
                  },
                  {
                    amount: 4504,
                    impact: "soil_erosion",
                  },
                ],
              },
              {
                actor: "community",
                amount: 9009,
                impact: "taxes_income",
                impactCategory: "economic_indirect",
                details: [
                  {
                    impact: "project_photovoltaic_taxes_income",
                    amount: 9009,
                  },
                ],
              },
              {
                actor: "human_society",
                amount: 213491,
                impact: "avoided_co2_eq_emissions",
                impactCategory: "environmental_monetary",
                details: [{ impact: "avoided_co2_eq_with_enr", amount: 213491 }],
              },
            ],
          },
          economicBalance: {
            total: -700000,
            bearer: "Mairie de Blajan",
            costs: {
              total: 940957,
              operationsCosts: {
                total: 90957,
                costs: [
                  { amount: 8269, purpose: "taxes" },
                  { amount: 82688, purpose: "maintenance" },
                ],
              },
              siteReinstatement: {
                total: 500000,
                costs: [{ amount: 500000, purpose: "demolition" }],
              },
              developmentPlanInstallation: {
                total: 200000,
                costs: [{ amount: 200000, purpose: "installation_works" }],
              },
              sitePurchase: 150000,
            },
            revenues: {
              total: 240957,
              operationsRevenues: {
                total: 90957,
                revenues: [
                  { amount: 82688, source: "rent" },
                  { amount: 8269, source: "other" },
                ],
              },
              financialAssistance: {
                total: 150000,
                revenues: [{ amount: 150000, source: "public_subsidies" }],
              },
            },
          },
          environmental: {
            nonContaminatedSurfaceArea: {
              current: 30000,
              forecast: 50000,
              difference: 20000,
            },
            permeableSurfaceArea: {
              base: 60000,
              forecast: 50000,
              difference: -10000,
              greenSoil: {
                base: 40000,
                forecast: 30000,
                difference: -10000,
              },
              mineralSoil: {
                base: 20000,
                forecast: 20000,
                difference: 0,
              },
            },
            avoidedCO2TonsWithEnergyProduction: {
              current: 0,
              forecast: 112.29599999999999,
            },
            soilsCarbonStorage: {
              isSuccess: true,
              current: {
                total: 20,
                soils: [
                  {
                    type: "IMPERMEABLE_SOILS",
                    carbonStorage: 2,
                    surfaceArea: 1000,
                  },
                  {
                    type: "BUILDINGS",
                    carbonStorage: 2,
                    surfaceArea: 1000,
                  },
                  {
                    type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                    carbonStorage: 16,
                    surfaceArea: 1000,
                  },
                ],
              },
              forecast: {
                total: 20,
                soils: [
                  {
                    type: "IMPERMEABLE_SOILS",
                    carbonStorage: 2,
                    surfaceArea: 1000,
                  },
                  {
                    type: "BUILDINGS",
                    carbonStorage: 2,
                    surfaceArea: 1000,
                  },
                  {
                    type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                    carbonStorage: 16,
                    surfaceArea: 1000,
                  },
                ],
              },
            },
          },
          social: {
            fullTimeJobs: {
              current: 0,
              forecast: 0.4,
              conversion: {
                current: 0,
                forecast: 0.3,
              },
              operations: {
                current: 0,
                forecast: 0.1,
              },
            },
            accidents: {
              current: 3,
              forecast: 0,
              deaths: {
                current: 0,
                forecast: 0,
              },
              severeInjuries: {
                current: 2,
                forecast: 0,
              },
              minorInjuries: {
                current: 1,
                forecast: 0,
              },
            },
            householdsPoweredByRenewableEnergy: {
              current: 0,
              forecast: 1000,
            },
          },
        },
      });
    });

    it("returns impacts when soils carbon storage cannbot be computed", async () => {
      const evaluationPeriodInYears = 10;
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData(reconversionProjectImpactDataView);
      const siteQuery = new InMemorySiteImpactsQuery();
      siteQuery._setData(site);
      const soilsCarbonStorageService = new FakeGetSoilsCarbonStorageService();
      soilsCarbonStorageService.shouldFailOnExecute();

      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectQuery,
        siteQuery,
        soilsCarbonStorageService,
        dateProvider,
        new GetCityRelatedDataService(new MockCityDataService(), new MockDV3FApiService()),
      );
      const result = await usecase.execute({
        reconversionProjectId: reconversionProjectImpactDataView.id,
        evaluationPeriodInYears,
      });
      expect(result.id).toEqual(reconversionProjectImpactDataView.id);
      expect(result.impacts.environmental.soilsCarbonStorage).toEqual({
        isSuccess: false,
      });
    });
  });
});
