import {
  DevelopmentPlanFeatures,
  ReconversionProjectImpactsBreakEvenLevel,
  ReconversionProjectImpactsDataView,
  SiteImpactsDataView,
  getProjectSoilDistributionByType,
  isSameStakeholders,
  isStakeholderLocalAuthority,
  roundToInteger,
  sumListWithKey,
} from "shared";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { CityStatsProvider } from "../gateways/CityStatsProvider";
import { GetCarbonStorageFromSoilDistributionService } from "../gateways/SoilsCarbonStorageService";
import { getProjectDevelopmentEconomicBalance } from "../model/project-impacts/break-even-level/projectDevelopmentEconomicBalance";
import { getProjectIndirectsEconomicImpacts } from "../model/project-impacts/break-even-level/projectIndirectEconomicImpacts";
import { getProjectOperatingEconomicBalance } from "../model/project-impacts/break-even-level/projectOperatingEconomicBalance";
import { Schedule } from "../model/reconversionProject";
import { SumOnEvolutionPeriodService } from "../model/sum-on-evolution-period/SumOnEvolutionPeriodService";

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
  ReconversionProjectImpactsBreakEvenLevel,
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

    // Build stakeholders
    const stakeholders = {
      current: {
        owner: {
          structureType: relatedSite.ownerStructureType,
          structureName: relatedSite.ownerName,
        },
        operator: {
          structureType: relatedSite.ownerStructureType,
          structureName: relatedSite.ownerName,
        },
        tenant: {
          structureType: relatedSite.tenantStructureType,
          structureName: relatedSite.tenantName,
        },
      },
      future: {
        operator: {
          structureType: reconversionProject.futureOperatorStructureType,
          structureName: reconversionProject.futureOperatorName,
        },
        owner: {
          structureType: reconversionProject.futureSiteOwnerStructureType,
          structureName: reconversionProject.futureSiteOwnerName,
        },
      },
      project: {
        developer: {
          structureType: reconversionProject.developmentPlan.developerStructureType,
          structureName: reconversionProject.developmentPlan.developerName,
        },
        reinstatementContractOwner: {
          structureType: reconversionProject.reinstatementContractOwnerStructureType,
          structureName: reconversionProject.reinstatementContractOwnerName,
        },
      },
    } as ReconversionProjectImpactsBreakEvenLevel["stakeholders"];

    const developmentEconomicBalance = getProjectDevelopmentEconomicBalance({
      developmentPlanType: reconversionProject.developmentPlan.type,
      stakeholders,
      costs: {
        reinstatementCosts: reconversionProject.reinstatementExpenses,
        developmentPlanInstallationCosts: reconversionProject.developmentPlan.installationCosts,
        sitePurchaseTotalAmount: reconversionProject.sitePurchaseTotalAmount,
      },
      revenues: {
        financialAssistanceRevenues: reconversionProject.financialAssistanceRevenues,
        buildingsResaleSellingPrice: reconversionProject.buildingsResaleSellingPrice,
        siteResaleSellingPrice: reconversionProject.siteResaleSellingPrice,
      },
    });

    const sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears,
      operationsFirstYear,
    });

    // Compute indirect socio economic impacts
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

    const indirectEconomicImpacts = getProjectIndirectsEconomicImpacts({
      reconversionProject: {
        ...reconversionProject,
        hasSiteOwnerChange: reconversionProject.futureSiteOwnerStructureType !== undefined,
        developmentPlan: {
          type: reconversionProject.developmentPlan.type,
          features: reconversionProject.developmentPlan.features,
        } as DevelopmentPlanFeatures,
        operationsFirstYear,
        soilsCarbonStorage: projectSoilsCarbonStorage,
      },
      relatedSite: { ...relatedSite, soilsCarbonStorage: siteSoilsCarbonStorage },
      sumOnEvolutionPeriodService,
      siteCityData: {
        cityPropertyValuePerSquareMeter: cityStats.propertyValueMedianPricePerSquareMeters,
        citySquareMetersSurfaceArea: cityStats.surfaceAreaSquareMeters,
        cityPopulation: cityStats.population,
      },
    });

    // Compute operating economic balance
    const operatingEconomicBalance = getProjectOperatingEconomicBalance({
      yearlyProjectedCosts: reconversionProject.yearlyProjectedExpenses,
      yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues,
      sumOnEvolutionPeriodService,
    });

    const totalOperatingEconomicBalance = sumListWithKey(operatingEconomicBalance, "total");

    // Compute break even year
    const isFutureOperatorLocalAuthority =
      !!stakeholders.future.operator && isStakeholderLocalAuthority(stakeholders.future.operator);

    const isFutureOperatorSameAsDeveloper =
      !!stakeholders.future.operator &&
      isSameStakeholders(stakeholders.project.developer, stakeholders.future.operator);

    const shouldCountOperatingEconomicBalance =
      isFutureOperatorLocalAuthority || isFutureOperatorSameAsDeveloper;

    const monetaryImpactsList = shouldCountOperatingEconomicBalance
      ? [...indirectEconomicImpacts.details, ...operatingEconomicBalance]
      : indirectEconomicImpacts.details;

    const cumulativeBalanceByYear = monetaryImpactsList
      .reduce<number[]>((total, impact) => {
        impact.cumulativeByYear.forEach((value, index) => {
          total[index] = (total[index] ?? 0) + value;
        });
        return total;
      }, [])
      .map((val) => val + developmentEconomicBalance.total);

    const projectionYears = cumulativeBalanceByYear.map(
      (_, index) => `${operationsFirstYear + index}`,
    );
    const breakEvenIndex = cumulativeBalanceByYear.findIndex(
      (v, i, arr) => v >= 0 && (i === 0 || (arr?.[i - 1] ?? 0) < 0),
    );

    const breakEvenYear = projectionYears[breakEvenIndex];

    // Assign operatingEconomicBalance to economicBalance or indirectEconomicImpacts
    // depending on the future operator type
    const economicBalance =
      isFutureOperatorSameAsDeveloper && !isFutureOperatorLocalAuthority
        ? {
            total: roundToInteger(developmentEconomicBalance.total + totalOperatingEconomicBalance),
            details: [...developmentEconomicBalance.details, ...operatingEconomicBalance],
          }
        : developmentEconomicBalance;

    const indirectImpacts = isFutureOperatorLocalAuthority
      ? {
          total: roundToInteger(indirectEconomicImpacts.total + totalOperatingEconomicBalance),
          details: [...indirectEconomicImpacts.details, ...operatingEconomicBalance],
        }
      : indirectEconomicImpacts;

    return success({
      breakEvenYear,
      cumulativeBalanceByYear,
      projectionYears,
      economicBalance,
      indirectEconomicImpacts: indirectImpacts,
      operationsFirstYear,
      stakeholders,
    });
  }
}
