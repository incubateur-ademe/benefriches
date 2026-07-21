import { GetReconversionProjectImpactsResultDto } from "../api-dtos";
import { roundToInteger, sumList, sumListWithKey } from "../services";
import { SiteStatuQuoImpactMetric, SiteStatuQuoImpacts } from "../site";
import { computeStatuQuoSiteImpacts } from "../site/statu-quo-impacts/computeStatuQuoSiteImpacts";
import { SiteImpactsDataView } from "../site/statu-quo-impacts/siteImpactsDataView.types";
import { SoilsCarbonStorage } from "../soils";
import { SumOnEvolutionPeriodService } from "../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "../sum-on-evolution-period/computeCumulativeByYear";
import { getProjectDevelopmentEconomicBalance } from "./economic-balance/projectDevelopmentEconomicBalance";
import { getProjectOperatingEconomicBalance } from "./economic-balance/projectOperatingEconomicBalance";
import { Schedule } from "./indirect-impacts/fullTimeJobs.helper";
import { getProjectMetricsAndEconomicImpacts } from "./indirect-impacts/projectIndirectImpacts";
import { computeAvoidedRoadsAndUtilitiesConstructionExpensesWithFriche } from "./indirect-impacts/urban-project/roads-and-utilities-expenses/roadsAndUtilitiesContruction";
import { computeAvoidedWithFricheYearlyRoadsAndUtilitiesMaintenanceExpenses } from "./indirect-impacts/urban-project/roads-and-utilities-expenses/roadsAndUtilitiesExpensesImpact";
import {
  AggregatedProjectImpactMetric,
  AggregatedReconversionIndirectEconomicImpactsDataView,
  AggregatedReconversionProjectOnSiteImpactItemView,
  IndirectEconomicImpactDataView,
  isSameStakeholders,
  isStakeholderLocalAuthority,
  ProjectEconomicBalance,
  ProjectOnSiteImpactMetric,
  ProjectOperatingEconomicBalanceItem,
  ReconversionProjectOnSiteIndirectEconomicImpactsDataView,
  UrbanSprawlComparisonIndirectEconomicImpactItemView,
  UrbanSprawlComparisonProjectImpactsDataView,
} from "./projectImpacts.types";
import { ReconversionProjectImpactsDataView } from "./projectImpactsDataView.types";

export type ApiReconversionProjectImpactsDataView = ReconversionProjectImpactsDataView<Schedule>;

export type ReconversionProjectImpactsWithBreakEvenLevelInput =
  ApiReconversionProjectImpactsDataView & {
    operationsFirstYear: number;
    projectSoilsCarbonStorage?: SoilsCarbonStorage;
  };
type SiteInputData = Omit<SiteImpactsDataView, "address"> & {
  siteSoilsCarbonStorage?: SoilsCarbonStorage;
};

export const formatStakeholders = ({
  relatedSite,
  reconversionProject,
}: {
  reconversionProject: ReconversionProjectImpactsWithBreakEvenLevelInput;
  relatedSite: SiteInputData;
}): GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"] =>
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  ({
    current: {
      owner: {
        structureType: relatedSite.ownerStructureType,
        structureName: relatedSite.ownerName,
      },
      operator: relatedSite.isSiteOperated
        ? relatedSite.tenantStructureType
          ? {
              structureType: relatedSite.tenantStructureType,
              structureName: relatedSite.tenantName,
            }
          : {
              structureType: relatedSite.ownerStructureType,
              structureName: relatedSite.ownerName,
            }
        : undefined,
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
  }) as GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"];

export const computeBreakEvenLevel = ({
  operationsFirstYear,
  evaluationPeriodInYears,
  aggregatedIndirectEconomicImpacts,
  projectEconomicBalance,
}: {
  stakeholders: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"];
  operationsFirstYear: number;
  evaluationPeriodInYears: number;
  aggregatedIndirectEconomicImpacts: IndirectEconomicImpactDataView["details"];
  projectEconomicBalance: GetReconversionProjectImpactsResultDto["impacts"]["projectEconomicBalance"];
}) => {
  const cumulativeEconomicBalanceByYear = projectEconomicBalance.details.reduce<number[]>(
    (total, impact) => {
      if (impact.name === "projectOperatingEconomicBalance") {
        impact.cumulativeByYear.forEach((value, index) => {
          total[index] = (total[index] ?? 0) + value;
        });
        return total;
      }
      return total.map((value) => value + impact.total);
    },
    Array(evaluationPeriodInYears).fill(0),
  );

  const cumulativeBalanceByYear = aggregatedIndirectEconomicImpacts.reduce<number[]>(
    (total, impact) => {
      impact.cumulativeByYear.forEach((value, index) => {
        total[index] = (total[index] ?? 0) + value;
      });
      return total;
    },
    cumulativeEconomicBalanceByYear,
  );

  const projectionYears = cumulativeBalanceByYear.map(
    (_, index) => `${operationsFirstYear + index}`,
  );
  const breakEvenIndex = cumulativeBalanceByYear.findIndex(
    (v, i, arr) => v >= 0 && (i === 0 || (arr?.[i - 1] ?? 0) < 0),
  );

  return {
    breakEvenYear: projectionYears[breakEvenIndex],
    breakEvenIndex: breakEvenIndex === -1 ? undefined : breakEvenIndex,
    projectionYears,
    cumulativeBalanceByYear,
  };
};

const handleRoadsAndUtilitiesExpenses = ({
  isFriche,
  siteSurfaceArea,
  projectOnSiteIndirectEconomicImpactsData,
  sumOnEvolutionPeriodService,
}: {
  projectOnSiteIndirectEconomicImpactsData: ReconversionProjectOnSiteIndirectEconomicImpactsDataView["details"];
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  isFriche: boolean;
  siteSurfaceArea: number;
}): (
  | UrbanSprawlComparisonIndirectEconomicImpactItemView
  | ProjectOperatingEconomicBalanceItem
)[] => {
  const projectOnSimulationSiteImpactsDataDetails = projectOnSiteIndirectEconomicImpactsData.filter(
    (item) => item.name !== "fricheRoadsAndUtilitiesExpenses",
  );

  // Handle roadsAndUtilitiesExpenses special case
  const coefficient = isFriche ? 1 : -1;
  const avoidedRoadsAndUtilitiesConstructionExpenses =
    computeAvoidedRoadsAndUtilitiesConstructionExpensesWithFriche(siteSurfaceArea) * coefficient;
  const avoidedRoadsAndUtilitiesMaintenance =
    computeAvoidedWithFricheYearlyRoadsAndUtilitiesMaintenanceExpenses(siteSurfaceArea) *
    coefficient;

  const avoidedRoadsAndUtilitiesMaintenanceDetailsByYear =
    sumOnEvolutionPeriodService.getWeightedYearlyValues(
      avoidedRoadsAndUtilitiesMaintenance,
      ["discount"],
      {
        startYearIndex: 1,
      },
    );

  const avoidedRoadsAndUtilitiesContructionDetailsByYear =
    sumOnEvolutionPeriodService.getWeightedYearlyValues(
      avoidedRoadsAndUtilitiesConstructionExpenses,
      [],
      { startYearIndex: 0, endYearIndex: 1 },
    );

  return [
    ...projectOnSimulationSiteImpactsDataDetails,
    {
      name: "avoidedRoadsAndUtilitiesConstructionExpenses",
      total: sumList(avoidedRoadsAndUtilitiesContructionDetailsByYear),
      detailsByYear: avoidedRoadsAndUtilitiesContructionDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(avoidedRoadsAndUtilitiesContructionDetailsByYear),
    },
    {
      name: "avoidedRoadsAndUtilitiesMaintenanceExpenses",
      total: sumList(avoidedRoadsAndUtilitiesMaintenanceDetailsByYear),
      detailsByYear: avoidedRoadsAndUtilitiesMaintenanceDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(avoidedRoadsAndUtilitiesMaintenanceDetailsByYear),
    },
  ];
};

export const computeProjectImpactsBreakdownAndEconomicBalance = ({
  reconversionProject,
  relatedSite,
  cityStats,
  evaluationPeriodInYears,
}: {
  reconversionProject: ReconversionProjectImpactsWithBreakEvenLevelInput;
  relatedSite: SiteInputData;
  cityStats: {
    propertyValueMedianPricePerSquareMeters: number;
    population: number;
    surfaceAreaSquareMeters: number;
  };
  evaluationPeriodInYears: number;
}): {
  projectEconomicBalance: ProjectEconomicBalance;
  projectIndirectImpactMetrics: ProjectOnSiteImpactMetric[];
  siteStatuQuoIndirectEconomicImpactsData: SiteStatuQuoImpacts["economicImpacts"];
  siteStatuQuoImpactMetrics: SiteStatuQuoImpacts["impactMetrics"];
  projectOnSiteIndirectEconomicImpactsData: ReconversionProjectOnSiteIndirectEconomicImpactsDataView;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
} => {
  const { operationsFirstYear } = reconversionProject;

  const stakeholders = formatStakeholders({ reconversionProject, relatedSite });

  const developmentEconomicBalance = getProjectDevelopmentEconomicBalance({
    developmentPlanType: reconversionProject.developmentPlan.type,
    stakeholders,
    costs: {
      reinstatementCosts: reconversionProject.reinstatementExpenses,
      developmentPlanInstallationCosts: reconversionProject.developmentPlan.installationCosts,
      sitePurchaseTotalAmount: reconversionProject.sitePurchaseTotalAmount,
      buildingsConstructionAndRehabilitationCosts:
        reconversionProject.buildingsConstructionAndRehabilitationExpenses,
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

  // Compute operating economic balance
  const operatingEconomicBalance = getProjectOperatingEconomicBalance({
    yearlyProjectedCosts: reconversionProject.yearlyProjectedExpenses,
    yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues,
    sumOnEvolutionPeriodService,
  });

  const totalOperatingEconomicBalance = sumListWithKey(operatingEconomicBalance, "total");

  const developmentPlan =
    reconversionProject.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
      ? {
          type: reconversionProject.developmentPlan.type,
          features: reconversionProject.developmentPlan.features,
        }
      : {
          type: reconversionProject.developmentPlan.type,
          features: reconversionProject.developmentPlan.features,
        };

  // Compute indirect impacts
  const {
    impactMetrics: projectIndirectImpactMetrics,
    economicImpacts: projectIndirectSocioEconomicImpacts,
  } = getProjectMetricsAndEconomicImpacts({
    reconversionProject: {
      ...reconversionProject,
      conversionSchedule: reconversionProject.developmentPlan.installationSchedule,
      developmentPlan: developmentPlan,
      operationsFirstYear,
      soilsCarbonStorage: reconversionProject.projectSoilsCarbonStorage,
    },
    relatedSite: { ...relatedSite, soilsCarbonStorage: relatedSite.siteSoilsCarbonStorage },
    sumOnEvolutionPeriodService,
    siteCityData: {
      cityPropertyValuePerSquareMeter: cityStats.propertyValueMedianPricePerSquareMeters,
      citySquareMetersSurfaceArea: cityStats.surfaceAreaSquareMeters,
      cityPopulation: cityStats.population,
    },
  });

  const {
    economicImpacts: siteStatuQuoIndirectEconomicImpactsData,
    impactMetrics: siteStatuQuoImpactMetrics,
  } = computeStatuQuoSiteImpacts({
    site: relatedSite,
    siteSoilsCarbonStorage: relatedSite.siteSoilsCarbonStorage,
    operationsFirstYear,
    evaluationPeriodInYears,
  });

  const isFutureOperatorLocalAuthority =
    !!stakeholders.future.operator && isStakeholderLocalAuthority(stakeholders.future.operator);

  const isFutureOperatorSameAsDeveloper =
    !!stakeholders.future.operator &&
    isSameStakeholders(stakeholders.project.developer, stakeholders.future.operator);

  const projectIndirectEconomicImpacts = isFutureOperatorLocalAuthority
    ? [...projectIndirectSocioEconomicImpacts.details, ...operatingEconomicBalance]
    : projectIndirectSocioEconomicImpacts.details;

  // Assign operatingEconomicBalance to economicBalance or indirectEconomicImpacts
  // depending on the future operator type
  const economicBalance =
    isFutureOperatorSameAsDeveloper && !isFutureOperatorLocalAuthority
      ? {
          total: roundToInteger(developmentEconomicBalance.total + totalOperatingEconomicBalance),
          details: [...developmentEconomicBalance.details, ...operatingEconomicBalance],
        }
      : developmentEconomicBalance;

  return {
    projectEconomicBalance: economicBalance,
    siteStatuQuoIndirectEconomicImpactsData,
    siteStatuQuoImpactMetrics,
    projectOnSiteIndirectEconomicImpactsData: {
      total: sumListWithKey(projectIndirectEconomicImpacts, "total"),
      details: projectIndirectEconomicImpacts,
    },
    projectIndirectImpactMetrics,
    sumOnEvolutionPeriodService,
  };
};

export const computeProjectUrbanSprawlComparisonImpactsBreakdownAndEconomicBalance = ({
  reconversionProject,
  relatedSite,
  cityStats,
  evaluationPeriodInYears,
}: {
  reconversionProject: ReconversionProjectImpactsWithBreakEvenLevelInput;
  relatedSite: SiteInputData;
  cityStats: {
    propertyValueMedianPricePerSquareMeters: number;
    population: number;
    surfaceAreaSquareMeters: number;
  };
  evaluationPeriodInYears: number;
}): {
  projectEconomicBalance: ProjectEconomicBalance;
  siteStatuQuoIndirectEconomicImpactsData: SiteStatuQuoImpacts["economicImpacts"];
  projectOnSiteIndirectEconomicImpactsData: UrbanSprawlComparisonProjectImpactsDataView;
  siteStatuQuoImpactMetrics: SiteStatuQuoImpactMetric[];
  projectIndirectImpactMetrics: ProjectOnSiteImpactMetric[];
} => {
  const {
    sumOnEvolutionPeriodService,
    projectOnSiteIndirectEconomicImpactsData,
    projectEconomicBalance,
    siteStatuQuoIndirectEconomicImpactsData,
    siteStatuQuoImpactMetrics,
    projectIndirectImpactMetrics,
  } = computeProjectImpactsBreakdownAndEconomicBalance({
    reconversionProject,
    relatedSite,
    cityStats,
    evaluationPeriodInYears,
  });

  const urbanSprawlProjectIndirectEconomicImpactsData = handleRoadsAndUtilitiesExpenses({
    sumOnEvolutionPeriodService,
    isFriche: relatedSite.nature === "FRICHE",
    siteSurfaceArea: relatedSite.surfaceArea,
    projectOnSiteIndirectEconomicImpactsData: projectOnSiteIndirectEconomicImpactsData.details,
  });
  return {
    projectEconomicBalance,
    siteStatuQuoImpactMetrics,
    projectIndirectImpactMetrics,
    siteStatuQuoIndirectEconomicImpactsData,
    projectOnSiteIndirectEconomicImpactsData: {
      total: sumListWithKey(urbanSprawlProjectIndirectEconomicImpactsData, "total"),
      details: urbanSprawlProjectIndirectEconomicImpactsData,
    },
  };
};

type ProjectOnSiteIndirectEconomicImpactsData =
  | UrbanSprawlComparisonProjectImpactsDataView
  | ReconversionProjectOnSiteIndirectEconomicImpactsDataView;

type ComputeAggregatedReconversionImpactsResult<
  T extends ProjectOnSiteIndirectEconomicImpactsData,
> = {
  input: {
    siteStatuQuoIndirectEconomicImpactsData: SiteStatuQuoImpacts["economicImpacts"];
    projectOnSiteIndirectEconomicImpactsData: T;
    projectIndirectImpactMetrics: ProjectOnSiteImpactMetric[];
    siteStatuQuoImpactMetrics: SiteStatuQuoImpacts["impactMetrics"];
  };
  result: {
    economicImpacts: (
      | AggregatedReconversionIndirectEconomicImpactsDataView["details"][number]
      | T["details"][number]
    )[];
    impactMetrics: AggregatedProjectImpactMetric[];
  };
};
export const computeAggregatedReconversionImpacts = <
  T extends ProjectOnSiteIndirectEconomicImpactsData =
    ReconversionProjectOnSiteIndirectEconomicImpactsDataView,
>({
  siteStatuQuoIndirectEconomicImpactsData,
  projectOnSiteIndirectEconomicImpactsData,
  projectIndirectImpactMetrics,
  siteStatuQuoImpactMetrics,
}: ComputeAggregatedReconversionImpactsResult<T>["input"]): ComputeAggregatedReconversionImpactsResult<T>["result"] => {
  const siteReconversionIndirectEconomicImpacts: ComputeAggregatedReconversionImpactsResult<T>["result"]["economicImpacts"] =
    [];
  const siteReconversionIndirectImpactMetrics: ComputeAggregatedReconversionImpactsResult<T>["result"]["impactMetrics"] =
    [];

  const operatingEconomicBalance = siteStatuQuoIndirectEconomicImpactsData.details.filter(
    ({ name }) => name === "operatingEconomicBalance",
  );

  if (operatingEconomicBalance.length > 0) {
    const cumulativeBalanceByYear = operatingEconomicBalance.reduce<number[]>((total, impact) => {
      impact.cumulativeByYear.forEach((value, index) => {
        total[index] = (total[index] ?? 0) + value * -1;
      });
      return total;
    }, []);
    const detailsByYear = operatingEconomicBalance.reduce<number[]>((total, impact) => {
      impact.detailsByYear.forEach((value, index) => {
        total[index] = (total[index] ?? 0) + value * -1;
      });
      return total;
    }, []);

    siteReconversionIndirectEconomicImpacts.push({
      name: "previousSiteOperationBenefitLoss",
      detailsByYear,
      cumulativeByYear: cumulativeBalanceByYear,
      total: sumList(detailsByYear),
    });
  }

  siteReconversionIndirectEconomicImpacts.push(
    ...siteStatuQuoIndirectEconomicImpactsData.details.reduce<
      AggregatedReconversionProjectOnSiteImpactItemView[]
    >((siteReconversionIndirectImpacts, item) => {
      if (item.name === "rentalIncome") {
        return siteReconversionIndirectImpacts.concat({
          name: "oldRentalIncomeLoss",
          detailsByYear: item.detailsByYear.map((amount) => -amount),
          cumulativeByYear: item.cumulativeByYear.map((amount) => -amount),
          total: -item.total,
        });
      }

      if (item.name === "fricheMaintenanceAndSecuringCostsForOwner") {
        return siteReconversionIndirectImpacts.concat({
          name: "avoidedFricheMaintenanceAndSecuringCostsForOwner",
          detailsByYear: item.detailsByYear.map((amount) => -amount),
          cumulativeByYear: item.cumulativeByYear.map((amount) => -amount),
          total: -item.total,
          details: item.details,
        });
      }

      if (item.name === "fricheMaintenanceAndSecuringCostsForTenant") {
        return siteReconversionIndirectImpacts.concat({
          ...item,
          name: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
          detailsByYear: item.detailsByYear.map((amount) => -amount),
          cumulativeByYear: item.cumulativeByYear.map((amount) => -amount),
          total: -item.total,
          details: item.details,
        });
      }

      return siteReconversionIndirectImpacts;
    }, []),
  );

  siteReconversionIndirectImpactMetrics.push(
    ...siteStatuQuoImpactMetrics.reduce<AggregatedProjectImpactMetric[]>(
      (siteReconversionImpactMetrics, item) => {
        if (item.name === "fricheAccidentsDeaths") {
          return siteReconversionImpactMetrics.concat({
            name: "avoidedFricheAccidentsDeaths",
            total: item.total,
          });
        }

        if (item.name === "fricheAccidentsMinorInjuries") {
          return siteReconversionImpactMetrics.concat({
            name: "avoidedFricheAccidentsMinorInjuries",
            total: item.total,
          });
        }

        if (item.name === "fricheAccidentsSevereInjuries") {
          return siteReconversionImpactMetrics.concat({
            name: "avoidedFricheAccidentsSevereInjuries",
            total: item.total,
          });
        }

        if (item.name === "operationsFullTimeJobs") {
          return siteReconversionImpactMetrics.concat({
            name: "oldOperationsFullTimeJobsLoss",
            total: -item.total,
          });
        }

        return siteReconversionImpactMetrics;
      },
      [],
    ),
  );

  return {
    economicImpacts: [
      ...siteReconversionIndirectEconomicImpacts,
      ...projectOnSiteIndirectEconomicImpactsData.details,
    ],
    impactMetrics: [...siteReconversionIndirectImpactMetrics, ...projectIndirectImpactMetrics],
  };
};

export const computeProjectImpactsWithBreakEvenLevel = ({
  reconversionProject,
  relatedSite,
  cityStats,
  evaluationPeriodInYears,
}: {
  reconversionProject: ReconversionProjectImpactsWithBreakEvenLevelInput;
  relatedSite: SiteInputData;
  cityStats: {
    propertyValueMedianPricePerSquareMeters: number;
    population: number;
    surfaceAreaSquareMeters: number;
  };
  evaluationPeriodInYears: number;
}): GetReconversionProjectImpactsResultDto["impacts"] => {
  const { operationsFirstYear } = reconversionProject;

  const stakeholders = formatStakeholders({ reconversionProject, relatedSite });

  const {
    projectOnSiteIndirectEconomicImpactsData,
    siteStatuQuoIndirectEconomicImpactsData,
    projectEconomicBalance,
    projectIndirectImpactMetrics,
    siteStatuQuoImpactMetrics,
  } = computeProjectImpactsBreakdownAndEconomicBalance({
    reconversionProject,
    relatedSite,
    cityStats,
    evaluationPeriodInYears,
  });

  const reconversionImpactsBreakdown = {
    siteStatuQuoIndirectEconomicImpactsData,
    projectOnSiteIndirectEconomicImpactsData,
    projectIndirectImpactMetrics,
    siteStatuQuoImpactMetrics,
  };

  const {
    economicImpacts: aggregatedIndirectEconomicImpacts,
    impactMetrics: aggregatedImpactMetrics,
  } = computeAggregatedReconversionImpacts(reconversionImpactsBreakdown);

  const { breakEvenYear, projectionYears, breakEvenIndex, cumulativeBalanceByYear } =
    computeBreakEvenLevel({
      stakeholders,
      operationsFirstYear,
      evaluationPeriodInYears,
      projectEconomicBalance,
      aggregatedIndirectEconomicImpacts,
    });

  return {
    stakeholders,
    operationsFirstYear,
    projectEconomicBalance: projectEconomicBalance,
    projectionYears,
    aggregatedReconversionImpacts: {
      breakEvenYear,
      breakEvenIndex,
      cumulativeBalanceByYear,
      indirectEconomicImpacts: {
        total: sumListWithKey(aggregatedIndirectEconomicImpacts, "total"),
        details: aggregatedIndirectEconomicImpacts,
      },
      impactsMetrics: aggregatedImpactMetrics,
    },
    reconversionImpactsBreakdown: reconversionImpactsBreakdown,
  };
};
