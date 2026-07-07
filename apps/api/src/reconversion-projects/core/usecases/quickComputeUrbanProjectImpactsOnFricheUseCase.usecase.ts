import {
  GetReconversionProjectImpactsResultDto,
  NewUrbanCenterProjectGenerator,
  computeProjectImpactsWithBreakEvenLevel,
  ReconversionProjectImpactsWithBreakEvenLevelInput,
} from "shared";
import { v4 as uuid } from "uuid";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import type { Friche, Site } from "src/sites/core/models/site";
import { CityStatsProvider } from "src/territory/core/gateways/CityStatsProvider";

import { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import { getDefaultImpactsEvaluationPeriod } from "../model/impactsEvaluationPeriod";

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

type QuickComputeUrbanProjectImpactsOnFricheResult = TResult<
  GetReconversionProjectImpactsResultDto,
  never
>;

export class QuickComputeUrbanProjectImpactsOnFricheUseCase implements UseCase<
  Request,
  QuickComputeUrbanProjectImpactsOnFricheResult
> {
  private readonly cityStatsQuery: CityStatsProvider;
  private readonly siteGenerationService: SiteGenerationService;
  private readonly dateProvider: DateProvider;
  private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService;
  constructor(
    cityStatsQuery: CityStatsProvider,
    siteGenerationService: SiteGenerationService,
    dateProvider: DateProvider,
    getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
  ) {
    this.cityStatsQuery = cityStatsQuery;
    this.siteGenerationService = siteGenerationService;
    this.dateProvider = dateProvider;
    this.getCarbonStorageFromSoilDistributionService = getCarbonStorageFromSoilDistributionService;
  }

  async execute({
    siteCityCode,
    siteSurfaceArea,
  }: Request): Promise<QuickComputeUrbanProjectImpactsOnFricheResult> {
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

    const operationsFirstYear =
      reconversionProject.operationsFirstYear ?? this.dateProvider.now().getFullYear();

    const impacts = computeProjectImpactsWithBreakEvenLevel({
      reconversionProject: {
        ...reconversionProject,
        involvesReinstatement: reconversionProject.involvesReinstatement,
        isExpressProject: true,
        conversionSchedule: reconversionProject.developmentPlan.installationSchedule,
        futureOperatorStructureType: reconversionProject.futureOperator?.structureType,
        futureOperatorName: reconversionProject.futureOperator?.name,
        futureSiteOwnerName: reconversionProject.futureSiteOwner?.name,
        futureSiteOwnerStructureType: reconversionProject.futureSiteOwner?.structureType,
        reinstatementContractOwnerName: reconversionProject.reinstatementContractOwner?.name,
        reinstatementContractOwnerStructureType:
          reconversionProject.reinstatementContractOwner?.structureType,
        sitePurchaseTotalAmount:
          (reconversionProject.sitePurchaseSellingPrice ?? 0) +
          (reconversionProject.sitePurchasePropertyTransferDuties ?? 0),
        sitePurchasePropertyTransferDutiesAmount:
          reconversionProject.sitePurchasePropertyTransferDuties,
        reinstatementExpenses: reconversionProject.reinstatementCosts,
        buildingsConstructionAndRehabilitationExpenses:
          reconversionProject.buildingsConstructionAndRehabilitationExpenses,
        financialAssistanceRevenues: reconversionProject.financialAssistanceRevenues,
        yearlyProjectedExpenses: reconversionProject.yearlyProjectedCosts,
        yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues,
        developmentPlan: {
          installationCosts: reconversionProject.developmentPlan.costs,
          installationSchedule: reconversionProject.developmentPlan.installationSchedule,
          developerName: reconversionProject.developmentPlan.developer.name,
          developerStructureType: reconversionProject.developmentPlan.developer.structureType,
          type: reconversionProject.developmentPlan.type,
          features: reconversionProject.developmentPlan.features,
        },
        operationsFirstYear,
        siteResaleSellingPrice: reconversionProject.siteResaleExpectedSellingPrice,
        buildingsResaleSellingPrice: reconversionProject.buildingsResaleExpectedSellingPrice,
        siteResaleExpectedPropertyTransferDutiesAmount:
          reconversionProject.siteResaleExpectedPropertyTransferDuties,
        buildingsResaleExpectedPropertyTransferDutiesAmount:
          reconversionProject.buildingsResaleExpectedPropertyTransferDuties,
        projectSoilsCarbonStorage,
      } as ReconversionProjectImpactsWithBreakEvenLevelInput,
      relatedSite: {
        ...site,
        soilsDistribution: site.soilsDistribution.toJSON(),
        isExpressSite: true,
        ownerStructureType: site.owner.structureType,
        ownerName: site.owner.name,
        tenantStructureType: site.tenant?.structureType,
        tenantName: site.tenant?.name,
        siteSoilsCarbonStorage,
      },
      evaluationPeriodInYears,
      cityStats: {
        surfaceAreaSquareMeters,
        population,
        propertyValueMedianPricePerSquareMeters,
      },
    });

    return success({
      impacts,
      contextData: {
        projectId: reconversionProject.id,
        projectName: reconversionProject.name,
        relatedSiteId: reconversionProject.relatedSiteId,
        relatedSiteName: site.name,
        isExpressSite: true,
        isExpressProject: true,
        projectDevelopmentPlan:
          reconversionProject.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
            ? {
                type: reconversionProject.developmentPlan.type,
                installationElectricalPowerKWc:
                  reconversionProject.developmentPlan.features.electricalPowerKWc,
                installationSurfaceArea: reconversionProject.developmentPlan.features.surfaceArea,
              }
            : {
                type: reconversionProject.developmentPlan.type,
                buildingsFloorAreaDistribution:
                  reconversionProject.developmentPlan.features.buildingsFloorAreaDistribution,
              },
        siteAddress: {
          lat: site.address.lat,
          long: site.address.long,
          label: site.address.value,
        },
        siteNature: site.nature,
        siteSurfaceArea: site.surfaceArea,
        fricheActivity: site.fricheActivity,
      },
    });
  }
}
