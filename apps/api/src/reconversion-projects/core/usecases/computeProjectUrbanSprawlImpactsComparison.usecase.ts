import type {
  ReconversionProjectImpactsDataView,
  ReinstatementExpensePurpose,
  SiteImpactsDataView,
  SiteNature,
  UrbanSprawlImpactsComparisonResultDto,
} from "shared";
import {
  computeProjectReinstatementExpenses,
  getProjectSoilDistributionByType,
  typedObjectEntries,
} from "shared";
import { v4 as uuid } from "uuid";

import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import type { TResult } from "src/shared-kernel/result";
import { fail, success } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";
import { AgriculturalOperationGenerator } from "src/sites/core/models/agriculturalOperationGenerator";
import { FricheGenerator } from "src/sites/core/models/fricheGenerator";
import { NaturalAreaGenerator } from "src/sites/core/models/naturalAreaGenerator";
import type { CityRuralityQuery } from "src/territory/core/gateways/CityRuralityQuery";
import type { CityStatsProvider } from "src/territory/core/gateways/CityStatsProvider";

import type { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import type { ReconversionProjectImpactsWithBreakEvenLevelInput } from "../model/project-impacts/break-even-level/computeImpactsWithBreakEvenLevel";
import {
  computeAggregatedReconversionImpacts,
  computeBreakEvenLevel,
  computeProjectUrbanSprawlComparisonImpactsBreakdownAndEconomicBalance,
  formatStakeholders,
} from "../model/project-impacts/break-even-level/computeImpactsWithBreakEvenLevel";
import type { Schedule } from "../model/reconversionProject";

interface SiteImpactsQuery {
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

interface ReconversionProjectImpactsQuery {
  getById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsQueryResult | undefined>;
}

type Request = {
  reconversionProjectId: string;
  evaluationPeriodInYears?: number;
  comparisonSiteNature: SiteNature;
};

type ComputeProjectUrbanSprawlImpactsComparisonResultDto = TResult<
  UrbanSprawlImpactsComparisonResultDto,
  "ReconversionProjectNotFound" | "SiteNotFound" | "NoDevelopmentPlanType"
>;

export class ComputeProjectUrbanSprawlImpactsComparisonUseCase implements UseCase<
  Request,
  ComputeProjectUrbanSprawlImpactsComparisonResultDto
> {
  constructor(
    private readonly reconversionProjectQuery: ReconversionProjectImpactsQuery,
    private readonly siteRepository: SiteImpactsQuery,
    private readonly cityStatsQuery: CityStatsProvider,
    private readonly cityRuralityQuery: CityRuralityQuery,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({
    reconversionProjectId,
    evaluationPeriodInYears = 50,
    comparisonSiteNature,
  }: Request): Promise<ComputeProjectUrbanSprawlImpactsComparisonResultDto> {
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

    const [cityStats, isCityInRuralZone] = await Promise.all([
      this.cityStatsQuery.getCityStats(relatedSite.address.cityCode),
      this.cityRuralityQuery.isCityRural(relatedSite.address.cityCode),
    ]);

    const comparisonSite = (() => {
      switch (comparisonSiteNature) {
        case "FRICHE":
          return new FricheGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: cityStats.population,
            isCityInRuralZone,
            fricheActivity: "INDUSTRY",
          });
        case "AGRICULTURAL_OPERATION":
          return new AgriculturalOperationGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: cityStats.population,
            isCityInRuralZone,
            operationActivity: "POLYCULTURE_AND_LIVESTOCK",
          });
        case "NATURAL_AREA":
          return new NaturalAreaGenerator().fromSurfaceAreaAndLocalInformation({
            surfaceArea: relatedSite.surfaceArea,
            id: uuid(),
            address: relatedSite.address,
            cityPopulation: cityStats.population,
            isCityInRuralZone,
            naturalAreaType: "PRAIRIE",
          });
        case "URBAN_ZONE":
          throw new Error("Urban zone sites are not supported in urban sprawl comparison");
      }
    })();

    const comparisonSiteData = {
      ...comparisonSite,
      isExpressSite: true,
      ownerName: comparisonSite.owner.name,
      ownerStructureType: comparisonSite.owner.structureType,
      soilsDistribution: comparisonSite.soilsDistribution.toJSON(),
    };

    const soilsDistributionByType = getProjectSoilDistributionByType(
      reconversionProject.soilsDistribution,
    );

    const projectSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: relatedSite.address.cityCode,
        soilsDistribution: soilsDistributionByType,
      });

    const comparisonSiteSoilsCarbonStorage =
      await this.getCarbonStorageFromSoilDistributionService.execute({
        cityCode: comparisonSiteData.address.cityCode,
        soilsDistribution: comparisonSiteData.soilsDistribution,
      });

    const operationsFirstYear =
      reconversionProject.operationsFirstYear ?? this.dateProvider.now().getFullYear();

    const commonInputReconversionProjectData = {
      ...reconversionProject,
      projectSoilsCarbonStorage,
      operationsFirstYear,
    } as ReconversionProjectImpactsWithBreakEvenLevelInput;

    const comparisonInputReconversionProjectData: ReconversionProjectImpactsWithBreakEvenLevelInput =
      (() => {
        switch (comparisonSiteData.nature) {
          case "FRICHE": {
            return {
              ...commonInputReconversionProjectData,
              reinstatementExpenses: typedObjectEntries(
                computeProjectReinstatementExpenses(
                  relatedSite.soilsDistribution,
                  soilsDistributionByType,
                  0.75 * (comparisonSiteData.contaminatedSoilSurface ?? 0),
                ),
              )
                .filter(([, amount]) => amount && amount > 0)
                .map(([purpose, amount]) => {
                  switch (purpose) {
                    case "deimpermeabilization":
                    case "remediation":
                    case "demolition":
                      return { amount, purpose };
                    case "sustainableSoilsReinstatement":
                      return { amount, purpose: "sustainable_soils_reinstatement" };
                    case "asbestosRemoval":
                      return { amount, purpose: "asbestos_removal" };
                  }
                }) as { amount: number; purpose: ReinstatementExpensePurpose }[],
              reinstatementContractOwnerStructureType:
                commonInputReconversionProjectData.developmentPlan.developerStructureType,
              reinstatementContractOwnerName:
                commonInputReconversionProjectData.developmentPlan.developerName,
              decontaminatedSoilSurface: 0.75 * (comparisonSiteData.contaminatedSoilSurface ?? 0),
            };
          }
          case "AGRICULTURAL_OPERATION":
          case "NATURAL_AREA":
            return {
              ...commonInputReconversionProjectData,
              reinstatementExpenses: [],
              reinstatementContractOwnerName: undefined,
              reinstatementSchedule: undefined,
              decontaminatedSoilSurface: undefined,
            };
        }
      })();

    const stakeholders = formatStakeholders({
      reconversionProject: comparisonInputReconversionProjectData,
      relatedSite: comparisonSiteData,
    });

    const {
      projectOnSiteIndirectEconomicImpactsData,
      siteStatuQuoIndirectEconomicImpactsData,
      projectEconomicBalance,
      siteStatuQuoImpactMetrics,
      projectIndirectImpactMetrics,
    } = computeProjectUrbanSprawlComparisonImpactsBreakdownAndEconomicBalance({
      reconversionProject: comparisonInputReconversionProjectData,
      relatedSite: {
        ...comparisonSiteData,
        siteSoilsCarbonStorage: comparisonSiteSoilsCarbonStorage,
      },
      cityStats,
      evaluationPeriodInYears,
    });

    const { economicImpacts: aggregatedIndirectEconomicImpacts } =
      computeAggregatedReconversionImpacts({
        siteStatuQuoIndirectEconomicImpactsData,
        projectOnSiteIndirectEconomicImpactsData: projectOnSiteIndirectEconomicImpactsData,
        siteStatuQuoImpactMetrics,
        projectIndirectImpactMetrics,
      });

    const { breakEvenYear, projectionYears, breakEvenIndex, cumulativeBalanceByYear } =
      computeBreakEvenLevel({
        stakeholders,
        operationsFirstYear,
        projectEconomicBalance,
        evaluationPeriodInYears,
        aggregatedIndirectEconomicImpacts,
      });

    return success({
      stakeholders,
      operationsFirstYear,
      projectEconomicBalance,
      projectionYears,
      simulationSiteData: comparisonSiteData,
      projectOnSimulationSiteImpactsData: projectOnSiteIndirectEconomicImpactsData,
      simulationSiteStatuQuoImpactsData: siteStatuQuoIndirectEconomicImpactsData,
      breakEvenIndex: breakEvenIndex,
      breakEvenYear: breakEvenYear,
      cumulativeBalanceByYear: cumulativeBalanceByYear,
    });
  }
}
