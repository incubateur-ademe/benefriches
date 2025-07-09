import {
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  Friche,
  NewUrbanCenterProjectGenerator,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  Site,
  SiteNature,
  SoilsDistribution,
} from "shared";
import { v4 as uuid } from "uuid";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { CityDataProvider } from "../gateways/CityDataProvider";
import { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import { InputSiteData } from "../model/project-impacts/ReconversionProjectImpactsService";
import { UrbanProjectImpactsService } from "../model/project-impacts/UrbanProjectImpactsService";
import { getDefaultImpactsEvaluationPeriod } from "../model/project-impacts/impactsEvaluationPeriod";
import { DevelopmentPlan, Schedule } from "../model/reconversionProject";
import { Result } from "./computeReconversionProjectImpacts.usecase";

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
  nature: SiteNature;
  fricheActivity?: string;
  addressCityCode: string;
  addressLabel: string;
  contaminatedSoilSurface?: number;
  ownerStructureType: string;
  ownerName: string;
  tenantName?: string;
  surfaceArea: number;
  soilsDistribution: SoilsDistribution;
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
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  decontaminatedSoilSurface?: number;
};

type Request = {
  siteSurfaceArea: number;
  siteCityCode: string;
};

export class QuickComputeUrbanProjectImpactsOnFricheUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly cityCodeService: CityDataProvider,
    private readonly siteGenerationService: SiteGenerationService,
    private readonly dateProvider: DateProvider,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    private readonly getCityRelatedDataService: GetCityRelatedDataService,
  ) {}

  async execute({ siteCityCode, siteSurfaceArea }: Request): Promise<Result> {
    const city = await this.cityCodeService.getCitySurfaceAreaAndPopulation(siteCityCode);

    const site = this.siteGenerationService.fromSurfaceAreaAndCity(siteSurfaceArea, city) as Friche;

    const siteSoilsCarbonStorage = await this.getCarbonStorageFromSoilDistributionService.execute({
      cityCode: site.address.cityCode,
      soilsDistribution: site.soilsDistribution.toJSON(),
    });

    const siteData: InputSiteData = {
      nature: site.nature,
      addressCityCode: site.address.cityCode,
      tenantName: site.tenant?.name,
      ownerName: site.owner.name,
      surfaceArea: site.surfaceArea,
      soilsDistribution: site.soilsDistribution.toJSON(),
      contaminatedSoilSurface: site.contaminatedSoilSurface,
      yearlyExpenses: site.yearlyExpenses,
      accidentsDeaths: site.accidentsDeaths,
      accidentsMinorInjuries: site.accidentsMinorInjuries,
      accidentsSevereInjuries: site.accidentsSevereInjuries,
      soilsCarbonStorage: siteSoilsCarbonStorage,
    };

    // we don't care for reconversion project and creator id since it won't be saved in DB
    const projectId = uuid();
    const creatorId = uuid();
    const reconversionProjectCreationService = new NewUrbanCenterProjectGenerator(
      this.dateProvider,
      projectId,
      creatorId,
      {
        id: site.id,
        nature: site.nature,
        owner: site.owner,
        soilsDistribution: site.soilsDistribution.toJSON(),
        surfaceArea: site.surfaceArea,
        contaminatedSoilSurface: site.contaminatedSoilSurface,
        address: site.address,
      },
    );
    const reconversionProject = reconversionProjectCreationService.getReconversionProject();

    const projectSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: site.address.cityCode,
        soilsDistribution: reconversionProject.soilsDistribution,
      });

    const evaluationPeriodInYears = getDefaultImpactsEvaluationPeriod(
      reconversionProject.developmentPlan.type,
      reconversionProject.developmentPlan.features,
    );

    const impacts = new UrbanProjectImpactsService({
      siteCityData: {
        siteIsFriche: true,
        citySquareMetersSurfaceArea: city.surfaceArea,
        cityPopulation: city.population,
        cityPropertyValuePerSquareMeter: (
          await this.getCityRelatedDataService.getPropertyValuePerSquareMeter(
            siteData.addressCityCode,
          )
        ).medianPricePerSquareMeters,
      },
      relatedSite: siteData,
      evaluationPeriodInYears,
      dateProvider: this.dateProvider,
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
        siteResaleSellingPrice: reconversionProject.siteResaleExpectedSellingPrice,
        reinstatementSchedule: reconversionProject.reinstatementSchedule,
        reinstatementExpenses: (reconversionProject.reinstatementCosts ??
          []) as ReinstatementExpense[],
        soilsCarbonStorage: projectSoilsCarbonStorage,
      },
    });

    return {
      id: projectId,
      name: reconversionProject.name,
      relatedSiteId: site.id,
      relatedSiteName: site.name,
      evaluationPeriodInYears,
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
        soilsDistribution: site.soilsDistribution.toJSON(),
        surfaceArea: site.surfaceArea,
        nature: site.nature,
        fricheActivity: site.fricheActivity,
        owner: {
          name: site.owner.name,
          structureType: site.owner.structureType,
        },
      },
      impacts: impacts.formatImpacts(),
    };
  }
}
