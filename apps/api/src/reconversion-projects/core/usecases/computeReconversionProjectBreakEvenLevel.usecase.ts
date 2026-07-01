import {
  DevelopmentPlanFeatures,
  GetReconversionProjectImpactsResultDto,
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
  getProjectSoilDistributionByType,
  computeProjectImpactsWithBreakEvenLevel,
  ReconversionProjectImpactsWithBreakEvenLevelInput,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { CityStatsProvider } from "src/territory/core/gateways/CityStatsProvider";

import { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import { Schedule } from "../model/reconversionProject";

const DEFAULT_EVALUATION_PERIOD_IN_YEARS = 50;

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
  evaluationPeriodInYears?: number;
};

type ComputeReconversionProjectImpactsResult = TResult<
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

export class ComputeReconversionProjectBreakEvenLevelUseCase implements UseCase<
  Request,
  ComputeReconversionProjectImpactsResult
> {
  constructor(
    private readonly reconversionProjectQuery: ReconversionProjectImpactsQuery,
    private readonly siteRepository: SiteImpactsQuery,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    private readonly cityStatsQuery: CityStatsProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({
    reconversionProjectId,
    evaluationPeriodInYears = DEFAULT_EVALUATION_PERIOD_IN_YEARS,
  }: Request): Promise<ComputeReconversionProjectImpactsResult> {
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

    const cityStats = await this.cityStatsQuery.getCityStats(relatedSite.address.cityCode);

    return success({
      contextData: {
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
      },
      impacts: computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: {
          ...reconversionProject,
          projectSoilsCarbonStorage,
          operationsFirstYear,
        } as ReconversionProjectImpactsWithBreakEvenLevelInput,
        relatedSite: { ...relatedSite, siteSoilsCarbonStorage },
        evaluationPeriodInYears,
        cityStats,
      }),
    });
  }
}
