import { v4 as uuid } from "uuid";
import { InMemoryReconversionProjectImpactsRepository } from "src/reconversion-projects/adapters/secondary/reconversion-project-impacts-repository/InMemoryReconversionProjectImpactsRepository";
import { InMemorySiteImpactsRepository } from "src/reconversion-projects/adapters/secondary/site-impacts-repository/InMemorySiteImpactsRepository";
import {
  ComputeReconversionProjectImpactsUseCase,
  ReconversionProjectImpactsDataView,
  Result,
  SiteImpactsDataView,
} from "./computeReconversionProjectImpacts.usecase";

describe("ComputeReconversionProjectImpactsUseCase", () => {
  describe("Error cases", () => {
    it("throws error when reconversion project does not exist", async () => {
      const projectRepository = new InMemoryReconversionProjectImpactsRepository();
      const siteRepository = new InMemorySiteImpactsRepository();
      const usecase = new ComputeReconversionProjectImpactsUseCase(
        projectRepository,
        siteRepository,
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
        realEstateTransactionCost: 0,
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
      );

      const evaluationPeriodInYears = 10;
      await expect(
        usecase.execute({ reconversionProjectId, evaluationPeriodInYears }),
      ).rejects.toThrow(`Site with id ${siteId} not found`);
    });
  });

  describe("Success cases", () => {
    const reconversionProjectImpactDataView: ReconversionProjectImpactsDataView = {
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
      realEstateTransactionCost: 150000,
      reinstatementCost: 500000,
      developmentPlanInstallationCost: 200000,
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
    } as const;
    const site: SiteImpactsDataView = {
      id: reconversionProjectImpactDataView.relatedSiteId,
      contaminatedSoilSurface: 20000,
      name: "My base site",
      soilsDistribution: {
        ...reconversionProjectImpactDataView.soilsDistribution,
        PRAIRIE_TREES: 0,
        IMPERMEABLE_SOILS: 10000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 40000,
      },
      fullTimeJobs: 1,
      hasAccidents: true,
      accidentsDeaths: 0,
      accidentsMinorInjuries: 1,
      accidentsSevereInjuries: 2,
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
        impacts: {
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
          contaminatedSurfaceArea: {
            base: 20000,
            forecast: 0,
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
        },
      });
    });
  });
});
