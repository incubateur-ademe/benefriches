import {
  DevelopmentPlanInstallationCost,
  FinancialAssistanceRevenue,
  ReconversionProjectImpacts,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
} from "shared";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { PhotovoltaicProjectImpactsService } from "../model/impacts/PhotovoltaicProjectImpactsService";
import { GetSoilsCarbonStoragePerSoilsService } from "../model/impacts/ReconversionProjectImpactsService";
import { UrbanProjectImpactsService } from "../model/impacts/UrbanProjectImpactsService";
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
  reinstatementCosts: ReinstatementExpense[];
  developmentPlanInstallationCosts: DevelopmentPlanInstallationCost[];
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  yearlyProjectedCosts: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
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

class NoDevelopmentPlanType extends Error {
  constructor(reconversionProjectId: string) {
    super(
      `ComputeReconversionProjectImpacts: ReconversionProject with id ${reconversionProjectId} has no development plan`,
    );
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

    if (!reconversionProject.developmentPlanType) {
      throw new NoDevelopmentPlanType(reconversionProjectId);
    }

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) throw new SiteNotFound(reconversionProject.relatedSiteId);

    const result = {
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
          ...reconversionProject.developmentPlanFeatures,
          type: reconversionProject.developmentPlanType,
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
    };

    switch (reconversionProject.developmentPlanType) {
      case "PHOTOVOLTAIC_POWER_PLANT": {
        const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
          reconversionProject,
          relatedSite,
          evaluationPeriodInYears,
          dateProvider: this.dateProvider,
          getSoilsCarbonStorageService: this.getSoilsCarbonStoragePerSoilsService,
        });

        return {
          ...result,
          impacts: await photovoltaicProjectImpactsService.formatImpacts(),
        };
      }
      case "URBAN_PROJECT": {
        const { squareMetersSurfaceArea, population } =
          await this.getCityRelatedDataService.getCityPopulationAndSurfaceArea(
            relatedSite.addressCityCode,
          );

        const urbanProjectImpactsService = new UrbanProjectImpactsService({
          reconversionProject,
          relatedSite,
          evaluationPeriodInYears,
          dateProvider: this.dateProvider,
          getCityRelatedDataService: this.getCityRelatedDataService,
          getSoilsCarbonStorageService: this.getSoilsCarbonStoragePerSoilsService,
          citySquareMetersSurfaceArea: squareMetersSurfaceArea,
          cityPopulation: population,
        });

        return {
          ...result,
          impacts: await urbanProjectImpactsService.formatImpacts(),
        };
      }
    }
  }
}
