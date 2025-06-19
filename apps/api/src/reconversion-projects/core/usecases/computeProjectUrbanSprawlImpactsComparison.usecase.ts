import {
  AgriculturalOperationGenerator,
  FricheGenerator,
  NaturalAreaGenerator,
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
  SiteNature,
  SoilsDistribution,
  UrbanSprawlImpactsComparisonResult,
} from "shared";
import { v4 as uuid } from "uuid";

import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import {
  GetCarbonStorageFromSoilDistributionService,
  SoilsCarbonStorage,
} from "../gateways/SoilsCarbonStorageService";
import { PhotovoltaicProjectImpactsService } from "../model/impacts/PhotovoltaicProjectImpactsService";
import {
  InputReconversionProjectData,
  InputSiteData,
} from "../model/impacts/ReconversionProjectImpactsService";
import {
  SiteCityDataProps,
  UrbanProjectImpactsService,
} from "../model/impacts/UrbanProjectImpactsService";
import { Schedule } from "../model/reconversionProject";

export interface SiteImpactsQuery {
  getById(siteId: string): Promise<SiteImpactsDataView | undefined>;
}

type ApiReconversionProjectImpactsDataView = ReconversionProjectImpactsDataView<Schedule>;

type ReconversionProjectImpactsQueryResult = Omit<
  ApiReconversionProjectImpactsDataView,
  "developmentPlan"
> & {
  developmentPlan?: {
    installationCosts: ApiReconversionProjectImpactsDataView["developmentPlan"]["installationCosts"];
  } & Partial<Omit<ApiReconversionProjectImpactsDataView["developmentPlan"], "installationCosts">>;
};
type ApiUrbanSprawlImpactsComparisonResult = UrbanSprawlImpactsComparisonResult<Schedule>;

export interface ReconversionProjectImpactsQuery {
  getById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsQueryResult | undefined>;
}

type Request = {
  reconversionProjectId: string;
  evaluationPeriodInYears: number;
  comparisonSiteNature: SiteNature;
};

class ReconversionProjectNotFound extends Error {
  constructor(reconversionProjectId: string) {
    super(
      `ComputeProjectUrbanSprawlImpactsComparisonUsecase: ReconversionProject with id ${reconversionProjectId} not found`,
    );
    this.name = "ReconversionProjectNotFound";
  }
}

class SiteNotFound extends Error {
  constructor(siteId: string) {
    super(`ComputeProjectUrbanSprawlImpactsComparisonUsecase: Site with id ${siteId} not found`);
    this.name = "SiteNotFound";
  }
}

class NoDevelopmentPlanType extends Error {
  constructor(reconversionProjectId: string) {
    super(
      `ComputeProjectUrbanSprawlImpactsComparisonUsecase: ReconversionProject with id ${reconversionProjectId} has no development plan`,
    );
    this.name = "NoDevelopmentPlanType";
  }
}

type FormatSiteDataForImpactsServiceProps = {
  siteData: SiteImpactsDataView;
  siteSoilsCarbonStorage?: SoilsCarbonStorage;
};
const formatSiteDataForImpactsService = ({
  siteData,
  siteSoilsCarbonStorage,
}: FormatSiteDataForImpactsServiceProps): InputSiteData => {
  const commonData = {
    ...siteData,
    addressCityCode: siteData.address.cityCode,
    soilsCarbonStorage: siteSoilsCarbonStorage,
  };
  switch (siteData.nature) {
    case "AGRICULTURAL_OPERATION":
      return {
        ...commonData,
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: siteData.agriculturalOperationActivity,
        isSiteOperated: siteData.isSiteOperated,
      };
    case "FRICHE":
      return {
        ...commonData,
        nature: "FRICHE",
        contaminatedSoilSurface: siteData.contaminatedSoilSurface,
        accidentsDeaths: siteData.accidentsDeaths,
        accidentsMinorInjuries: siteData.accidentsMinorInjuries,
        accidentsSevereInjuries: siteData.accidentsSevereInjuries,
      };
    case "NATURAL_AREA":
      return {
        ...commonData,
        nature: "NATURAL_AREA",
      };
  }
};

type ComputeReconversionProjectImpactsOnSiteProps = {
  siteCityData: SiteCityDataProps;
  inputSiteData: InputSiteData;
  inputReconversionProject: InputReconversionProjectData;
  evaluationPeriodInYears: number;
  dateProvider: DateProvider;
};
const computeReconversionProjectImpactsOnSite = ({
  inputSiteData,
  siteCityData,
  inputReconversionProject,
  evaluationPeriodInYears,
  dateProvider,
}: ComputeReconversionProjectImpactsOnSiteProps) => {
  switch (inputReconversionProject.developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT": {
      const photovoltaicProjectImpactsService = new PhotovoltaicProjectImpactsService({
        reconversionProject: inputReconversionProject,
        relatedSite: inputSiteData,
        evaluationPeriodInYears,
        dateProvider,
      });

      return photovoltaicProjectImpactsService.formatImpacts();
    }
    case "URBAN_PROJECT": {
      const urbanProjectImpactsService = new UrbanProjectImpactsService({
        reconversionProject: inputReconversionProject,
        relatedSite: inputSiteData,
        evaluationPeriodInYears,
        dateProvider: dateProvider,
        siteCityData: siteCityData,
      });
      return urbanProjectImpactsService.formatImpacts();
    }
  }
};

export class ComputeProjectUrbanSprawlImpactsComparisonUseCase
  implements UseCase<Request, ApiUrbanSprawlImpactsComparisonResult>
{
  constructor(
    private readonly reconversionProjectQuery: ReconversionProjectImpactsQuery,
    private readonly siteRepository: SiteImpactsQuery,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    private readonly dateProvider: DateProvider,
    private readonly getCityRelatedDataService: GetCityRelatedDataService,
  ) {}

  async execute({
    reconversionProjectId,
    evaluationPeriodInYears,
    comparisonSiteNature,
  }: Request): Promise<ApiUrbanSprawlImpactsComparisonResult> {
    const reconversionProject = await this.reconversionProjectQuery.getById(reconversionProjectId);

    if (!reconversionProject) throw new ReconversionProjectNotFound(reconversionProjectId);

    if (
      !reconversionProject.developmentPlan ||
      !reconversionProject.developmentPlan.type ||
      !reconversionProject.developmentPlan.features
    ) {
      throw new NoDevelopmentPlanType(reconversionProjectId);
    }

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);

    if (!relatedSite) throw new SiteNotFound(reconversionProject.relatedSiteId);

    const { squareMetersSurfaceArea, population } =
      await this.getCityRelatedDataService.getCityPopulationAndSurfaceArea(
        relatedSite.address.cityCode,
      );

    const comparisonSite = (() => {
      switch (comparisonSiteNature) {
        case "FRICHE":
          return new FricheGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: population,
            fricheActivity: "INDUSTRY",
          });
        case "AGRICULTURAL_OPERATION":
          return new AgriculturalOperationGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: population,
            operationActivity: "FLOWERS_AND_HORTICULTURE",
          });
        case "NATURAL_AREA":
          return new NaturalAreaGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: population,
            naturalAreaType: "PRAIRIE",
          });
      }
    })();

    const comparisonSiteData = {
      ...comparisonSite,
      isExpressSite: true,
      ownerName: comparisonSite.owner.name,
      ownerStructureType: comparisonSite.owner.structureType,
      soilsDistribution: comparisonSite.soilsDistribution as SoilsDistribution,
    };

    const baseSiteSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.address.cityCode,
        soilsDistribution: relatedSite.soilsDistribution,
      });

    const projectSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.address.cityCode,
        soilsDistribution: reconversionProject.soilsDistribution,
      });

    const comparisonSiteSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: comparisonSiteData.address.cityCode,
        soilsDistribution: comparisonSiteData.soilsDistribution,
      });

    const baseInputSiteData = formatSiteDataForImpactsService({
      siteData: relatedSite,
      siteSoilsCarbonStorage: baseSiteSoilsCarbonStorage,
    });
    const comparisonInputSiteData = formatSiteDataForImpactsService({
      siteData: comparisonSiteData,
      siteSoilsCarbonStorage: comparisonSiteSoilsCarbonStorage,
    });

    const inputReconversionProjectData: InputReconversionProjectData = {
      ...reconversionProject,
      developmentPlanInstallationExpenses: reconversionProject.developmentPlan.installationCosts,
      developmentPlanType: reconversionProject.developmentPlan.type,
      developmentPlanDeveloperName: reconversionProject.developmentPlan.developerName,
      developmentPlanFeatures: reconversionProject.developmentPlan.features,
      soilsCarbonStorage: projectSoilsCarbonStorage,
    };

    const siteCityData = {
      citySquareMetersSurfaceArea: squareMetersSurfaceArea,
      cityPopulation: population,
    };

    const baseSiteCityData: SiteCityDataProps = await (async () => {
      if (relatedSite.nature === "FRICHE") {
        return {
          ...siteCityData,
          siteIsFriche: true,
          cityPropertyValuePerSquareMeter: (
            await this.getCityRelatedDataService.getPropertyValuePerSquareMeter(
              relatedSite.address.cityCode,
            )
          ).medianPricePerSquareMeters,
        };
      }
      return { siteIsFriche: false, ...siteCityData };
    })();

    const comparisonSiteCityData: SiteCityDataProps = await (async () => {
      if (comparisonSite.nature === "FRICHE") {
        return {
          ...siteCityData,
          siteIsFriche: true,
          cityPropertyValuePerSquareMeter: (
            await this.getCityRelatedDataService.getPropertyValuePerSquareMeter(
              relatedSite.address.cityCode,
            )
          ).medianPricePerSquareMeters,
        };
      }
      return { siteIsFriche: false, ...siteCityData };
    })();

    return {
      baseCase: {
        siteData: relatedSite,
        impacts: computeReconversionProjectImpactsOnSite({
          siteCityData: baseSiteCityData,
          dateProvider: this.dateProvider,
          inputSiteData: baseInputSiteData,
          inputReconversionProject: inputReconversionProjectData,
          evaluationPeriodInYears,
        }),
      },
      comparisonCase: {
        siteData: comparisonSiteData,
        impacts: computeReconversionProjectImpactsOnSite({
          siteCityData: comparisonSiteCityData,
          dateProvider: this.dateProvider,
          inputSiteData: comparisonInputSiteData,
          inputReconversionProject: inputReconversionProjectData,
          evaluationPeriodInYears,
        }),
      },
      projectData: reconversionProject as ApiReconversionProjectImpactsDataView,
    };
  }
}
