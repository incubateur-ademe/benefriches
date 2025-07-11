import { SiteImpactsDataView } from "shared";
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
  ApiReconversionProjectImpactsDataView,
  ComputeReconversionProjectImpactsUseCase,
  Result,
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
        developmentPlan: undefined,
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
        developmentPlan: {
          type: "PHOTOVOLTAIC_POWER_PLANT",
          installationCosts: [],
          features: {
            contractDuration: 20,
            electricalPowerKWc: 100,
            expectedAnnualProduction: 1000,
            surfaceArea: 1000,
          },
        },
        relatedSiteId: siteId,
        soilsDistribution: {},
        sitePurchaseTotalAmount: 0,
        reinstatementExpenses: [],
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

  describe("Success cases: Project on friche", () => {
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
      developmentPlan: {
        installationCosts: [{ amount: 200000, purpose: "installation_works" }],
        features: {
          electricalPowerKWc: 258,
          surfaceArea: 20000,
          contractDuration: 30,
          expectedAnnualProduction: 4679,
        },
        type: "PHOTOVOLTAIC_POWER_PLANT",
        developerName: "Mairie de Blajan",
      },
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
    } as const satisfies ApiReconversionProjectImpactsDataView;
    const site = {
      id: reconversionProjectImpactDataView.relatedSiteId,
      description: "Description",
      contaminatedSoilSurface: 20000,
      name: "My base site",
      nature: "FRICHE",
      fricheActivity: "AGRICULTURE",
      surfaceArea: 50000,
      soilsDistribution: {
        ...reconversionProjectImpactDataView.soilsDistribution,
        PRAIRIE_TREES: 0,
        IMPERMEABLE_SOILS: 10000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
      },
      address: {
        cityCode: "23456",
        value: "Blajan",
        banId: "",
        city: "Blajan",
        postCode: "23456",
        long: 0,
        lat: 0,
      },
      isExpressSite: false,
      yearlyIncomes: [],
      ownerName: "Current owner",
      ownerStructureType: "company",
      tenantName: "Current tenant",
      accidentsDeaths: 0,
      accidentsMinorInjuries: 1,
      accidentsSevereInjuries: 2,
      yearlyExpenses: [
        { amount: 54000, bearer: "tenant", purpose: "rent" },
        { amount: 11600, bearer: "tenant", purpose: "security" },
        { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
        { amount: 500, bearer: "owner", purpose: "propertyTaxes" },
      ],
    } as const satisfies Required<
      Omit<
        SiteImpactsDataView,
        "agriculturalOperationActivity" | "isSiteOperated" | "naturalAreaType"
      >
    >;

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
        evaluationPeriodInYears: 10,
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
          nature: "FRICHE",
          fricheActivity: "AGRICULTURE",
          owner: {
            structureType: "company",
            name: "Current owner",
          },
        },
        impacts: {
          socioeconomic: {
            total: 32930654,
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
                amount: 4267,
                impact: "water_regulation",
                impactCategory: "environmental_monetary",
              },
              {
                actor: "human_society",
                amount: 33026864,
                impact: "ecosystem_services",
                impactCategory: "environmental_monetary",
                details: [
                  {
                    amount: 33000000,
                    impact: "soils_co2_eq_storage",
                  },

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
                amount: 223276,
                impact: "avoided_co2_eq_emissions",
                impactCategory: "environmental_monetary",
                details: [{ impact: "avoided_co2_eq_with_enr", amount: 223276 }],
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
              base: 30000,
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
            avoidedCo2eqEmissions: {
              withRenewableEnergyProduction: 117.4,
            },
            soilsCo2eqStorage: {
              base: 1540000,
              forecast: 1760000,
              difference: 220000,
            },
            soilsCarbonStorage: {
              base: 420000,
              forecast: 480000,
              difference: 60000,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: {
                base: 320000,
                forecast: 80000,
                difference: -240000,
              },
              PRAIRIE_TREES: {
                base: 0,
                forecast: 300000,
                difference: 300000,
              },
              BUILDINGS: {
                base: 0,
                forecast: 0,
                difference: 0,
              },
              MINERAL_SOIL: {
                base: 100000,
                forecast: 100000,
                difference: 0,
              },
              IMPERMEABLE_SOILS: {
                base: 0,
                forecast: 0,
                difference: 0,
              },
            },
          },
          social: {
            fullTimeJobs: {
              base: 0,
              forecast: 0.4,
              difference: 0.4,
              conversion: {
                base: 0,
                forecast: 0.3,
                difference: 0.3,
              },
              operations: {
                base: 0,
                forecast: 0.1,
                difference: 0.1,
              },
            },
            accidents: {
              base: 3,
              forecast: 0,
              difference: -3,
              deaths: {
                base: 0,
                forecast: 0,
                difference: 0,
              },
              severeInjuries: {
                base: 2,
                forecast: 0,
                difference: -2,
              },
              minorInjuries: {
                base: 1,
                forecast: 0,
                difference: -1,
              },
            },
            householdsPoweredByRenewableEnergy: {
              base: 0,
              forecast: 957,
              difference: 957,
            },
          },
        },
      });
    });

    it("returns impacts with contract duration as evaluation period when not provided", async () => {
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
      });
      expect(result.id).toEqual(reconversionProjectImpactDataView.id);
      expect(result.evaluationPeriodInYears).toEqual(
        reconversionProjectImpactDataView.developmentPlan.features.contractDuration,
      );
    });

    it("returns impacts when soils carbon storage cannot be computed", async () => {
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
      expect(result.impacts.environmental.soilsCo2eqStorage).toEqual(undefined);
    });
  });

  describe("Success cases: Project on Agricultural operation site", () => {
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
      developmentPlan: {
        developerName: "Mairie de Blajan",
        type: "PHOTOVOLTAIC_POWER_PLANT",
        features: {
          electricalPowerKWc: 258,
          surfaceArea: 20000,
          contractDuration: 30,
          expectedAnnualProduction: 4679,
        },
        installationCosts: [{ amount: 200000, purpose: "installation_works" }],
      },
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
    } as const satisfies ApiReconversionProjectImpactsDataView;

    const site: SiteImpactsDataView = {
      id: reconversionProjectImpactDataView.relatedSiteId,
      contaminatedSoilSurface: 20000,
      name: "My base site",
      nature: "AGRICULTURAL_OPERATION",
      agriculturalOperationActivity: "CATTLE_FARMING",
      isSiteOperated: true,
      surfaceArea: 50000,
      soilsDistribution: {
        ...reconversionProjectImpactDataView.soilsDistribution,
        PRAIRIE_TREES: 0,
        IMPERMEABLE_SOILS: 10000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
      },
      address: {
        cityCode: "23456",
        value: "Blajan",
        banId: "",
        city: "Blajan",
        postCode: "23456",
        long: 0,
        lat: 0,
      },
      ownerName: "Current owner",
      ownerStructureType: "company",
      tenantName: "Current tenant",
      yearlyExpenses: [
        { amount: 54000, bearer: "tenant", purpose: "rent" },
        { amount: 11600, bearer: "tenant", purpose: "otherOperationsCosts" },
        { amount: 500, bearer: "tenant", purpose: "taxes" },
      ],
      yearlyIncomes: [],
      isExpressSite: false,
    } as const;

    it("returns impacts over 10 years for a reconversion project on site still operated", async () => {
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
      expect(result.impacts.social.fullTimeJobs?.operations.base).not.toEqual(0);
      expect(result.impacts.environmental.nonContaminatedSurfaceArea).toEqual(undefined);
      expect(result.impacts.social.accidents).toEqual(undefined);
      expect(result.impacts.socioeconomic.impacts.length).not.toEqual(0);
      expect(
        result.impacts.socioeconomic.impacts.find(
          ({ impact }) => impact === "avoided_friche_costs",
        ),
      ).toEqual(undefined);
    });
    it("returns no base operation fullTimeJobs over 10 years for a reconversion project on site not operated", async () => {
      const evaluationPeriodInYears = 10;
      const projectQuery = new InMemoryReconversionProjectImpactsQuery();
      projectQuery._setData(reconversionProjectImpactDataView);
      const siteQuery = new InMemorySiteImpactsQuery();
      siteQuery._setData({ ...site, isSiteOperated: false });

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
      expect(result.impacts.social.fullTimeJobs?.operations.base).toEqual(0);
    });
  });
});
