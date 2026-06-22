import {
  AggregatedProjectImpactMetric,
  GetReconversionProjectImpactsResultDto,
  ImpactDataView,
  ProjectOnSiteImpactMetric,
  ProjectOperatingEconomicBalanceItem,
  SiteStatuQuoEconomicImpact,
  sumList,
  sumListWithKey,
  UrbanSprawlImpactsComparisonResultDto,
} from "shared";

const cropAndSumEconomicImpact = <
  T extends ProjectOperatingEconomicBalanceItem | SiteStatuQuoEconomicImpact | ImpactDataView,
>(
  item: T,
  evaluationPeriodInYears: number,
) => {
  const croppedDetailsByYear = item.detailsByYear.slice(0, evaluationPeriodInYears);
  return {
    ...item,
    total: sumList(croppedDetailsByYear),
    detailsByYear: croppedDetailsByYear,
    cumulativeByYear: item.cumulativeByYear.slice(0, evaluationPeriodInYears),
  };
};

const cropAndSumImpactMetric = <
  T extends ProjectOnSiteImpactMetric | AggregatedProjectImpactMetric,
>(
  item: T,
  newEvaluationPeriodInYears: number,
  oldEvaluationPeriodInYears: number,
) => {
  if (item.name === "conversionFullTimeJobs" || item.name === "reinstatementFullTimeJobs") {
    return {
      ...item,
      total: (item.total * oldEvaluationPeriodInYears) / newEvaluationPeriodInYears,
    };
  }
  if (!item.detailsByYear) {
    return item;
  }
  const croppedDetailsByYear = item.detailsByYear.slice(0, newEvaluationPeriodInYears);
  return {
    ...item,
    total: sumList(croppedDetailsByYear),
    detailsByYear: croppedDetailsByYear,
  };
};

export const cropImpactsByEvaluationPeriod = (
  impacts: GetReconversionProjectImpactsResultDto,
  evaluationPeriodInYears: number,
): GetReconversionProjectImpactsResultDto => {
  const croppedProjectionYears = impacts.projectionYears.slice(0, evaluationPeriodInYears);

  const croppedCumulativeBalanceByYear =
    impacts.aggregatedReconversionImpacts.cumulativeBalanceByYear.slice(0, evaluationPeriodInYears);

  const croppedEconomicBalance = impacts.projectEconomicBalance.details.map((item) => {
    return item.name === "projectOperatingEconomicBalance"
      ? cropAndSumEconomicImpact(item, evaluationPeriodInYears)
      : item;
  });

  const croppedAggegratedIndirectEconomicImpactsDetails =
    impacts.aggregatedReconversionImpacts.indirectEconomicImpacts.details.map((item) =>
      cropAndSumEconomicImpact(item, evaluationPeriodInYears),
    );

  const croppedProjectOnSiteIndirectEconomicImpactsData =
    impacts.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.details.map(
      (item) => cropAndSumEconomicImpact(item, evaluationPeriodInYears),
    );

  const croppedSiteStatuQuoIndirectEconomicImpactsData =
    impacts.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.map(
      (item) => cropAndSumEconomicImpact(item, evaluationPeriodInYears),
    );

  return {
    ...impacts,
    projectionYears: croppedProjectionYears,
    aggregatedReconversionImpacts: {
      ...impacts.aggregatedReconversionImpacts,
      impactsMetrics: impacts.aggregatedReconversionImpacts.impactsMetrics.map((item) =>
        cropAndSumImpactMetric(item, evaluationPeriodInYears, impacts.projectionYears.length),
      ),
      cumulativeBalanceByYear: croppedCumulativeBalanceByYear,
      indirectEconomicImpacts: {
        details: croppedAggegratedIndirectEconomicImpactsDetails,
        total: sumListWithKey(croppedAggegratedIndirectEconomicImpactsDetails, "total"),
      },
    },
    projectEconomicBalance: {
      details: croppedEconomicBalance,
      total: sumListWithKey(croppedEconomicBalance, "total"),
    },
    reconversionImpactsBreakdown: {
      ...impacts.reconversionImpactsBreakdown,
      projectIndirectImpactMetrics:
        impacts.reconversionImpactsBreakdown.projectIndirectImpactMetrics.map((item) =>
          cropAndSumImpactMetric(item, evaluationPeriodInYears, impacts.projectionYears.length),
        ),
      siteStatuQuoIndirectEconomicImpactsData: {
        details: croppedSiteStatuQuoIndirectEconomicImpactsData,
        total: sumListWithKey(croppedSiteStatuQuoIndirectEconomicImpactsData, "total"),
      },
      projectOnSiteIndirectEconomicImpactsData: {
        details: croppedProjectOnSiteIndirectEconomicImpactsData,
        total: sumListWithKey(croppedProjectOnSiteIndirectEconomicImpactsData, "total"),
      },
    },
  };
};

export const cropUrbanSprawlSimulationByEvaluationPeriod = (
  urbanSprawlSimulation: UrbanSprawlImpactsComparisonResultDto,
  evaluationPeriodInYears: number,
): UrbanSprawlImpactsComparisonResultDto => {
  const croppedProjectionYears = urbanSprawlSimulation.projectionYears.slice(
    0,
    evaluationPeriodInYears,
  );

  const croppedCumulativeBalanceByYear = urbanSprawlSimulation.cumulativeBalanceByYear.slice(
    0,
    evaluationPeriodInYears,
  );

  const croppedEconomicBalance = urbanSprawlSimulation.projectEconomicBalance.details.map(
    (item) => {
      return item.name === "projectOperatingEconomicBalance"
        ? cropAndSumEconomicImpact(item, evaluationPeriodInYears)
        : item;
    },
  );

  const croppedSimulationSiteStatuQuoImpactsData =
    urbanSprawlSimulation.simulationSiteStatuQuoImpactsData.details.map((item) =>
      cropAndSumEconomicImpact(item, evaluationPeriodInYears),
    );

  const croppedProjectOnSimulationSiteImpactsData =
    urbanSprawlSimulation.projectOnSimulationSiteImpactsData.details.map((item) =>
      cropAndSumEconomicImpact(item, evaluationPeriodInYears),
    );

  return {
    ...urbanSprawlSimulation,
    projectionYears: croppedProjectionYears,
    simulationSiteStatuQuoImpactsData: {
      details: croppedSimulationSiteStatuQuoImpactsData,
      total: sumListWithKey(croppedSimulationSiteStatuQuoImpactsData, "total"),
    },
    projectEconomicBalance: {
      details: croppedEconomicBalance,
      total: sumListWithKey(croppedEconomicBalance, "total"),
    },
    projectOnSimulationSiteImpactsData: {
      details: croppedProjectOnSimulationSiteImpactsData,
      total: sumListWithKey(croppedProjectOnSimulationSiteImpactsData, "total"),
    },
    cumulativeBalanceByYear: croppedCumulativeBalanceByYear,
  };
};
