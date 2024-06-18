import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
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
  computeEconomicBalanceImpact,
  EconomicBalanceImpactResult,
} from "../model/impacts/economic-balance/economicBalanceImpact";
import {
  computeFullTimeJobsImpact,
  FullTimeJobsImpactResult,
} from "../model/impacts/full-time-jobs/fullTimeJobsImpact";
import {
  computeHouseholdsPoweredByRenewableEnergyImpact,
  HouseholdsPoweredByRenewableEnergyImpact,
} from "../model/impacts/households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";
import {
  computeNonContaminatedSurfaceAreaImpact,
  NonContaminatedSurfaceAreaImpact,
} from "../model/impacts/non-contaminated-surface/nonContaminatedSurfaceAreaImpact";
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
import {
  DevelopmentPlan,
  getDurationFromScheduleInYears,
  Schedule,
} from "../model/reconversionProject";

export type SiteImpactsDataView = {
  id: string;
  name: string;
  addressCityCode: string;
  addressLabel: string;
  contaminatedSoilSurface?: number;
  ownerName: string;
  tenantName?: string;
  surfaceArea: number;
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
  reinstatementCosts: { amount: number; purpose: string }[];
  developmentPlanInstallationCosts: { amount: number; purpose: string }[];
  financialAssistanceRevenues: { amount: number; source: string }[];
  yearlyProjectedCosts: { amount: number; purpose: string }[];
  yearlyProjectedRevenues: { amount: number; source: string }[];
  developmentPlanType?: DevelopmentPlan["type"];
  developmentPlanExpectedAnnualEnergyProductionMWh?: number;
  developmentPlanSurfaceArea?: number;
  developmentPlanElectricalPowerKWc?: number;
  developmentPlanDeveloperName?: string;
  operationsFirstYear?: number;
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
  projectData: {
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: 0;
    developmentPlan: {
      surfaceArea?: number;
      electricalPowerKWc?: number;
      type?: DevelopmentPlan["type"];
    };
  };
  siteData: {
    addressLabel: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
  };
  impacts: {
    nonContaminatedSurfaceArea: NonContaminatedSurfaceAreaImpact | undefined;
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
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ reconversionProjectId, evaluationPeriodInYears }: Request): Promise<Result> {
    const reconversionProject =
      await this.reconversionProjectRepository.getById(reconversionProjectId);

    if (!reconversionProject) throw new ReconversionProjectNotFound(reconversionProjectId);

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) throw new SiteNotFound(reconversionProject.relatedSiteId);

    const soilsCarbonStorage = await computeSoilsCarbonStorageImpact({
      currentSoilsDistribution: relatedSite.soilsDistribution,
      forecastSoilsDistribution: reconversionProject.soilsDistribution,
      siteCityCode: relatedSite.addressCityCode,
      getSoilsCarbonStorageService: this.getSoilsCarbonStoragePerSoilsService,
    });

    const avoidedCO2TonsWithEnergyProduction =
      reconversionProject.developmentPlanExpectedAnnualEnergyProductionMWh
        ? computeAvoidedCO2TonsWithEnergyProductionImpact({
            forecastAnnualEnergyProductionMWh:
              reconversionProject.developmentPlanExpectedAnnualEnergyProductionMWh,
          })
        : undefined;

    return {
      id: reconversionProjectId,
      name: reconversionProject.name,
      relatedSiteId: reconversionProject.relatedSiteId,
      relatedSiteName: relatedSite.name,
      projectData: {
        soilsDistribution: reconversionProject.soilsDistribution,
        contaminatedSoilSurface: 0,
        developmentPlan: {
          surfaceArea: reconversionProject.developmentPlanSurfaceArea,
          electricalPowerKWc: reconversionProject.developmentPlanElectricalPowerKWc,
          type: reconversionProject.developmentPlanType,
        },
      },
      siteData: {
        addressLabel: relatedSite.addressLabel,
        contaminatedSoilSurface: relatedSite.contaminatedSoilSurface ?? 0,
        soilsDistribution: relatedSite.soilsDistribution,
      },
      impacts: {
        economicBalance: computeEconomicBalanceImpact(
          {
            developmentPlanDeveloperName: reconversionProject.developmentPlanDeveloperName,
            futureOperatorName: reconversionProject.futureOperatorName,
            futureSiteOwnerName: reconversionProject.futureSiteOwnerName,
            reinstatementContractOwnerName: reconversionProject.reinstatementContractOwnerName,
            reinstatementCosts: reconversionProject.reinstatementCosts,
            yearlyProjectedCosts: reconversionProject.yearlyProjectedCosts,
            yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues,
            realEstateTransactionTotalCost: reconversionProject.realEstateTransactionTotalCost,
            financialAssistanceRevenues: reconversionProject.financialAssistanceRevenues,
            developmentPlanInstallationCosts: reconversionProject.developmentPlanInstallationCosts,
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
          baseSoilsDistribution: relatedSite.soilsDistribution,
          forecastSoilsDistribution: reconversionProject.soilsDistribution,
          baseSoilsCarbonStorage: soilsCarbonStorage.current.total,
          forecastSoilsCarbonStorage: soilsCarbonStorage.forecast.total,
          operationsFirstYear:
            reconversionProject.operationsFirstYear ?? this.dateProvider.now().getFullYear(),
          avoidedCO2TonsWithEnergyProduction: avoidedCO2TonsWithEnergyProduction?.forecast,
          decontaminatedSurface: relatedSite.contaminatedSoilSurface,
        }),
        permeableSurfaceArea: computePermeableSurfaceAreaImpact({
          baseSoilsDistribution: relatedSite.soilsDistribution,
          forecastSoilsDistribution: reconversionProject.soilsDistribution,
        }),
        nonContaminatedSurfaceArea: relatedSite.contaminatedSoilSurface
          ? computeNonContaminatedSurfaceAreaImpact({
              currentContaminatedSurfaceArea: relatedSite.contaminatedSoilSurface,
              totalSurfaceArea: relatedSite.surfaceArea,
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
        avoidedCO2TonsWithEnergyProduction,
        soilsCarbonStorage,
      },
    };
  }
}
