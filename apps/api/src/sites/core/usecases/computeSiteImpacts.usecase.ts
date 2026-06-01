import { SiteImpactsDataView, GetSiteImpactsDto } from "shared";

import { GetCarbonStorageFromSoilDistributionService } from "src/reconversion-projects/core/gateways/SoilsCarbonStorageService";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { computeStatuQuoSiteImpacts } from "../models/impacts/computeStatuQuoSiteImpacts";

const DEFAULT_EVALUATION_PERIOD_IN_YEARS = 50;

export interface SiteImpactsQuery {
  getById(siteId: string): Promise<SiteImpactsDataView | undefined>;
}

type Request = {
  siteId: string;
  evaluationPeriodInYears?: number;
  operationsFirstYear?: number;
};

type ComputeSiteImpactsResult = TResult<GetSiteImpactsDto, "SiteNotFound">;

export class ComputeSiteImpactsUseCase implements UseCase<Request, ComputeSiteImpactsResult> {
  constructor(
    private readonly siteRepository: SiteImpactsQuery,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({
    siteId,
    operationsFirstYear = this.dateProvider.now().getFullYear(),
    evaluationPeriodInYears = DEFAULT_EVALUATION_PERIOD_IN_YEARS,
  }: Request): Promise<ComputeSiteImpactsResult> {
    const site = await this.siteRepository.getById(siteId);
    if (!site) return fail("SiteNotFound");

    const siteSoilsCarbonStorage = await this.getCarbonStorageFromSoilDistributionService.execute({
      cityCode: site.address.cityCode,
      soilsDistribution: site.soilsDistribution,
    });

    return success(
      computeStatuQuoSiteImpacts({
        site,
        siteSoilsCarbonStorage,
        operationsFirstYear,
        evaluationPeriodInYears,
      }),
    );
  }
}
