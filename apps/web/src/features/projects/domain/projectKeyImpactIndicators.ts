import { isLocalAuthority, sumListWithKey } from "shared";

import { getPercentageDifference } from "@/shared/core/percentage/percentage";

import { ReconversionProjectImpactsResult } from "../application/project-impacts/fetchImpactsForReconversionProject.action";

export type ProjectOverallImpact = "strong_negative" | "negative" | "positive" | "strong_positive";

const isProjectOverallImpactPositive = (projectOverallImpact: ProjectOverallImpact): boolean => {
  return projectOverallImpact === "positive" || projectOverallImpact === "strong_positive";
};

const isKeyIndicatorPositive = (keyIndicator: KeyImpactIndicatorData): boolean =>
  keyIndicator.isSuccess;

export const getProjectOverallImpact = (
  projectKeyImpactIndicators: KeyImpactIndicatorData[],
): ProjectOverallImpact => {
  const projectOverallMonetaryBalance = projectKeyImpactIndicators.find((keyIndicator) => {
    return keyIndicator.name === "projectImpactBalance";
  });
  const hasPositiveOverallMonetaryBalance = !!projectOverallMonetaryBalance?.isSuccess;

  const positiveKeyImpactIndicators = projectKeyImpactIndicators.filter(isKeyIndicatorPositive);
  const negativeKeyImpactIndicators = projectKeyImpactIndicators.filter(
    (keyIndicator) => !isKeyIndicatorPositive(keyIndicator),
  );

  if (hasPositiveOverallMonetaryBalance) {
    if (positiveKeyImpactIndicators.length < 5) {
      return "positive";
    }
    return "strong_positive";
  }

  return negativeKeyImpactIndicators.length < 5 ? "negative" : "strong_negative";
};

const MAIN_KEY_IMPACT_INDICATORS_COUNT = 3;
const DEFAULT_KEY_INDICATORS_ORDER_PRIORITY = [
  "taxesIncomesImpact",
  "fullTimeJobs",
  "avoidedCo2eqEmissions",
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "nonContaminatedSurfaceArea",
  "permeableSurfaceArea",
  "householdsPoweredByRenewableEnergy",
  "localPropertyValueIncrease",
] as const;
const STRONG_POSITIVE_ORDER_PRIORITY = [
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "taxesIncomesImpact",
  "fullTimeJobs",
  "avoidedCo2eqEmissions",
  "nonContaminatedSurfaceArea",
  "permeableSurfaceArea",
  "householdsPoweredByRenewableEnergy",
  "localPropertyValueIncrease",
] as const;

export const getMainKeyImpactIndicators = (
  projectKeyImpactIndicators: KeyImpactIndicatorData[],
): KeyImpactIndicatorData[] => {
  const overallImpact = getProjectOverallImpact(projectKeyImpactIndicators);
  const keyIndicatorsToSort = isProjectOverallImpactPositive(overallImpact)
    ? projectKeyImpactIndicators.filter(isKeyIndicatorPositive)
    : projectKeyImpactIndicators.filter((keyIndicator) => !isKeyIndicatorPositive(keyIndicator));
  const orderPriority =
    overallImpact === "strong_positive"
      ? STRONG_POSITIVE_ORDER_PRIORITY
      : DEFAULT_KEY_INDICATORS_ORDER_PRIORITY;

  return keyIndicatorsToSort
    .sort((a, b) => orderPriority.indexOf(a.name) - orderPriority.indexOf(b.name))
    .slice(0, MAIN_KEY_IMPACT_INDICATORS_COUNT);
};

const getRelatedSiteInfos = (
  relatedSiteData?: ReconversionProjectImpactsResult["siteData"],
): { isFriche: boolean; isAgriculturalFriche: boolean } => ({
  isAgriculturalFriche: relatedSiteData?.fricheActivity === "AGRICULTURE",
  isFriche: !!relatedSiteData?.isFriche,
});

const getProjectImpactBalance = (impactsData?: ReconversionProjectImpactsResult["impacts"]) => {
  const economicBalanceTotal = impactsData?.economicBalance.total ?? 0;
  const socioEconomicMonetaryImpactsTotal = impactsData?.socioeconomic.total ?? 0;

  return {
    economicBalanceTotal,
    socioEconomicMonetaryImpactsTotal,
    projectBalance: economicBalanceTotal + socioEconomicMonetaryImpactsTotal,
  };
};

const getAvoidedFricheCostsForLocalAuthority = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
  relatedSiteData?: ReconversionProjectImpactsResult["siteData"],
) => {
  const avoidedFricheCosts = impactsData?.socioeconomic.impacts.find(
    ({ impact }) => impact === "avoided_friche_costs",
  );

  const siteOwner = relatedSiteData?.owner.structureType ?? "";
  const isOwnerLocalAuthority = isLocalAuthority(siteOwner);

  if (!avoidedFricheCosts || !isOwnerLocalAuthority) {
    return undefined;
  }

  return {
    actorName: relatedSiteData?.owner.name ?? "",
    amount: avoidedFricheCosts.amount,
  };
};

const getTaxesIncomeImpact = (impactsData?: ReconversionProjectImpactsResult["impacts"]) => {
  const taxesIncomes = impactsData?.socioeconomic.impacts.filter(
    ({ impact }) =>
      impact === "taxes_income" ||
      impact === "property_transfer_duties_income" ||
      impact === "local_transfer_duties_increase",
  );

  if (!taxesIncomes || taxesIncomes.length === 0) {
    return undefined;
  }

  return sumListWithKey(taxesIncomes, "amount");
};

const getFullTimeJobsImpact = (impactsData?: ReconversionProjectImpactsResult["impacts"]) => {
  if (!impactsData?.social.fullTimeJobs) {
    return undefined;
  }
  const { difference, base, forecast } = impactsData.social.fullTimeJobs;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    difference,
  };
};

const getHouseholdsPoweredByRenewableEnergy = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
) => {
  if (!impactsData?.social.householdsPoweredByRenewableEnergy) {
    return undefined;
  }

  return impactsData.social.householdsPoweredByRenewableEnergy.difference;
};

const getAvoidedCo2eqEmissions = (impactsData?: ReconversionProjectImpactsResult["impacts"]) => {
  if (!impactsData) {
    return 0;
  }

  const { avoidedCo2eqEmissions } = impactsData.environmental;
  const total =
    (avoidedCo2eqEmissions?.withAirConditioningDiminution ?? 0) +
    (avoidedCo2eqEmissions?.withCarTrafficDiminution ?? 0) +
    (avoidedCo2eqEmissions?.withRenewableEnergyProduction ?? 0);

  if (impactsData.environmental.soilsCo2eqStorage) {
    return total + impactsData.environmental.soilsCo2eqStorage.difference;
  }

  return total;
};

const getPermeableSurfaceArea = (impactsData?: ReconversionProjectImpactsResult["impacts"]) => {
  if (!impactsData?.environmental.permeableSurfaceArea) {
    return undefined;
  }
  const { forecast, base } = impactsData.environmental.permeableSurfaceArea;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    difference: forecast - base,
  };
};

const getNonContaminatedSurfaceArea = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
  relatedSiteData?: ReconversionProjectImpactsResult["siteData"],
) => {
  const siteContaminatedSurfaceArea = relatedSiteData?.contaminatedSoilSurface ?? 0;
  const siteSurfaceArea = relatedSiteData?.surfaceArea ?? 0;
  const nonContaminatedSurfaceAreaImpact = impactsData?.environmental.nonContaminatedSurfaceArea;

  if (!nonContaminatedSurfaceAreaImpact || !siteContaminatedSurfaceArea) {
    return undefined;
  }

  const { forecast, base, difference } = nonContaminatedSurfaceAreaImpact;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    forecastContaminatedSurfaceArea: siteSurfaceArea - forecast,
    decontaminatedSurfaceArea: difference,
  };
};

const getLocalPropertyValueIncrease = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
) => {
  const localPropertyValueIncrease = impactsData?.socioeconomic.impacts.find(
    ({ impact }) => impact === "local_property_value_increase",
  );
  return localPropertyValueIncrease?.amount;
};

export type KeyImpactIndicatorData =
  | {
      name:
        | "taxesIncomesImpact"
        | "localPropertyValueIncrease"
        | "householdsPoweredByRenewableEnergy"
        | "avoidedCo2eqEmissions";
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
      name: "fullTimeJobs" | "permeableSurfaceArea";
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
        isAgriculturalFriche: boolean;
      };
    };

export const getKeyImpactIndicatorsList = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
  relatedSiteData?: ReconversionProjectImpactsResult["siteData"],
) => {
  const { isFriche, isAgriculturalFriche } = getRelatedSiteInfos(relatedSiteData);
  const projectImpactBalance = getProjectImpactBalance(impactsData);
  const avoidedFricheCostsForLocalAuthority = getAvoidedFricheCostsForLocalAuthority(
    impactsData,
    relatedSiteData,
  );
  const taxesIncomesImpact = getTaxesIncomeImpact(impactsData);
  const fullTimeJobs = getFullTimeJobsImpact(impactsData);
  const householdsPoweredByRenewableEnergy = getHouseholdsPoweredByRenewableEnergy(impactsData);
  const avoidedCo2eqEmissions = getAvoidedCo2eqEmissions(impactsData);
  const permeableSurfaceArea = getPermeableSurfaceArea(impactsData);
  const nonContaminatedSurfaceArea = getNonContaminatedSurfaceArea(impactsData, relatedSiteData);
  const localPropertyValueIncrease = getLocalPropertyValueIncrease(impactsData);

  const impacts: KeyImpactIndicatorData[] = [];

  if (isFriche) {
    impacts.push({
      name: "zanCompliance",
      isSuccess: !isAgriculturalFriche,
      value: {
        isAgriculturalFriche,
      },
    });
  } else if (permeableSurfaceArea && permeableSurfaceArea.difference < 0) {
    impacts.push({
      name: "zanCompliance",
      isSuccess: false,
      value: {
        isAgriculturalFriche,
      },
    });
  }

  impacts.push({
    name: "projectImpactBalance",
    isSuccess: projectImpactBalance.projectBalance > 0,
    value: projectImpactBalance,
  });

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
