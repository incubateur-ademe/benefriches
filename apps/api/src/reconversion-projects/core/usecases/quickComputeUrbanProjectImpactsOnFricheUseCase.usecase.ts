import {
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  Friche,
  ReconversionProjectImpacts,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  Site,
  SoilsDistribution,
} from "shared";
import { v4 as uuid } from "uuid";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { CityDataProvider } from "../gateways/CityDataProvider";
import { NewUrbanCenterProjectExpressCreationService } from "../model/create-from-site-services/NewUrbanCenterProjectExpressCreationService";
import {
  GetSoilsCarbonStoragePerSoilsService,
  InputSiteData,
} from "../model/impacts/ReconversionProjectImpactsService";
import { UrbanProjectImpactsService } from "../model/impacts/UrbanProjectImpactsService";
import { DevelopmentPlan, Schedule } from "../model/reconversionProject";

export type City = {
  name: string;
  cityCode: string;
  population: number;
  surfaceArea: number;
};

interface SiteGenerationService {
  fromSurfaceAreaAndCity(surfaceArea: number, city: City): Site;
}

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
  developmentPlanInstallationCosts: DevelopmentPlanInstallationExpenses[];
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  yearlyProjectedCosts: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  developmentPlanType?: DevelopmentPlan["type"];
  developmentPlanDeveloperName?: string;
  developmentPlanFeatures?: DevelopmentPlan["features"];
  operationsFirstYear?: number;
  siteResaleTotalAmount?: number;
  buildingsResaleSellingPrice?: number;
  decontaminatedSoilSurface?: number;
};

type Request = {
  siteSurfaceArea: number;
  siteCityCode: string;
};

type Result = {
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

const EVALUATION_PERIOD_IN_YEARS = 30;

export class QuickComputeUrbanProjectImpactsOnFricheUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly cityCodeService: CityDataProvider,
    private readonly siteGenerationService: SiteGenerationService,
    private readonly dateProvider: DateProvider,
    private readonly getSoilsCarbonStoragePerSoilsService: GetSoilsCarbonStoragePerSoilsService,
    private readonly getCityRelatedDataService: GetCityRelatedDataService,
  ) {}

  async execute({ siteCityCode, siteSurfaceArea }: Request): Promise<Result> {
    const city = await this.cityCodeService.getCitySurfaceAreaAndPopulation(siteCityCode);

    const site = this.siteGenerationService.fromSurfaceAreaAndCity(siteSurfaceArea, city) as Friche;

    const siteData: InputSiteData = {
      isFriche: site.isFriche,
      addressCityCode: site.address.cityCode,
      tenantName: site.tenant?.name,
      ownerName: site.owner.name,
      surfaceArea: site.surfaceArea,
      soilsDistribution: site.soilsDistribution,
      contaminatedSoilSurface: site.contaminatedSoilSurface,
      yearlyExpenses: site.yearlyExpenses,
      accidentsDeaths: site.accidentsDeaths,
      accidentsMinorInjuries: site.accidentsMinorInjuries,
      accidentsSevereInjuries: site.accidentsSevereInjuries,
    };

    // we don't care for reconversion project and creator id since it won't be saved in DB
    const projectId = uuid();
    const creatorId = uuid();
    const reconversionProjectCreationService = new NewUrbanCenterProjectExpressCreationService(
      this.dateProvider,
      projectId,
      creatorId,
      {
        id: site.id,
        isFriche: site.isFriche,
        owner: site.owner,
        soilsDistribution: site.soilsDistribution,
        surfaceArea: site.surfaceArea,
        contaminatedSoilSurface: site.contaminatedSoilSurface,
        address: site.address,
      },
    );
    const reconversionProject = reconversionProjectCreationService.getReconversionProject();

    const impacts = new UrbanProjectImpactsService({
      cityPopulation: city.population,
      relatedSite: siteData,
      evaluationPeriodInYears: EVALUATION_PERIOD_IN_YEARS,
      dateProvider: this.dateProvider,
      citySquareMetersSurfaceArea: city.surfaceArea,
      getCityRelatedDataService: this.getCityRelatedDataService,
      getSoilsCarbonStorageService: this.getSoilsCarbonStoragePerSoilsService,
      reconversionProject: {
        developmentPlanInstallationExpenses: reconversionProject.developmentPlan
          .costs as DevelopmentPlanInstallationExpenses[],
        developmentPlanType: reconversionProject.developmentPlan.type,
        developmentPlanFeatures: reconversionProject.developmentPlan.features,
        developmentPlanDeveloperName: reconversionProject.developmentPlan.developer.name,
        soilsDistribution: reconversionProject.soilsDistribution,
        financialAssistanceRevenues:
          reconversionProject.financialAssistanceRevenues as FinancialAssistanceRevenue[],
        futureSiteOwnerName: reconversionProject.futureSiteOwner?.name,
        futureOperatorName: reconversionProject.futureOperator?.name,
        reinstatementContractOwnerName: reconversionProject.reinstatementContractOwner?.name,
        yearlyProjectedExpenses: reconversionProject.yearlyProjectedCosts as RecurringExpense[],
        yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues as RecurringRevenue[],
        decontaminatedSoilSurface: reconversionProject.decontaminatedSoilSurface,
        operationsFirstYear: reconversionProject.operationsFirstYear,
        sitePurchaseTotalAmount: reconversionProject.sitePurchaseSellingPrice
          ? reconversionProject.sitePurchaseSellingPrice +
            (reconversionProject.sitePurchasePropertyTransferDuties ?? 0)
          : 0,
        sitePurchasePropertyTransferDutiesAmount:
          reconversionProject.sitePurchasePropertyTransferDuties,
        siteResaleTotalAmount:
          (reconversionProject.siteResaleExpectedSellingPrice ?? 0) +
          (reconversionProject.siteResaleExpectedPropertyTransferDuties ?? 0),
        reinstatementSchedule: reconversionProject.reinstatementSchedule,
        reinstatementExpenses: (reconversionProject.reinstatementCosts ??
          []) as ReinstatementExpense[],
      },
    });

    return {
      id: projectId,
      name: reconversionProject.name,
      relatedSiteId: site.id,
      relatedSiteName: site.name,
      projectData: {
        soilsDistribution: reconversionProject.soilsDistribution,
        contaminatedSoilSurface:
          (site.contaminatedSoilSurface ?? 0) -
          (reconversionProject.decontaminatedSoilSurface ?? 0),
        isExpressProject: true,
        developmentPlan: {
          ...reconversionProject.developmentPlan.features,
          type: reconversionProject.developmentPlan.type,
        },
      },
      siteData: {
        addressLabel: city.name,
        contaminatedSoilSurface: site.contaminatedSoilSurface ?? 0,
        soilsDistribution: site.soilsDistribution,
        surfaceArea: site.surfaceArea,
        isFriche: site.isFriche,
        fricheActivity: site.fricheActivity,
        owner: {
          name: site.owner.name,
          structureType: site.owner.structureType,
        },
      },
      impacts: await impacts.formatImpacts(),
    };
  }
}
