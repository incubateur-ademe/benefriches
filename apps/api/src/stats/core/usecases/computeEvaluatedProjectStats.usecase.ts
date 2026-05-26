import {
  getProjectSoilDistributionByType,
  AgriculturalOperationActivity,
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  FricheActivity,
  NaturalAreaType,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
  SoilType,
  SpaceCategory,
  BuildingsConstructionExpense,
  sumListWithKey,
  sumList,
  roundToInteger,
  roundTo2Digits,
} from "shared";

import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import {
  computeProjectImpactsWithBreakEvenLevel,
  ReconversionProjectImpactsWithBreakEvenLevelInput,
} from "src/reconversion-projects/core/model/project-impacts/break-even-level/computeImpactsWithBreakEvenLevel";
import { DevelopmentPlan } from "src/reconversion-projects/core/model/reconversionProject";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { fail, success, TResult } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

const DEFAULT_EVALUATION_PERIOD_IN_YEARS = 50;

export type EvaluatedProjectsImpactsStatsResult = {
  id: string;
  isExpressProject: boolean;

  stakeholders: {
    siteOwner: { name?: string; structureType: string };
    siteTenant?: { name?: string; structureType: string };
    futureOperator?: { name?: string; structureType: string };
    futureSiteOwner?: { name?: string; structureType: string };
    reinstatementContractOwner?: { name?: string; structureType: string };
    developer: { name?: string; structureType: string };
  };

  projectDevelopment: {
    expenses: {
      reinstatement: ReinstatementExpense[];
      installationCosts: DevelopmentPlanInstallationExpenses[];
      buildingConstructionCosts: BuildingsConstructionExpense[];
      sitePurchase?: { totalAmount: number; propertyTransferDutiesAmount?: number };
      recurringYearly: RecurringExpense[];
    };
    revenues: {
      recurringYearly: RecurringRevenue[];
      siteResaleSellingPrice?: number;
      siteResaleExpectedPropertyTransferDutiesAmount?: number;
      buildingsResaleExpectedPropertyTransferDutiesAmount?: number;
      buildingsResaleSellingPrice?: number;
      financialAssistanceRevenues: FinancialAssistanceRevenue[];
    };
    schedules: {
      reinstatement?: { startDate: Date; endDate: Date };
      installation?: { startDate: Date; endDate: Date };
    };
    developmentPlan?: {
      type: DevelopmentPlan["type"];
      features?: DevelopmentPlan["features"];
    };
    projectedSoilsDistribution: {
      soilType: SoilType;
      surfaceArea: number;
      spaceCategory?: SpaceCategory;
    }[];
    operationsFirstYear?: number;
    decontaminatedSoilSurface?: number;
  };

  relatedSite: {
    id: string;
    nature: SiteNature;
    fricheActivity?: FricheActivity;
    agriculturalOperationActivity?: AgriculturalOperationActivity;
    naturalAreaType?: NaturalAreaType;
    isSiteOperated?: boolean;
    isExpressSite: boolean;
    siteCityCode?: string;
    surfaceArea: number;
    contaminatedSoilSurface?: number;
    accidents?: {
      deaths?: number;
      severeInjuries?: number;
      minorInjuries?: number;
    };
    currentSoilsDistribution: Record<string, number>;
    currentYearlyExpenses: SiteYearlyExpense[];
    currentYearlyIncomes: SiteYearlyIncome[];
    cityStats?: {
      surfaceAreaSquareMeters?: number;
      population: number;
      propertyValueMedianPricePerSquareMeters?: number;
    };
  };
};
export interface EvaluatedProjectsImpactsStatsQuery {
  getManyByReconversionProjectIds(
    reconversionProjectIds: string[],
  ): Promise<EvaluatedProjectsImpactsStatsResult[]>;
}

type Request = {
  reconversionProjectIds: string[];
};

type ComputeEvaluatedProjectStatsResult = TResult<
  {
    averageBreakEvenIndex: number;
    projectWithBreakEvenIndex: number;
    projectWithoutBreakEvenIndex: number;
    totalProjects: number;
    totalFricheProject: number;
    totalInactionCosts: number;
  },
  "NoProjectIdsProvided"
>;

export class ComputeEvaluatedProjectStatsUseCase implements UseCase<
  Request,
  ComputeEvaluatedProjectStatsResult
> {
  constructor(
    private readonly evaluatedProjectsImpactsStatsQuery: EvaluatedProjectsImpactsStatsQuery,
    private readonly getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute({ reconversionProjectIds }: Request): Promise<ComputeEvaluatedProjectStatsResult> {
    if (reconversionProjectIds.length === 0) {
      return fail("NoProjectIdsProvided");
    }
    const reconversionProjects =
      await this.evaluatedProjectsImpactsStatsQuery.getManyByReconversionProjectIds(
        reconversionProjectIds,
      );

    const defaultOperationFirstYear = this.dateProvider.now().getFullYear();

    const eligibleProjects = reconversionProjects.filter(
      ({ projectDevelopment, relatedSite }) =>
        projectDevelopment.developmentPlan?.type &&
        projectDevelopment.developmentPlan?.features &&
        relatedSite.siteCityCode,
    );

    const carbonStorages = await Promise.all(
      eligibleProjects.map(({ projectDevelopment, relatedSite }) =>
        Promise.all([
          this.getCarbonStorageFromSoilDistributionService.execute({
            cityCode: relatedSite.siteCityCode ?? "",
            soilsDistribution: relatedSite.currentSoilsDistribution,
          }),
          this.getCarbonStorageFromSoilDistributionService.execute({
            cityCode: relatedSite.siteCityCode ?? "",
            soilsDistribution: getProjectSoilDistributionByType(
              projectDevelopment.projectedSoilsDistribution,
            ),
          }),
        ]),
      ),
    );

    const breakEvenIndexes: number[] = [];

    const stats = {
      projectWithBreakEvenIndex: 0,
      projectWithoutBreakEvenIndex: 0,
      totalProjects: 0,
      totalFricheProject: 0,
      totalInactionCosts: 0,
      totalIndirectEconomicImpacts: 0,
      totalEconomicBalance: 0,
    };

    for (const [
      index,
      { projectDevelopment, relatedSite, isExpressProject, stakeholders },
    ] of eligibleProjects.entries()) {
      const [siteSoilsCarbonStorage, projectSoilsCarbonStorage] = carbonStorages[index] ?? [];

      const operationsFirstYear =
        projectDevelopment.operationsFirstYear ?? defaultOperationFirstYear;

      const { breakEvenIndex, indirectEconomicImpacts, economicBalance } =
        computeProjectImpactsWithBreakEvenLevel({
          reconversionProject: {
            name: "",
            relatedSiteId: relatedSite.id,
            soilsDistribution: projectDevelopment.projectedSoilsDistribution,
            isExpressProject: isExpressProject,
            conversionSchedule: projectDevelopment.schedules.installation,
            reinstatementSchedule: projectDevelopment.schedules.reinstatement,
            futureOperatorStructureType: stakeholders.futureOperator?.structureType,
            futureOperatorName: stakeholders.futureOperator?.name,
            futureSiteOwnerName: stakeholders.futureSiteOwner?.name,
            futureSiteOwnerStructureType: stakeholders.futureSiteOwner?.structureType,
            reinstatementContractOwnerName: stakeholders.reinstatementContractOwner?.name,
            reinstatementContractOwnerStructureType:
              stakeholders.reinstatementContractOwner?.structureType,
            sitePurchaseTotalAmount: projectDevelopment.expenses.sitePurchase?.totalAmount,
            sitePurchasePropertyTransferDutiesAmount:
              projectDevelopment.expenses.sitePurchase?.propertyTransferDutiesAmount,
            reinstatementExpenses: projectDevelopment.expenses.reinstatement,
            buildingsConstructionAndRehabilitationExpenses:
              projectDevelopment.expenses.buildingConstructionCosts,
            financialAssistanceRevenues: projectDevelopment.revenues.financialAssistanceRevenues,
            yearlyProjectedExpenses: projectDevelopment.expenses.recurringYearly,
            yearlyProjectedRevenues: projectDevelopment.revenues.recurringYearly,
            developmentPlan: {
              installationCosts: projectDevelopment.expenses.installationCosts,
              installationSchedule: projectDevelopment.schedules.installation,
              developerName: stakeholders.developer?.name,
              developerStructureType: stakeholders.developer?.structureType,
              type: projectDevelopment.developmentPlan?.type,
              features: projectDevelopment.developmentPlan?.features,
            },
            operationsFirstYear,
            siteResaleSellingPrice: projectDevelopment.revenues.siteResaleSellingPrice,
            buildingsResaleSellingPrice: projectDevelopment.revenues.buildingsResaleSellingPrice,
            siteResaleExpectedPropertyTransferDutiesAmount:
              projectDevelopment.revenues.siteResaleExpectedPropertyTransferDutiesAmount,
            buildingsResaleExpectedPropertyTransferDutiesAmount:
              projectDevelopment.revenues.buildingsResaleExpectedPropertyTransferDutiesAmount,
            decontaminatedSoilSurface: projectDevelopment.decontaminatedSoilSurface,
            projectSoilsCarbonStorage,
          } as ReconversionProjectImpactsWithBreakEvenLevelInput,
          relatedSite: {
            ...relatedSite,
            name: "",
            ownerStructureType: stakeholders.siteOwner.structureType,
            ownerName: stakeholders.siteOwner.name ?? "",
            tenantName: stakeholders.siteTenant?.name,
            tenantStructureType: stakeholders.siteTenant?.structureType,
            siteSoilsCarbonStorage,
            yearlyExpenses: relatedSite.currentYearlyExpenses,
            yearlyIncomes: relatedSite.currentYearlyIncomes,
            soilsDistribution: relatedSite.currentSoilsDistribution,
          },
          evaluationPeriodInYears: DEFAULT_EVALUATION_PERIOD_IN_YEARS,
          cityStats: {
            population: relatedSite.cityStats?.population ?? 0,
            surfaceAreaSquareMeters: relatedSite.cityStats?.surfaceAreaSquareMeters ?? 0,
            propertyValueMedianPricePerSquareMeters:
              relatedSite.cityStats?.propertyValueMedianPricePerSquareMeters ?? 0,
            name: "",
            accuracy: "city",
          },
        });

      if (breakEvenIndex !== undefined) {
        stats.projectWithBreakEvenIndex += 1;
        breakEvenIndexes.push(breakEvenIndex);
      } else {
        stats.projectWithoutBreakEvenIndex += 1;
      }
      stats.totalProjects += 1;
      stats.totalEconomicBalance += economicBalance.total;
      stats.totalIndirectEconomicImpacts += indirectEconomicImpacts.total;

      if (relatedSite.nature === "FRICHE") {
        const avoidedFricheCosts = sumListWithKey(
          indirectEconomicImpacts.details.filter(
            ({ name }) =>
              name === "avoidedFricheMaintenanceAndSecuringCostsForOwner" ||
              name === "avoidedFricheMaintenanceAndSecuringCostsForTenant",
          ),
          "total",
        );

        stats.totalInactionCosts += avoidedFricheCosts;

        if (avoidedFricheCosts > 0) {
          stats.totalFricheProject += 1;
        }
      }
    }

    return success({
      ...stats,
      totalInactionCosts: roundToInteger(stats.totalInactionCosts),
      averageBreakEvenIndex: roundTo2Digits(sumList(breakEvenIndexes) / breakEvenIndexes.length),
    });
  }
}
