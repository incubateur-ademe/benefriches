import { Schedule, SoilsDistribution } from "shared";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { sumListWithKey } from "src/shared-kernel/sum-list/sumList";
import { UseCase } from "src/shared-kernel/usecase";

import {
  AccidentsImpactResult,
  computeAccidentsImpact,
} from "../model/impacts/accidents/accidentsImpact";
import { AvoidedCO2WithEnergyProductionImpact } from "../model/impacts/avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import {
  getDevelopmentPlanRelatedImpacts,
  SocioEconomicSpecificImpact,
} from "../model/impacts/development-plans-related/developmentPlanFeaturesImpacts";
import {
  computeEconomicBalanceImpact,
  EconomicBalanceImpactResult,
} from "../model/impacts/economic-balance/economicBalanceImpact";
import {
  computeFullTimeJobsImpact,
  FullTimeJobsImpactResult,
} from "../model/impacts/full-time-jobs/fullTimeJobsImpact";
import { HouseholdsPoweredByRenewableEnergyImpact } from "../model/impacts/households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";
import {
  computeNonContaminatedSurfaceAreaImpact,
  NonContaminatedSurfaceAreaImpact,
} from "../model/impacts/non-contaminated-surface/nonContaminatedSurfaceAreaImpact";
import {
  computePermeableSurfaceAreaImpact,
  PermeableSurfaceAreaImpactResult,
} from "../model/impacts/permeable-surface/permeableSurfaceAreaImpact";
import {
  computeDirectAndIndirectEconomicImpacts,
  DirectAndIndirectEconomicImpact,
} from "../model/impacts/socio-economic/computeDirectAndIndirectEconomicImpacts";
import {
  computeEnvironmentalMonetaryImpacts,
  EnvironmentalMonetaryImpact,
} from "../model/impacts/socio-economic/computeEnvironmentalMonetaryImpacts";
import {
  computeSoilsCarbonStorageImpact,
  GetSoilsCarbonStoragePerSoilsService,
  SoilsCarbonStorageImpactResult,
} from "../model/impacts/soils-carbon-storage/soilsCarbonStorageImpact";
import { DevelopmentPlan, getDurationFromScheduleInYears } from "../model/reconversionProject";

export type SiteImpactsDataView = {
  id: string;
  name: string;
  isFriche: boolean;
  fricheActivity?: string;
  addressCityCode: string;
  addressLabel: string;
  contaminatedSoilSurface?: number;
  ownerStructureType: string;
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

export interface SiteImpactsQuery {
  getById(siteId: string): Promise<SiteImpactsDataView | undefined>;
}

export type ReconversionProjectImpactsDataView = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: SoilsDistribution;
  isExpressProject: boolean;
  conversionFullTimeJobs?: number;
  reinstatementFullTimeJobs?: number;
  operationsFullTimeJobs?: number;
  conversionSchedule?: Schedule;
  reinstatementSchedule?: Schedule;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  sitePurchaseTotalAmount?: number;
  sitePurchasePropertyTransferDutiesAmount?: number;
  reinstatementCosts: { amount: number; purpose: string }[];
  developmentPlanInstallationCosts: { amount: number; purpose: string }[];
  financialAssistanceRevenues: { amount: number; source: string }[];
  yearlyProjectedCosts: { amount: number; purpose: string }[];
  yearlyProjectedRevenues: { amount: number; source: string }[];
  developmentPlanType?: DevelopmentPlan["type"];
  developmentPlanDeveloperName?: string;
  developmentPlanFeatures?: DevelopmentPlan["features"];
  operationsFirstYear?: number;
  siteResaleTotalAmount?: number;
  decontaminatedSoilSurface?: number;
};

export interface ReconversionProjectImpactsQuery {
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
    contaminatedSoilSurface: number;
    isExpressProject: boolean;
    developmentPlan: {
      type?: DevelopmentPlan["type"];
    } & Partial<DevelopmentPlan["features"]>;
  };
  siteData: {
    addressLabel: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
    surfaceArea: number;
    isFriche: boolean;
    fricheActivity?: string;
    owner: {
      structureType: string;
      name: string;
    };
  };
  impacts: {
    nonContaminatedSurfaceArea: NonContaminatedSurfaceAreaImpact | undefined;
    permeableSurfaceArea: PermeableSurfaceAreaImpactResult;
    fullTimeJobs: FullTimeJobsImpactResult;
    accidents: AccidentsImpactResult | undefined;
    economicBalance: EconomicBalanceImpactResult;
    householdsPoweredByRenewableEnergy?: HouseholdsPoweredByRenewableEnergyImpact | undefined;
    avoidedCO2TonsWithEnergyProduction?: AvoidedCO2WithEnergyProductionImpact | undefined;
    soilsCarbonStorage: SoilsCarbonStorageImpactResult;
    socioeconomic: {
      impacts: (
        | DirectAndIndirectEconomicImpact
        | EnvironmentalMonetaryImpact
        | SocioEconomicSpecificImpact
      )[];
      total: number;
    };
    avoidedVehiculeKilometers?: number;
    travelTimeSaved?: number;
    avoidedTrafficAccidents?: {
      total: number;
      minorInjuries: number;
      severeInjuries: number;
      deaths: number;
    };
    avoidedCarTrafficCo2EqEmissions?: number;
    avoidedAirConditioningCo2EqEmissions?: number;
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
    private readonly reconversionProjectQuery: ReconversionProjectImpactsQuery,
    private readonly siteRepository: SiteImpactsQuery,
    private readonly getSoilsCarbonStoragePerSoilsService: GetSoilsCarbonStoragePerSoilsService,
    private readonly dateProvider: DateProvider,
    private readonly getCityRelatedDataService: GetCityRelatedDataService,
  ) {}

  async execute({ reconversionProjectId, evaluationPeriodInYears }: Request): Promise<Result> {
    const reconversionProject = await this.reconversionProjectQuery.getById(reconversionProjectId);

    if (!reconversionProject) throw new ReconversionProjectNotFound(reconversionProjectId);

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) throw new SiteNotFound(reconversionProject.relatedSiteId);

    const operationsFirstYear =
      reconversionProject.operationsFirstYear ?? this.dateProvider.now().getFullYear();

    const soilsCarbonStorage = await computeSoilsCarbonStorageImpact({
      currentSoilsDistribution: relatedSite.soilsDistribution,
      forecastSoilsDistribution: reconversionProject.soilsDistribution,
      siteCityCode: relatedSite.addressCityCode,
      getSoilsCarbonStorageService: this.getSoilsCarbonStoragePerSoilsService,
    });

    const {
      socioeconomic: developmentPlanRelatedSocioEconomicImpacts = [],
      ...developmentPlanRelatedImpacts
    } = await getDevelopmentPlanRelatedImpacts({
      developmentPlanType: reconversionProject.developmentPlanType,
      developmentPlanFeatures: reconversionProject.developmentPlanFeatures,
      evaluationPeriodInYears,
      operationsFirstYear,
      siteSurfaceArea: relatedSite.surfaceArea,
      siteCityCode: relatedSite.addressCityCode,
      siteIsFriche: relatedSite.isFriche,
      getCityRelatedDataService: this.getCityRelatedDataService,
    });

    const socioeconomic = [
      ...computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: evaluationPeriodInYears,
        currentOwner: relatedSite.ownerName,
        currentTenant: relatedSite.tenantName,
        futureSiteOwner: reconversionProject.futureSiteOwnerName,
        yearlyCurrentCosts: relatedSite.yearlyCosts,
        yearlyProjectedCosts: reconversionProject.yearlyProjectedCosts,
        propertyTransferDutiesAmount: reconversionProject.sitePurchasePropertyTransferDutiesAmount,
        isFriche: relatedSite.isFriche,
      }),
      ...computeEnvironmentalMonetaryImpacts({
        baseSoilsDistribution: relatedSite.soilsDistribution,
        forecastSoilsDistribution: reconversionProject.soilsDistribution,
        evaluationPeriodInYears,
        baseSoilsCarbonStorage: soilsCarbonStorage.current.total,
        forecastSoilsCarbonStorage: soilsCarbonStorage.forecast.total,
        operationsFirstYear: operationsFirstYear,
        decontaminatedSurface: reconversionProject.decontaminatedSoilSurface,
      }),
      ...developmentPlanRelatedSocioEconomicImpacts,
    ];

    const { developmentPlanFeatures, developmentPlanType } = reconversionProject;

    return {
      id: reconversionProjectId,
      name: reconversionProject.name,
      relatedSiteId: reconversionProject.relatedSiteId,
      relatedSiteName: relatedSite.name,
      projectData: {
        soilsDistribution: reconversionProject.soilsDistribution,
        contaminatedSoilSurface:
          (relatedSite.contaminatedSoilSurface ?? 0) -
          (reconversionProject.decontaminatedSoilSurface ?? 0),
        isExpressProject: reconversionProject.isExpressProject,
        developmentPlan: {
          ...developmentPlanFeatures,
          type: developmentPlanType,
        },
      },
      siteData: {
        addressLabel: relatedSite.addressLabel,
        contaminatedSoilSurface: relatedSite.contaminatedSoilSurface ?? 0,
        soilsDistribution: relatedSite.soilsDistribution,
        surfaceArea: relatedSite.surfaceArea,
        isFriche: relatedSite.isFriche,
        fricheActivity: relatedSite.fricheActivity,
        owner: {
          name: relatedSite.ownerName,
          structureType: relatedSite.ownerStructureType,
        },
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
            sitePurchaseTotalAmount: reconversionProject.sitePurchaseTotalAmount,
            financialAssistanceRevenues: reconversionProject.financialAssistanceRevenues,
            developmentPlanInstallationCosts: reconversionProject.developmentPlanInstallationCosts,
            siteResaleTotalAmount: reconversionProject.siteResaleTotalAmount,
          },
          evaluationPeriodInYears,
        ),
        socioeconomic: {
          impacts: socioeconomic,
          total: sumListWithKey(socioeconomic, "amount"),
        },
        permeableSurfaceArea: computePermeableSurfaceAreaImpact({
          baseSoilsDistribution: relatedSite.soilsDistribution,
          forecastSoilsDistribution: reconversionProject.soilsDistribution,
        }),
        nonContaminatedSurfaceArea: relatedSite.contaminatedSoilSurface
          ? computeNonContaminatedSurfaceAreaImpact({
              currentContaminatedSurfaceArea: relatedSite.contaminatedSoilSurface,
              forecastDecontaminedSurfaceArea: reconversionProject.decontaminatedSoilSurface ?? 0,
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
        soilsCarbonStorage,
        ...developmentPlanRelatedImpacts,
      },
    };
  }
}
