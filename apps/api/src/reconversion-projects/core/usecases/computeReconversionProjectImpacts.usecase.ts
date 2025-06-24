import {
  ReconversionProjectImpacts,
  SiteNature,
  SoilsDistribution,
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
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
import { getDefaultImpactsEvaluationPeriod } from "../model/impacts/impactsEvaluationPeriod";
import { DevelopmentPlan, Schedule } from "../model/reconversionProject";

export interface SiteImpactsQuery {
  getById(siteId: string): Promise<SiteImpactsDataView | undefined>;
}

export type ApiReconversionProjectImpactsDataView = ReconversionProjectImpactsDataView<Schedule>;

type ReconversionProjectImpactsQueryResult = Omit<
  ApiReconversionProjectImpactsDataView,
  "developmentPlan"
> & {
  developmentPlan?: {
    installationCosts: ApiReconversionProjectImpactsDataView["developmentPlan"]["installationCosts"];
  } & Partial<Omit<ApiReconversionProjectImpactsDataView["developmentPlan"], "installationCosts">>;
};

export interface ReconversionProjectImpactsQuery {
  getById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsQueryResult | undefined>;
}

type Request = {
  reconversionProjectId: string;
  evaluationPeriodInYears?: number;
};

export type Result = {
  id: string;
  name: string;
  evaluationPeriodInYears: number;
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
    nature: SiteNature;
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

  async execute({
    reconversionProjectId,
    evaluationPeriodInYears: inputEvaluationPeriodInYears,
  }: Request): Promise<Result> {
    const reconversionProject = await this.reconversionProjectQuery.getById(reconversionProjectId);
    if (!reconversionProject) throw new ReconversionProjectNotFound(reconversionProjectId);

    if (
      !reconversionProject.developmentPlan ||
      !reconversionProject.developmentPlan.type ||
      !reconversionProject.developmentPlan.features
    ) {
      throw new NoDevelopmentPlanType(reconversionProjectId);
    }

    const evaluationPeriodInYears =
      inputEvaluationPeriodInYears ??
      getDefaultImpactsEvaluationPeriod(
        reconversionProject.developmentPlan.type,
        reconversionProject.developmentPlan.features,
      );

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) throw new SiteNotFound(reconversionProject.relatedSiteId);

    const result = {
      id: reconversionProjectId,
      name: reconversionProject.name,
      relatedSiteId: reconversionProject.relatedSiteId,
      relatedSiteName: relatedSite.name,
      evaluationPeriodInYears,
      projectData: {
        soilsDistribution: reconversionProject.soilsDistribution,
        contaminatedSoilSurface:
          (relatedSite.contaminatedSoilSurface ?? 0) -
          (reconversionProject.decontaminatedSoilSurface ?? 0),
        isExpressProject: reconversionProject.isExpressProject,
        developmentPlan: {
          ...reconversionProject.developmentPlan.features,
          type: reconversionProject.developmentPlan.type,
        },
      },
      siteData: {
        addressLabel: relatedSite.address.value,
        contaminatedSoilSurface: relatedSite.contaminatedSoilSurface ?? 0,
        soilsDistribution: relatedSite.soilsDistribution,
        surfaceArea: relatedSite.surfaceArea,
        nature: relatedSite.nature,
        fricheActivity: relatedSite.fricheActivity,
        owner: {
          name: relatedSite.ownerName,
          structureType: relatedSite.ownerStructureType,
        },
      },
    };

    const siteSoilsCarbonStorage = await this.getCarbonStorageFromSoilDistributionService.execute({
      cityCode: relatedSite.address.cityCode,
      soilsDistribution: relatedSite.soilsDistribution,
    });
    const projectSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.address.cityCode,
        soilsDistribution: reconversionProject.soilsDistribution,
      });

    const siteData: InputSiteData = (() => {
      const commonData = {
        addressCityCode: relatedSite.address.cityCode,
        soilsDistribution: relatedSite.soilsDistribution,
        surfaceArea: relatedSite.surfaceArea,
        ownerName: relatedSite.ownerName,
        yearlyExpenses: relatedSite.yearlyExpenses,
        yearlyIncomes: relatedSite.yearlyIncomes,
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
      ...reconversionProject,
      developmentPlanInstallationExpenses: reconversionProject.developmentPlan.installationCosts,
      developmentPlanType: reconversionProject.developmentPlan.type,
      developmentPlanDeveloperName: reconversionProject.developmentPlan.developerName,
      developmentPlanFeatures: reconversionProject.developmentPlan.features,
      soilsCarbonStorage: projectSoilsCarbonStorage,
    };

    switch (reconversionProject.developmentPlan.type) {
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
            relatedSite.address.cityCode,
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
                      relatedSite.address.cityCode,
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
