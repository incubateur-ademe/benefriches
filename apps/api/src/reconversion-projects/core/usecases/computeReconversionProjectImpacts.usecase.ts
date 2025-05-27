import {
  AgriculturalOperationActivity,
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  ReconversionProjectImpacts,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SiteNature,
  SiteYearlyExpense,
  SoilsDistribution,
} from "shared";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import { PhotovoltaicProjectImpactsService } from "../model/impacts/PhotovoltaicProjectImpactsService";
import {
  InputReconversionProjectData,
  InputSiteData,
} from "../model/impacts/ReconversionProjectImpactsService";
import { UrbanProjectImpactsService } from "../model/impacts/UrbanProjectImpactsService";
import { DevelopmentPlan, Schedule } from "../model/reconversionProject";

export type SiteImpactsDataView = {
  id: string;
  name: string;
  nature: SiteNature;
  fricheActivity?: string;
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  isSiteOperated?: boolean;
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
  yearlyExpenses: SiteYearlyExpense[];
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
  reinstatementExpenses: ReinstatementExpense[];
  developmentPlanInstallationExpenses: DevelopmentPlanInstallationExpenses[];
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  developmentPlanType?: DevelopmentPlan["type"];
  developmentPlanDeveloperName?: string;
  developmentPlanFeatures?: DevelopmentPlan["features"];
  operationsFirstYear?: number;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
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
    this.name = "NoDevelopmentPlanType";
  }
}

export class ComputeReconversionProjectImpactsUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly reconversionProjectQuery: ReconversionProjectImpactsQuery,
    private readonly siteRepository: SiteImpactsQuery,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
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
        isFriche: relatedSite.nature === "FRICHE",
        fricheActivity: relatedSite.fricheActivity,
        owner: {
          name: relatedSite.ownerName,
          structureType: relatedSite.ownerStructureType,
        },
      },
    };

    const siteSoilsCarbonStorage = await this.getCarbonStorageFromSoilDistributionService.execute({
      cityCode: relatedSite.addressCityCode,
      soilsDistribution: relatedSite.soilsDistribution,
    });
    const projectSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.addressCityCode,
        soilsDistribution: reconversionProject.soilsDistribution,
      });

    const siteData: InputSiteData = (() => {
      const commonData = {
        addressCityCode: relatedSite.addressCityCode,
        soilsDistribution: relatedSite.soilsDistribution,
        surfaceArea: relatedSite.surfaceArea,
        ownerName: relatedSite.ownerName,
        yearlyExpenses: relatedSite.yearlyExpenses,
        tenantName: relatedSite.tenantName,
        soilsCarbonStorage: siteSoilsCarbonStorage,
      };
      switch (relatedSite.nature) {
        case "AGRICULTURAL_OPERATION":
          return {
            ...commonData,
            nature: "AGRICULTURAL_OPERATION",
            agriculturalOperationActivity: relatedSite.agriculturalOperationActivity,
            isSiteOperated: relatedSite.isSiteOperated,
          };
        case "FRICHE":
          return {
            ...commonData,
            nature: "FRICHE",
            contaminatedSoilSurface: relatedSite.contaminatedSoilSurface,
            accidentsDeaths: relatedSite.accidentsDeaths,
            accidentsMinorInjuries: relatedSite.accidentsMinorInjuries,
            accidentsSevereInjuries: relatedSite.accidentsSevereInjuries,
          };
        case "NATURAL_AREA":
          return {
            ...commonData,
            nature: "NATURAL_AREA",
          };
      }
    })();

    const reconversionProjectData: InputReconversionProjectData = {
      developmentPlanInstallationExpenses: reconversionProject.developmentPlanInstallationExpenses,
      developmentPlanType: reconversionProject.developmentPlanType,
      developmentPlanFeatures: reconversionProject.developmentPlanFeatures,
      developmentPlanDeveloperName: reconversionProject.developmentPlanDeveloperName,
      soilsDistribution: reconversionProject.soilsDistribution,
      financialAssistanceRevenues: reconversionProject.financialAssistanceRevenues,
      futureSiteOwnerName: reconversionProject.futureSiteOwnerName,
      futureOperatorName: reconversionProject.futureOperatorName,
      reinstatementContractOwnerName: reconversionProject.reinstatementContractOwnerName,
      yearlyProjectedExpenses: reconversionProject.yearlyProjectedExpenses,
      yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues,
      decontaminatedSoilSurface: reconversionProject.decontaminatedSoilSurface,
      operationsFirstYear: reconversionProject.operationsFirstYear,
      sitePurchaseTotalAmount: reconversionProject.sitePurchaseTotalAmount,
      sitePurchasePropertyTransferDutiesAmount:
        reconversionProject.sitePurchasePropertyTransferDutiesAmount,
      reinstatementSchedule: reconversionProject.reinstatementSchedule,
      reinstatementExpenses: reconversionProject.reinstatementExpenses,
      conversionSchedule: reconversionProject.conversionSchedule,
      siteResaleSellingPrice: reconversionProject.siteResaleSellingPrice,
      buildingsResaleSellingPrice: reconversionProject.buildingsResaleSellingPrice,
      soilsCarbonStorage: projectSoilsCarbonStorage,
    };

    switch (reconversionProject.developmentPlanType) {
      case "PHOTOVOLTAIC_POWER_PLANT": {
        const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
          reconversionProject: reconversionProjectData,
          relatedSite: siteData,
          evaluationPeriodInYears,
          dateProvider: this.dateProvider,
        });

        return {
          ...result,
          impacts: photovoltaicProjectImpactsService.formatImpacts(),
        };
      }
      case "URBAN_PROJECT": {
        const { squareMetersSurfaceArea, population } =
          await this.getCityRelatedDataService.getCityPopulationAndSurfaceArea(
            relatedSite.addressCityCode,
          );

        const urbanProjectImpactsService = new UrbanProjectImpactsService({
          reconversionProject: reconversionProjectData,
          relatedSite: siteData,
          evaluationPeriodInYears,
          dateProvider: this.dateProvider,
          siteCityData:
            relatedSite.nature === "FRICHE"
              ? {
                  siteIsFriche: true,
                  citySquareMetersSurfaceArea: squareMetersSurfaceArea,
                  cityPopulation: population,
                  cityPropertyValuePerSquareMeter: (
                    await this.getCityRelatedDataService.getPropertyValuePerSquareMeter(
                      relatedSite.addressCityCode,
                    )
                  ).medianPricePerSquareMeters,
                }
              : {
                  siteIsFriche: false,
                  citySquareMetersSurfaceArea: squareMetersSurfaceArea,
                  cityPopulation: population,
                },
        });

        return {
          ...result,
          impacts: urbanProjectImpactsService.formatImpacts(),
        };
      }
    }
  }
}
