import {
  GetReconversionProjectImpactsResultDto,
  ImpactDataView,
  ProjectOperatingEconomicBalanceItem,
  SiteStatuQuoEconomicImpact,
  sumList,
  sumListWithKey,
  UrbanSprawlImpactsComparisonResultDto,
} from "shared";

const cropAndSum = <
  T extends ProjectOperatingEconomicBalanceItem | SiteStatuQuoEconomicImpact | ImpactDataView,
>(
  item: T,
  evaluationPeriodInYears: number,
) => {
  const croppedDetailsByYear = item.detailsByYear.slice(0, evaluationPeriodInYears);
  return {
    ...item,
    total: sumList(croppedDetailsByYear),
    cumulativeByYear: item.cumulativeByYear.slice(0, evaluationPeriodInYears),
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
      ? cropAndSum(item, evaluationPeriodInYears)
      : item;
  });

  const croppedAggegratedIndirectEconomicImpactsDetails =
    impacts.aggregatedReconversionImpacts.indirectEconomicImpacts.details.map((item) =>
      cropAndSum(item, evaluationPeriodInYears),
    );

  const croppedProjectOnSiteIndirectEconomicImpactsData =
    impacts.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.details.map(
      (item) => cropAndSum(item, evaluationPeriodInYears),
    );

  const croppedSiteStatuQuoIndirectEconomicImpactsData =
    impacts.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details.map(
      (item) => cropAndSum(item, evaluationPeriodInYears),
    );

  return {
    ...impacts,
    projectionYears: croppedProjectionYears,
    aggregatedReconversionImpacts: {
      ...impacts.aggregatedReconversionImpacts,
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
        ? cropAndSum(item, evaluationPeriodInYears)
        : item;
    },
  );

  const croppedSimulationSiteStatuQuoImpactsData =
    urbanSprawlSimulation.simulationSiteStatuQuoImpactsData.details.map((item) =>
      cropAndSum(item, evaluationPeriodInYears),
    );

  const croppedProjectOnSimulationSiteImpactsData =
    urbanSprawlSimulation.projectOnSimulationSiteImpactsData.details.map((item) =>
      cropAndSum(item, evaluationPeriodInYears),
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
