import {
  DevelopmentPlanInstallationCost,
  FinancialAssistanceRevenue,
  ReconversionProjectImpacts,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
  sumListWithKey,
} from "shared";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { computeAccidentsImpact } from "../model/impacts/accidents/accidentsImpact";
import { getDevelopmentPlanRelatedImpacts } from "../model/impacts/developmentPlanFeaturesImpacts";
import { computeDirectAndIndirectEconomicImpacts } from "../model/impacts/direct-and-indirect-economic/computeDirectAndIndirectEconomicImpacts";
import { computeEconomicBalanceImpact } from "../model/impacts/economic-balance/economicBalanceImpact";
import { computeEnvironmentalMonetaryImpacts } from "../model/impacts/environmental-monetary/computeEnvironmentalMonetaryImpacts";
import { FullTimeJobsImpactService } from "../model/impacts/full-time-jobs/fullTimeJobsImpactService";
import { computeNonContaminatedSurfaceAreaImpact } from "../model/impacts/non-contaminated-surface/nonContaminatedSurfaceAreaImpact";
import { computePermeableSurfaceAreaImpact } from "../model/impacts/permeable-surface/permeableSurfaceAreaImpact";
import {
  computeSoilsCarbonStorageImpact,
  GetSoilsCarbonStoragePerSoilsService,
} from "../model/impacts/soils-carbon-storage/soilsCarbonStorageImpact";
import { DevelopmentPlan, Schedule } from "../model/reconversionProject";

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
  impacts: ReconversionProjectImpacts;
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

    const soilsCarbonStorageImpactResult = await computeSoilsCarbonStorageImpact({
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
        baseSoilsCarbonStorage: soilsCarbonStorageImpactResult.isSuccess
          ? soilsCarbonStorageImpactResult.current.total
          : null,
        forecastSoilsCarbonStorage: soilsCarbonStorageImpactResult.isSuccess
          ? soilsCarbonStorageImpactResult.forecast.total
          : null,
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
            reinstatementCosts: reconversionProject.reinstatementCosts as ReinstatementExpense[],
            yearlyProjectedCosts: reconversionProject.yearlyProjectedCosts as RecurringExpense[],
            yearlyProjectedRevenues:
              reconversionProject.yearlyProjectedRevenues as RecurringRevenue[],
            sitePurchaseTotalAmount: reconversionProject.sitePurchaseTotalAmount,
            financialAssistanceRevenues:
              reconversionProject.financialAssistanceRevenues as FinancialAssistanceRevenue[],
            developmentPlanInstallationCosts:
              reconversionProject.developmentPlanInstallationCosts as DevelopmentPlanInstallationCost[],
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
        fullTimeJobs: new FullTimeJobsImpactService({
          developmentPlan: {
            type: reconversionProject.developmentPlanType,
            features: reconversionProject.developmentPlanFeatures,
          } as DevelopmentPlan,
          conversionSchedule: reconversionProject.conversionSchedule,
          reinstatementSchedule: reconversionProject.reinstatementSchedule,
          reinstatementExpenses: reconversionProject.reinstatementCosts as ReinstatementExpense[],
          evaluationPeriodInYears: evaluationPeriodInYears,
        }).getFullTimeJobsImpacts(),
        accidents: relatedSite.hasAccidents
          ? computeAccidentsImpact({
              severeInjuries: relatedSite.accidentsSevereInjuries,
              minorInjuries: relatedSite.accidentsMinorInjuries,
              deaths: relatedSite.accidentsDeaths,
            })
          : undefined,
        soilsCarbonStorage: soilsCarbonStorageImpactResult,
        ...developmentPlanRelatedImpacts,
      },
    };
  }
}
