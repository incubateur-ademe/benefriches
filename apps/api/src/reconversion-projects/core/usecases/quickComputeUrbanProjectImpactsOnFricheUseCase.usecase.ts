import {
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  Friche,
  NewUrbanCenterProjectGenerator,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  Site,
} from "shared";
import { v4 as uuid } from "uuid";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { CityStatsProvider } from "../gateways/CityStatsProvider";
import { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import { InputSiteData } from "../model/project-impacts/ReconversionProjectImpactsService";
import { UrbanProjectImpactsService } from "../model/project-impacts/UrbanProjectImpactsService";
import { getDefaultImpactsEvaluationPeriod } from "../model/project-impacts/impactsEvaluationPeriod";
import { Result } from "./computeReconversionProjectImpacts.usecase";

type City = {
  name: string;
  cityCode: string;
  population: number;
  surfaceArea: number;
};

interface SiteGenerationService {
  fromSurfaceAreaAndCity(surfaceArea: number, city: City): Site;
}

type Request = {
  siteSurfaceArea: number;
  siteCityCode: string;
};

export class QuickComputeUrbanProjectImpactsOnFricheUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly cityStatsQuery: CityStatsProvider,
    private readonly siteGenerationService: SiteGenerationService,
    private readonly dateProvider: DateProvider,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
  ) {}

  async execute({ siteCityCode, siteSurfaceArea }: Request): Promise<Result> {
    const { name, surfaceAreaSquareMeters, population, propertyValueMedianPricePerSquareMeters } =
      await this.cityStatsQuery.getCityStats(siteCityCode);

    const city = {
      name: name,
      surfaceArea: surfaceAreaSquareMeters,
      cityCode: siteCityCode,
      population: population,
    };

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
        soilsDistribution: reconversionProjectCreationService.projectSoilsDistributionByType,
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
        cityPropertyValuePerSquareMeter: propertyValueMedianPricePerSquareMeters,
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
        soilsDistribution: reconversionProjectCreationService.projectSoilsDistributionByType,
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
        soilsDistribution: reconversionProjectCreationService.projectSoilsDistributionByType,
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
