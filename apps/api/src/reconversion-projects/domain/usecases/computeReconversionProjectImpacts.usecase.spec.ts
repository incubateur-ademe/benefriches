import { v4 as uuid } from "uuid";
import { InMemoryReconversionProjectImpactsRepository } from "src/reconversion-projects/adapters/secondary/reconversion-project-impacts-repository/InMemoryReconversionProjectImpactsRepository";
import { InMemorySiteImpactsRepository } from "src/reconversion-projects/adapters/secondary/site-impacts-repository/InMemorySiteImpactsRepository";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
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
      const projectRepository = new InMemoryReconversionProjectImpactsRepository();
      const siteRepository = new InMemorySiteImpactsRepository();

      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectRepository,
        siteRepository,
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );

      const reconversionProjectId = uuid();
      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({ reconversionProjectId, evaluationPeriodInYears }),
      ).rejects.toThrow(`ReconversionProject with id ${reconversionProjectId} not found`);
    });

    it("throws error when reconversion project related site does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const projectRepository = new InMemoryReconversionProjectImpactsRepository();
      projectRepository._setData({
        id: reconversionProjectId,
        name: "Test reconversion project",
        relatedSiteId: siteId,
        soilsDistribution: {},
        realEstateTransactionTotalCost: 0,
        reinstatementCost: 0,
        developmentPlanInstallationCost: 0,
        reinstatementFinancialAssistanceAmount: 0,
        yearlyProjectedCosts: [],
        yearlyProjectedRevenues: [],
      });
      const siteRepository = new InMemorySiteImpactsRepository();
      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectRepository,
        siteRepository,
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
      );

      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({ reconversionProjectId, evaluationPeriodInYears }),
      ).rejects.toThrow(`Site with id ${siteId} not found`);
    });
  });

  describe("Success cases", () => {
    const reconversionProjectImpactDataView: Required<ReconversionProjectImpactsDataView> = {
      id: uuid(),
      name: "Project with big impacts",
      relatedSiteId: uuid(),
      soilsDistribution: {
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
        PRAIRIE_TREES: 20000,
        BUILDINGS: 20000,
        MINERAL_SOIL: 20000,
        IMPERMEABLE_SOILS: 30000,
      },
      operationsFullTimeJobs: 0.5,
      conversionFullTimeJobs: 20,
      conversionSchedule: {
        startDate: new Date("2025-07-01"),
        endDate: new Date("2026-07-01"),
      },
      reinstatementFullTimeJobs: 10,
      reinstatementSchedule: {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2026-01-01"),
      },
      futureOperatorName: "Mairie de Blajan",
      futureSiteOwnerName: "Mairie de Blajan",
      reinstatementContractOwnerName: "Mairie de Blajan",
      realEstateTransactionTotalCost: 150000,
      reinstatementCost: 500000,
      developmentPlanInstallationCost: 200000,
      developmentPlanElectricalPowerKWc: 258,
      developmentPlanSurfaceArea: 20000,
      developmentPlanDeveloperName: "Mairie de Blajan",
      reinstatementFinancialAssistanceAmount: 150000,
      yearlyProjectedCosts: [
        { amount: 1000, purpose: "taxes" },
        { amount: 10000, purpose: "maintenance" },
      ],
      yearlyProjectedRevenues: [
        { amount: 10000, source: "rent" },
        { amount: 20000, source: "sell" },
        { amount: 1000, source: "other" },
      ],
      developmentPlanExpectedAnnualEnergyProductionMWh: 4679,
      realEstateTransactionPropertyTransferDutiesAmount: 5432,
      operationsFirstYear: 2025,
    } as const;
    const site: Required<SiteImpactsDataView> = {
      id: reconversionProjectImpactDataView.relatedSiteId,
      contaminatedSoilSurface: 20000,
      name: "My base site",
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
      tenantName: "Current tenant",
      fullTimeJobs: 1,
      hasAccidents: true,
      accidentsDeaths: 0,
      accidentsMinorInjuries: 1,
      accidentsSevereInjuries: 2,
      yearlyCosts: [
        { amount: 54000, bearer: "tenant", purpose: "rent" },
        { amount: 11600, bearer: "tenant", purpose: "security" },
        { amount: 1500, bearer: "tenant", purpose: "illegalDumpingCost" },
        { amount: 500, bearer: "owner", purpose: "taxes" },
      ],
    } as const;

    it("returns impacts over 10 years for a reconversion project dedicated to renewable energy production on friche with contaminated soil", async () => {
      const evaluationPeriodInYears = 10;
      const projectRepository = new InMemoryReconversionProjectImpactsRepository();
      projectRepository._setData(reconversionProjectImpactDataView);
      const siteRepository = new InMemorySiteImpactsRepository();
      siteRepository._setData(site);

      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectRepository,
        siteRepository,
        new FakeGetSoilsCarbonStorageService(),
        dateProvider,
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
          contaminatedSoilSurface: 0,
          developmentPlan: {
            electricalPowerKWc: 258,
            surfaceArea: 20000,
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
        },
        impacts: {
          socioeconomic: {
            total: -195584,
            impacts: [
              {
                actor: "Current owner",
                amount: -540000,
                impact: "rental_income",
                impactCategory: "economic_direct",
              },
              {
                actor: "Current tenant",
                amount: 131000,
                impact: "avoided_friche_costs",
                impactCategory: "economic_direct",
              },
              {
                actor: "community",
                amount: 5000,
                impact: "taxes_income",
                impactCategory: "economic_indirect",
              },
              {
                actor: "community",
                amount: 5432,
                impact: "property_transfer_duties_income",
                impactCategory: "economic_indirect",
              },
              {
                actor: "human_society",
                amount: 168444,
                impact: "avoided_co2_eq_with_enr",
                impactCategory: "environmental_monetary",
              },
              {
                actor: "community",
                amount: 4720,
                impact: "water_regulation",
                impactCategory: "environmental_monetary",
              },
              {
                actor: "human_society",
                amount: 29820,
                impact: "ecosystem_services",
                impactCategory: "environmental_monetary",
                details: [
                  {
                    amount: 1420,
                    impact: "nature_related_wellness_and_leisure",
                  },
                  {
                    amount: 1840,
                    impact: "pollination",
                  },
                  {
                    amount: 680,
                    impact: "invasive_species_regulation",
                  },
                  {
                    amount: 19500,
                    impact: "water_cycle",
                  },
                  {
                    amount: 1380,
                    impact: "nitrogen_cycle",
                  },
                  {
                    amount: 5000,
                    impact: "soil_erosion",
                  },
                ],
              },
            ],
          },
          economicBalance: {
            total: -500000,
            bearer: "Mairie de Blajan",
            costs: {
              total: -960000,
              operationsCosts: {
                total: -110000,
                expenses: [
                  { amount: -10000, purpose: "taxes" },
                  { amount: -100000, purpose: "maintenance" },
                ],
              },
              siteReinstatement: -500000,
              developmentPlanInstallation: -200000,
              realEstateTransaction: -150000,
            },
            revenues: {
              total: 460000,
              operationsRevenues: {
                total: 310000,
                revenues: [
                  { amount: 100000, source: "rent" },
                  { amount: 200000, source: "sell" },
                  { amount: 10000, source: "other" },
                ],
              },
              financialAssistance: 150000,
            },
          },
          nonContaminatedSurfaceArea: {
            current: 30000,
            forecast: 50000,
          },
          permeableSurfaceArea: {
            base: 60000,
            forecast: 50000,
            greenSoil: {
              base: 40000,
              forecast: 30000,
            },
            mineralSoil: {
              base: 20000,
              forecast: 20000,
            },
          },
          fullTimeJobs: {
            current: 1,
            forecast: 3.5,
            conversion: {
              current: 0,
              forecast: 3,
            },
            operations: {
              current: 1,
              forecast: 0.5,
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
          avoidedCO2TonsWithEnergyProduction: {
            current: 0,
            forecast: 112.29599999999999,
          },
          soilsCarbonStorage: {
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
      });
    });
  });
});
