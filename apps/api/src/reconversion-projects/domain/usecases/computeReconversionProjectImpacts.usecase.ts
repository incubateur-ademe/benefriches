import { UseCase } from "src/shared-kernel/usecase";
import { SoilsDistribution } from "src/soils/domain/soils";
import {
  AccidentsImpactResult,
  computeAccidentsImpact,
} from "../model/impacts/accidents/accidentsImpact";
import {
  AvoidedCO2WithEnergyProductionImpact,
  computeAvoidedCO2TonsWithEnergyProductionImpact,
} from "../model/impacts/avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import {
  computeContaminatedSurfaceAreaImpact,
  ContaminatedSurfaceAreaImpact,
} from "../model/impacts/contaminated-surface/contaminatedSurfaceAreaImpact";
import {
  computeEconomicBalanceImpact,
  EconomicBalanceImpactResult,
} from "../model/impacts/economicBalance/economicBalanceImpact";
import {
  computeFullTimeJobsImpact,
  FullTimeJobsImpactResult,
} from "../model/impacts/full-time-jobs/fullTimeJobsImpact";
import {
  computeHouseholdsPoweredByRenewableEnergyImpact,
  HouseholdsPoweredByRenewableEnergyImpact,
} from "../model/impacts/households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";
import {
  computePermeableSurfaceAreaImpact,
  PermeableSurfaceAreaImpactResult,
} from "../model/impacts/permeable-surface/permeableSurfaceAreaImpact";
import {
  computeSocioEconomicImpacts,
  SocioEconomicImpactsResult,
} from "../model/impacts/socio-economic/computeSocioEconomicImpacts";
import {
  computeSoilsCarbonStorageImpact,
  GetSoilsCarbonStoragePerSoilsService,
  SoilsCarbonStorageImpactResult,
} from "../model/impacts/soils-carbon-storage/soilsCarbonStorageImpact";
import { getDurationFromScheduleInYears, Schedule } from "../model/reconversionProject";

export type SiteImpactsDataView = {
  id: string;
  name: string;
  addressCityCode: string;
  contaminatedSoilSurface?: number;
  ownerName: string;
  tenantName?: string;
  soilsDistribution: SoilsDistribution;
  fullTimeJobs?: number;
  hasAccidents: boolean;
  accidentsDeaths?: number;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  yearlyCosts: { bearer: string; amount: number; purpose: string }[];
};

export interface SiteImpactsRepository {
  getById(siteId: string): Promise<SiteImpactsDataView | undefined>;
}

export type ReconversionProjectImpactsDataView = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: SoilsDistribution;
  conversionFullTimeJobs?: number;
  reinstatementFullTimeJobs?: number;
  operationsFullTimeJobs?: number;
  conversionSchedule?: Schedule;
  reinstatementSchedule?: Schedule;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  realEstateTransactionTotalCost?: number;
  realEstateTransactionPropertyTransferDutiesAmount?: number;
  reinstatementCost?: number;
  developmentPlanInstallationCost?: number;
  reinstatementFinancialAssistanceAmount?: number;
  yearlyProjectedCosts: { amount: number; purpose: string }[];
  yearlyProjectedRevenues: { amount: number; source: string }[];
  developmentPlanExpectedAnnualEnergyProductionMWh?: number;
};

export interface ReconversionProjectImpactsRepository {
  getById(reconversionProjectId: string): Promise<ReconversionProjectImpactsDataView | undefined>;
}

type Request = {
  reconversionProjectId: string;
  evaluationPeriodInYears: number;
};

export type Result = {
  id: string;
  name: string;
  relatedSiteId: string;
  relatedSiteName: string;
  impacts: {
    contaminatedSurfaceArea: ContaminatedSurfaceAreaImpact | undefined;
    permeableSurfaceArea: PermeableSurfaceAreaImpactResult;
    fullTimeJobs: FullTimeJobsImpactResult;
    accidents: AccidentsImpactResult | undefined;
    economicBalance: EconomicBalanceImpactResult;
    householdsPoweredByRenewableEnergy: HouseholdsPoweredByRenewableEnergyImpact | undefined;
    avoidedCO2TonsWithEnergyProduction: AvoidedCO2WithEnergyProductionImpact | undefined;
    soilsCarbonStorage: SoilsCarbonStorageImpactResult;
    socioeconomic: SocioEconomicImpactsResult;
  };
};

class ReconversionProjectNotFound extends Error {
  constructor(reconversionProjectId: string) {
    super(
      `ComputeReconversionProjectImpacts: ReconversionProject with id ${reconversionProjectId} not found`,
    );
    this.name = "ReconversionProjectNotFound";
  }
}

class SiteNotFound extends Error {
  constructor(siteId: string) {
    super(`ComputeReconversionProjectImpacts: Site with id ${siteId} not found`);
    this.name = "SiteNotFound";
  }
}

export class ComputeReconversionProjectImpactsUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly reconversionProjectRepository: ReconversionProjectImpactsRepository,
    private readonly siteRepository: SiteImpactsRepository,
    private readonly getSoilsCarbonStoragePerSoilsService: GetSoilsCarbonStoragePerSoilsService,
  ) {}

  async execute({ reconversionProjectId, evaluationPeriodInYears }: Request): Promise<Result> {
    const reconversionProject =
      await this.reconversionProjectRepository.getById(reconversionProjectId);

    if (!reconversionProject) throw new ReconversionProjectNotFound(reconversionProjectId);

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) throw new SiteNotFound(reconversionProject.relatedSiteId);

    return {
      id: reconversionProjectId,
      name: reconversionProject.name,
      relatedSiteId: reconversionProject.relatedSiteId,
      relatedSiteName: relatedSite.name,
      impacts: {
        economicBalance: computeEconomicBalanceImpact(
          {
            futureOperatorName: reconversionProject.futureOperatorName,
            futureSiteOwnerName: reconversionProject.futureSiteOwnerName,
            reinstatementContractOwnerName: reconversionProject.reinstatementContractOwnerName,
            reinstatementCost: reconversionProject.reinstatementCost,
            yearlyProjectedCosts: reconversionProject.yearlyProjectedCosts,
            yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues,
            realEstateTransactionTotalCost: reconversionProject.realEstateTransactionTotalCost,
            reinstatementFinancialAssistanceAmount:
              reconversionProject.reinstatementFinancialAssistanceAmount,
            developmentPlanInstallationCost: reconversionProject.developmentPlanInstallationCost,
          },
          evaluationPeriodInYears,
        ),
        socioeconomic: computeSocioEconomicImpacts({
          currentOwner: relatedSite.ownerName,
          currentTenant: relatedSite.tenantName,
          yearlyCurrentCosts: relatedSite.yearlyCosts,
          yearlyProjectedCosts: reconversionProject.yearlyProjectedCosts,
          futureSiteOwner: reconversionProject.futureSiteOwnerName,
          propertyTransferDutiesAmount:
            reconversionProject.realEstateTransactionPropertyTransferDutiesAmount,
          evaluationPeriodInYears,
        }),
        permeableSurfaceArea: computePermeableSurfaceAreaImpact({
          baseSoilsDistribution: relatedSite.soilsDistribution,
          forecastSoilsDistribution: reconversionProject.soilsDistribution,
        }),
        contaminatedSurfaceArea: relatedSite.contaminatedSoilSurface
          ? computeContaminatedSurfaceAreaImpact({
              currentContaminatedSurfaceArea: relatedSite.contaminatedSoilSurface,
            })
          : undefined,
        fullTimeJobs: computeFullTimeJobsImpact({
          current: { operationsFullTimeJobs: relatedSite.fullTimeJobs },
          forecast: {
            operationsFullTimeJobs: reconversionProject.operationsFullTimeJobs,
            conversionFullTimeJobs: reconversionProject.conversionFullTimeJobs,
            conversionDurationInYears:
              reconversionProject.conversionSchedule &&
              getDurationFromScheduleInYears(reconversionProject.conversionSchedule),
            reinstatementFullTimeJobs: reconversionProject.reinstatementFullTimeJobs,
            reinstatementDurationInYears:
              reconversionProject.reinstatementSchedule &&
              getDurationFromScheduleInYears(reconversionProject.reinstatementSchedule),
          },
          evaluationPeriodInYears,
        }),
        accidents: relatedSite.hasAccidents
          ? computeAccidentsImpact({
              severeInjuries: relatedSite.accidentsSevereInjuries,
              minorInjuries: relatedSite.accidentsMinorInjuries,
              deaths: relatedSite.accidentsDeaths,
            })
          : undefined,

        householdsPoweredByRenewableEnergy:
          reconversionProject.developmentPlanExpectedAnnualEnergyProductionMWh
            ? computeHouseholdsPoweredByRenewableEnergyImpact({
                forecastRenewableEnergyAnnualProductionMWh:
                  reconversionProject.developmentPlanExpectedAnnualEnergyProductionMWh,
              })
            : undefined,
        avoidedCO2TonsWithEnergyProduction:
          reconversionProject.developmentPlanExpectedAnnualEnergyProductionMWh
            ? computeAvoidedCO2TonsWithEnergyProductionImpact({
                forecastAnnualEnergyProductionMWh:
                  reconversionProject.developmentPlanExpectedAnnualEnergyProductionMWh,
              })
            : undefined,
        soilsCarbonStorage: await computeSoilsCarbonStorageImpact({
          currentSoilsDistribution: relatedSite.soilsDistribution,
          forecastSoilsDistribution: reconversionProject.soilsDistribution,
          siteCityCode: relatedSite.addressCityCode,
          getSoilsCarbonStorageService: this.getSoilsCarbonStoragePerSoilsService,
        }),
      },
    };
  }
}
