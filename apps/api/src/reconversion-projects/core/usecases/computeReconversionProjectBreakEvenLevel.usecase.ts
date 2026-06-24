import type {
  GetReconversionProjectImpactsResultDto,
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
} from "shared";
import { getProjectSoilDistributionByType } from "shared";

import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { TResult } from "src/shared-kernel/result";
import { fail, success } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";
import type { CityStatsProvider } from "src/territory/core/gateways/CityStatsProvider";

import type { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import type { ReconversionProjectImpactsWithBreakEvenLevelInput } from "../model/project-impacts/break-even-level/computeImpactsWithBreakEvenLevel";
import { computeProjectImpactsWithBreakEvenLevel } from "../model/project-impacts/break-even-level/computeImpactsWithBreakEvenLevel";
import type { Schedule } from "../model/reconversionProject";

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

    return success(
      computeProjectImpactsWithBreakEvenLevel({
        reconversionProject: {
          ...reconversionProject,
          projectSoilsCarbonStorage,
          operationsFirstYear,
        } as ReconversionProjectImpactsWithBreakEvenLevelInput,
        relatedSite: { ...relatedSite, siteSoilsCarbonStorage },
        evaluationPeriodInYears,
        cityStats,
      }),
    );
  }
}
