import {
  DevelopmentPlanFeatures,
  GetReconversionProjectImpactsResultDto,
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
  getProjectSoilDistributionByType,
  computeProjectImpactsWithBreakEvenLevel,
  ReconversionProjectImpactsWithBreakEvenLevelInput,
  computeProjectDevelopmentScore,
} from "shared";

import { DateProvider } from "src/shared-kernel/dateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { CityImpactsDataProvider } from "src/territory/core/gateways/CityImpactsDataProvider";
import { MunicipalityCapitalExpendituresProvider } from "src/territory/core/gateways/MunicipalityCapitalExpendituresProvider";

import { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import { Schedule } from "../model/reconversionProject";

const EVALUATION_PERIOD_IN_YEARS = 50;

export interface SiteImpactsQuery {
  getById(siteId: string): Promise<SiteImpactsDataView | undefined>;
}

type ApiReconversionProjectImpactsDataView = ReconversionProjectImpactsDataView<Schedule>;

export type ReconversionProjectImpactsQueryResult = Omit<
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
};

type GetProjectImpactAnalysisResult = TResult<
  GetReconversionProjectImpactsResultDto,
  "ReconversionProjectNotFound" | "SiteNotFound" | "NoDevelopmentPlanType"
>;

const extractProjectDevelopmentPlan = (developmentPlan: DevelopmentPlanFeatures) => {
  if (developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT") {
    return {
      type: developmentPlan.type,
      installationElectricalPowerKWc: developmentPlan.features?.electricalPowerKWc,
      installationSurfaceArea: developmentPlan.features.surfaceArea,
    };
  }

  return {
    type: developmentPlan.type,
    buildingsFloorAreaDistribution: developmentPlan.features?.buildingsFloorAreaDistribution,
  };
};

// Calculés grâce à https://data.ofgl.fr/explore/dataset/ofgl-base-communes-consolidee/analyze/?&refine.agregat=D%C3%A9penses+d%27%C3%A9quipement&refine.exer=2025
const FALLBACK_AVERAGE_CAPITAL_EXPENDITURES_AMOUNT_PER_POPULATION = [
  { minPopulation: 0, averageCapitalExpenditures2025: 50_000 },
  { minPopulation: 100, averageCapitalExpenditures2025: 100_000 },
  { minPopulation: 200, averageCapitalExpenditures2025: 150_000 },
  { minPopulation: 500, averageCapitalExpenditures2025: 400_000 },
  { minPopulation: 2000, averageCapitalExpenditures2025: 1_100_000 },
  { minPopulation: 3500, averageCapitalExpenditures2025: 2_000_000 },
  { minPopulation: 5000, averageCapitalExpenditures2025: 3_200_000 },
  { minPopulation: 10000, averageCapitalExpenditures2025: 6_000_000 },
  { minPopulation: 20000, averageCapitalExpenditures2025: 12_800_000 },
  { minPopulation: 50000, averageCapitalExpenditures2025: 31_200_000 },
  { minPopulation: 100000, averageCapitalExpenditures2025: 94_000_000 },
];

export class GetProjectImpactAnalysisUseCase implements UseCase<
  Request,
  GetProjectImpactAnalysisResult
> {
  private readonly reconversionProjectQuery: ReconversionProjectImpactsQuery;
  private readonly siteRepository: SiteImpactsQuery;
  private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService;
  private readonly cityDataQuery: CityImpactsDataProvider;
  private readonly municipalityCapitalExpendituresQuery: MunicipalityCapitalExpendituresProvider;
  private readonly dateProvider: DateProvider;
  constructor(
    reconversionProjectQuery: ReconversionProjectImpactsQuery,
    siteRepository: SiteImpactsQuery,
    getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    cityDataQuery: CityImpactsDataProvider,
    municipalityCapitalExpendituresQuery: MunicipalityCapitalExpendituresProvider,
    dateProvider: DateProvider,
  ) {
    this.reconversionProjectQuery = reconversionProjectQuery;
    this.siteRepository = siteRepository;
    this.getCarbonStorageFromSoilDistributionService = getCarbonStorageFromSoilDistributionService;
    this.cityDataQuery = cityDataQuery;
    this.municipalityCapitalExpendituresQuery = municipalityCapitalExpendituresQuery;
    this.dateProvider = dateProvider;
  }

  async execute({ reconversionProjectId }: Request): Promise<GetProjectImpactAnalysisResult> {
    const reconversionProject = await this.reconversionProjectQuery.getById(reconversionProjectId);
    if (!reconversionProject) return fail("ReconversionProjectNotFound");

    if (
      !reconversionProject.developmentPlan?.type ||
      !reconversionProject.developmentPlan?.features
    ) {
      return fail("NoDevelopmentPlanType");
    }

    const relatedSite = await this.siteRepository.getById(reconversionProject.relatedSiteId);
    if (!relatedSite) return fail("SiteNotFound");

    const operationsFirstYear =
      reconversionProject.operationsFirstYear ?? this.dateProvider.now().getFullYear();

    const soilsDistributionByType = getProjectSoilDistributionByType(
      reconversionProject.soilsDistribution,
    );
    const siteSoilsCarbonStorage = await this.getCarbonStorageFromSoilDistributionService.execute({
      cityCode: relatedSite.address.cityCode,
      soilsDistribution: relatedSite.soilsDistribution,
    });
    const projectSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.address.cityCode,
        soilsDistribution: soilsDistributionByType,
      });

    const cityData = await this.cityDataQuery.getCityDataAndStats(relatedSite.address.cityCode);

    const impacts = computeProjectImpactsWithBreakEvenLevel({
      reconversionProject: {
        ...reconversionProject,
        projectSoilsCarbonStorage,
        operationsFirstYear,
      } as ReconversionProjectImpactsWithBreakEvenLevelInput,
      relatedSite: { ...relatedSite, siteSoilsCarbonStorage },
      evaluationPeriodInYears: EVALUATION_PERIOD_IN_YEARS,
      city: cityData,
    });

    const municipalityCapitalExpenditures: GetReconversionProjectImpactsResultDto["contextData"]["municipalityCapitalExpenditures"] =
      await (async () => {
        try {
          const queryResult = await this.municipalityCapitalExpendituresQuery.getLastReferenceYear(
            relatedSite.address.cityCode,
          );
          return {
            ...queryResult,
            accuracy: "city",
          };
        } catch {
          return {
            amount:
              FALLBACK_AVERAGE_CAPITAL_EXPENDITURES_AMOUNT_PER_POPULATION.findLast(
                (s) => cityData.stats.population >= s.minPopulation,
              )?.averageCapitalExpenditures2025 ?? 1_100_000,
            referenceYear: "2025",
            accuracy: "average",
          };
        }
      })();

    const contextData = {
      projectId: reconversionProject.id,
      projectName: reconversionProject.name,
      relatedSiteId: reconversionProject.relatedSiteId,
      relatedSiteName: relatedSite.name,
      isExpressSite: relatedSite.isExpressSite,
      isExpressProject: reconversionProject.isExpressProject,
      projectDevelopmentPlan: extractProjectDevelopmentPlan(
        reconversionProject.developmentPlan as DevelopmentPlanFeatures,
      ),
      siteAddress: {
        lat: relatedSite.address.lat,
        long: relatedSite.address.long,
        label: relatedSite.address.value,
      },
      siteNature: relatedSite.nature,
      siteSurfaceArea: relatedSite.surfaceArea,
      fricheActivity: relatedSite.fricheActivity,
      municipalityCapitalExpenditures,
    };

    return success({
      contextData,
      developmentScore: computeProjectDevelopmentScore(contextData, impacts),
      impacts: impacts,
    });
  }
}
