import {
  FricheActivity,
  GetReconversionProjectImpactsResultDto,
  isLocalAuthority,
  SiteNature,
  sumListWithKey,
} from "shared";

import { getPercentageDifference } from "@/shared/core/percentage/percentage";

const getRelatedSiteInfos = (
  siteData: SiteData,
): { isFriche: boolean; isAgriculturalFriche: boolean } => ({
  isAgriculturalFriche: siteData.fricheActivity === "AGRICULTURE",
  isFriche: siteData.nature === "FRICHE",
});

const getProjectImpactBalance = ({
  economicBalanceTotal,
  socioEconomicMonetaryImpactsTotal,
}: {
  economicBalanceTotal: number;
  socioEconomicMonetaryImpactsTotal: number;
}) => {
  return {
    economicBalanceTotal,
    socioEconomicMonetaryImpactsTotal,
    projectBalance: economicBalanceTotal + socioEconomicMonetaryImpactsTotal,
  };
};

const getAvoidedFricheCostsForLocalAuthority = (
  socioEconomicList: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["indirectEconomicImpacts"]["details"],
  siteOwner: SiteData["owner"],
) => {
  const avoidedFricheCosts = sumListWithKey(
    socioEconomicList.filter(
      ({ name }) => name === "avoidedFricheMaintenanceAndSecuringCostsForOwner",
    ),
    "total",
  );

  const siteOwnerStructureType = siteOwner?.structureType ?? "";
  const isOwnerLocalAuthority = isLocalAuthority(siteOwnerStructureType);

  if (!avoidedFricheCosts || !isOwnerLocalAuthority) {
    return undefined;
  }

  return {
    actorName: siteOwner?.name ?? "",
    amount: avoidedFricheCosts,
  };
};

const getTaxesIncomeImpact = (
  socioEconomicList: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["indirectEconomicImpacts"]["details"],
) => {
  const taxesIncomes = socioEconomicList.filter(
    ({ name }) =>
      name === "projectNewHousesTaxesIncome" ||
      name === "projectNewCompanyTaxationIncome" ||
      name === "projectPhotovoltaicTaxesIncome" ||
      name === "propertyTransferDutiesIncome" ||
      name === "localTransferDutiesIncrease",
  );

  if (taxesIncomes.length === 0) {
    return undefined;
  }

  return sumListWithKey(taxesIncomes, "total");
};

const getFullTimeJobsImpact = (
  impactMetrics: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["impactsMetrics"],
) => {
  const fullTimeJobs = impactMetrics.filter(
    ({ name }) =>
      name === "conversionFullTimeJobs" ||
      name === "operationsFullTimeJobs" ||
      name === "oldOperationsFullTimeJobsLoss" ||
      name === "reinstatementFullTimeJobs",
  );

  const oldOperationsFullTimeJobsLoss =
    impactMetrics.find(({ name }) => name === "oldOperationsFullTimeJobsLoss")?.total ?? 0;

  if (fullTimeJobs.length === 0) {
    return undefined;
  }

  const difference = sumListWithKey(fullTimeJobs, "total");
  return {
    percentageEvolution: getPercentageDifference(
      oldOperationsFullTimeJobsLoss * -1,
      difference + oldOperationsFullTimeJobsLoss,
    ),
    difference: difference,
  };
};

const getHouseholdsPoweredByRenewableEnergy = (
  impactMetrics: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["impactsMetrics"],
) => {
  return impactMetrics.find(({ name }) => name === "householdsPoweredByRenewableEnergy")?.total;
};

const getAvoidedCo2eqEmissions = (
  impactMetrics: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["impactsMetrics"],
) => {
  const co2EqEmissions = impactMetrics.filter(
    ({ name }) =>
      name === "avoidedCO2TonsWithEnergyProduction" ||
      name === "avoidedAirConditioningCo2eqEmissions" ||
      name === "avoidedTrafficCo2EqEmissions" ||
      name === "newStoredCo2Eq",
  );
  if (co2EqEmissions.length === 0) {
    return undefined;
  }

  return sumListWithKey(co2EqEmissions, "total");
};

const getPermeableSurfaceArea = (
  impactMetrics: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["impactsMetrics"],
  statuQuoImpactMetrics: GetReconversionProjectImpactsResultDto["impacts"]["reconversionImpactsBreakdown"]["siteStatuQuoImpactMetrics"],
) => {
  const newPermeableSurface = sumListWithKey(
    impactMetrics.filter(
      ({ name }) => name === "newPermeableMineralSurface" || name === "newPermeableGreenSurface",
    ),
    "total",
  );
  if (!newPermeableSurface) {
    return undefined;
  }
  const base =
    statuQuoImpactMetrics.find(
      ({ name }) => name === "permeableMineralSurface" || name === "permeableGreenSurface",
    )?.total ?? 0;
  const forecast = base + newPermeableSurface;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    difference: newPermeableSurface,
  };
};

const getArtificializedSurfaceArea = (permeableSurfaceAreaDifference?: number): number => {
  if (permeableSurfaceAreaDifference === undefined || permeableSurfaceAreaDifference >= 0) {
    return 0;
  }

  return Math.abs(permeableSurfaceAreaDifference);
};

const getNonContaminatedSurfaceArea = (
  impactsData: GetReconversionProjectImpactsResultDto["impacts"]["reconversionImpactsBreakdown"],
  siteSurfaceArea: number,
) => {
  const siteContaminatedSurfaceArea = impactsData.siteStatuQuoImpactMetrics.find(
    ({ name }) => name === "contaminatedSurface",
  )?.total;
  const decontaminatedSurface = impactsData.projectIndirectImpactMetrics.find(
    ({ name }) => name === "decontaminatedSurface",
  )?.total;

  if (!decontaminatedSurface || !siteContaminatedSurfaceArea) {
    return undefined;
  }

  const base = siteSurfaceArea - siteContaminatedSurfaceArea;
  const forecast = base - decontaminatedSurface;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    forecastContaminatedSurfaceArea: siteSurfaceArea - forecast,
    decontaminatedSurfaceArea: decontaminatedSurface,
  };
};

const getLocalPropertyValueIncrease = (
  indirectEconomicImpactsList: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["indirectEconomicImpacts"]["details"],
) => {
  return indirectEconomicImpactsList.find(({ name }) => name === "localPropertyValueIncrease")
    ?.total;
};

export type KeyImpactIndicatorData =
  | {
      name: "taxesIncomesImpact";
      isSuccess: boolean;
      value: number;
    }
  | {
      name: "localPropertyValueIncrease";
      isSuccess: boolean;
      value: number;
    }
  | {
      name: "householdsPoweredByRenewableEnergy";
      isSuccess: boolean;
      value: number;
    }
  | {
      name: "avoidedCo2eqEmissions";
      isSuccess: boolean;
      value: number;
    }
  | {
      name: "nonContaminatedSurfaceArea";
      isSuccess: boolean;
      value: {
        forecastContaminatedSurfaceArea: number;
        decontaminatedSurfaceArea: number;
        percentageEvolution: number;
      };
    }
  | {
      name: "fullTimeJobs";
      isSuccess: boolean;
      value: { difference: number; percentageEvolution: number };
    }
  | {
      name: "permeableSurfaceArea";
      isSuccess: boolean;
      value: { difference: number; percentageEvolution: number };
    }
  | {
      name: "avoidedFricheCostsForLocalAuthority";
      isSuccess: boolean;
      value: { actorName: string; amount: number };
    }
  | {
      name: "projectImpactBalance";
      isSuccess: boolean;
      value: {
        economicBalanceTotal: number;
        socioEconomicMonetaryImpactsTotal: number;
        projectBalance: number;
      };
    }
  | {
      name: "zanCompliance";
      isSuccess: boolean;
      value: {
        isAgriculturalFriche?: boolean;
        permeableSurfaceAreaDifference?: number;
        artificializedSurfaceArea: number;
      };
    }
  | {
      name: "avoidedMaintenanceCostsForLocalAuthority";
      isSuccess: boolean;
      value:
        | {
            amount: number;
            avoidedRoadAndUtilitiesMaintenance: number;
            avoidedFricheCosts: number;
            roadAndUtilitiesMaintenance?: undefined;
            fricheCosts?: undefined;
          }
        | {
            amount: number;
            roadAndUtilitiesMaintenance: number;
            fricheCosts: number;
            avoidedRoadAndUtilitiesMaintenance?: undefined;
            avoidedFricheCosts?: undefined;
          };
    };

type SiteData = {
  fricheActivity?: FricheActivity;
  nature: SiteNature;
  owner?: {
    structureType: string;
    name?: string;
  };
  contaminatedSoilSurface?: number;
  surfaceArea: number;
};

export const getKeyImpactIndicatorsList = (
  impactsData: GetReconversionProjectImpactsResultDto["impacts"],
  contextData: GetReconversionProjectImpactsResultDto["contextData"],
) => {
  const { isFriche, isAgriculturalFriche } = getRelatedSiteInfos({
    surfaceArea: contextData.siteSurfaceArea,
    contaminatedSoilSurface:
      impactsData.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
        (item) => item.name === "contaminatedSurface",
      )?.total ?? 0,
    fricheActivity: contextData.fricheActivity,
    nature: contextData.siteNature,
  });

  const projectImpactBalance = getProjectImpactBalance({
    economicBalanceTotal: impactsData.projectEconomicBalance.total,
    socioEconomicMonetaryImpactsTotal:
      impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
  });
  const avoidedFricheCostsForLocalAuthority = getAvoidedFricheCostsForLocalAuthority(
    impactsData?.aggregatedReconversionImpacts.indirectEconomicImpacts.details ?? [],
    impactsData?.stakeholders.current.owner,
  );
  const taxesIncomesImpact = getTaxesIncomeImpact(
    impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
  );
  const fullTimeJobs = getFullTimeJobsImpact(
    impactsData.aggregatedReconversionImpacts.impactsMetrics,
  );
  const householdsPoweredByRenewableEnergy = getHouseholdsPoweredByRenewableEnergy(
    impactsData.aggregatedReconversionImpacts.impactsMetrics,
  );
  const avoidedCo2eqEmissions = getAvoidedCo2eqEmissions(
    impactsData.aggregatedReconversionImpacts.impactsMetrics,
  );
  const permeableSurfaceArea = getPermeableSurfaceArea(
    impactsData.aggregatedReconversionImpacts.impactsMetrics,
    impactsData.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics,
  );
  const nonContaminatedSurfaceArea = getNonContaminatedSurfaceArea(
    impactsData?.reconversionImpactsBreakdown,
    contextData.siteSurfaceArea,
  );
  const localPropertyValueIncrease = getLocalPropertyValueIncrease(
    impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
  );
  const permeableSurfaceAreaDifference = permeableSurfaceArea?.difference;
  const artificializedSurfaceArea = getArtificializedSurfaceArea(permeableSurfaceAreaDifference);

  const impacts: KeyImpactIndicatorData[] = [];

  if (isFriche) {
    impacts.push({
      name: "zanCompliance",
      isSuccess: !isAgriculturalFriche,
      value: {
        isAgriculturalFriche,
        permeableSurfaceAreaDifference,
        artificializedSurfaceArea,
      },
    });
  } else {
    impacts.push({
      name: "zanCompliance",
      isSuccess: false,
      value: {
        permeableSurfaceAreaDifference,
        artificializedSurfaceArea,
      },
    });
  }

  if (projectImpactBalance.economicBalanceTotal < 0) {
    impacts.push({
      name: "projectImpactBalance",
      isSuccess: projectImpactBalance.projectBalance > 0,
      value: projectImpactBalance,
    });
  }

  if (avoidedFricheCostsForLocalAuthority) {
    impacts.push({
      name: "avoidedFricheCostsForLocalAuthority",
      isSuccess: avoidedFricheCostsForLocalAuthority.amount > 0,
      value: avoidedFricheCostsForLocalAuthority,
    });
  }

  if (taxesIncomesImpact) {
    impacts.push({
      name: "taxesIncomesImpact",
      isSuccess: taxesIncomesImpact > 0,
      value: taxesIncomesImpact,
    });
  }

  if (localPropertyValueIncrease && localPropertyValueIncrease > 0) {
    impacts.push({
      name: "localPropertyValueIncrease",
      isSuccess: true,
      value: localPropertyValueIncrease,
    });
  }

  if (fullTimeJobs) {
    impacts.push({
      name: "fullTimeJobs",
      isSuccess: fullTimeJobs.difference > 0,
      value: fullTimeJobs,
    });
  }

  if (householdsPoweredByRenewableEnergy && householdsPoweredByRenewableEnergy > 0) {
    impacts.push({
      name: "householdsPoweredByRenewableEnergy",
      isSuccess: true,
      value: householdsPoweredByRenewableEnergy,
    });
  }

  if (avoidedCo2eqEmissions) {
    impacts.push({
      name: "avoidedCo2eqEmissions",
      isSuccess: avoidedCo2eqEmissions > 0,
      value: avoidedCo2eqEmissions,
    });
  }

  if (permeableSurfaceArea && permeableSurfaceArea.difference > 0) {
    impacts.push({
      name: "permeableSurfaceArea",
      isSuccess: permeableSurfaceArea.difference > 0,
      value: permeableSurfaceArea,
    });
  }

  if (nonContaminatedSurfaceArea) {
    impacts.push({
      name: "nonContaminatedSurfaceArea",
      isSuccess: nonContaminatedSurfaceArea.decontaminatedSurfaceArea > 0,
      value: nonContaminatedSurfaceArea,
    });
  }

  return impacts;
};
