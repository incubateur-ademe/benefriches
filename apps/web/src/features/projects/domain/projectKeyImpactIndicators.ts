import {
  FricheActivity,
  isLocalAuthority,
  ReconversionProjectImpacts,
  SiteNature,
  sumListWithKey,
  UrbanSprawlComparisonImpacts,
} from "shared";

import { getPercentageDifference } from "@/shared/core/percentage/percentage";

import { UrbanSprawlImpactsComparisonState } from "../application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";

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
  socioEconomicList: ReconversionProjectImpacts["socioeconomic"]["impacts"],
  siteOwner: SiteData["owner"],
) => {
  const avoidedFricheCosts = socioEconomicList.find(
    ({ impact }) => impact === "avoided_friche_costs",
  );

  const siteOwnerStructureType = siteOwner?.structureType ?? "";
  const isOwnerLocalAuthority = isLocalAuthority(siteOwnerStructureType);

  if (!avoidedFricheCosts || !isOwnerLocalAuthority) {
    return undefined;
  }

  return {
    actorName: siteOwner?.name ?? "",
    amount: avoidedFricheCosts.amount,
  };
};

const getTaxesIncomeImpact = (
  socioEconomicList: ReconversionProjectImpacts["socioeconomic"]["impacts"],
) => {
  const taxesIncomes = socioEconomicList.filter(
    ({ impact }) =>
      impact === "taxes_income" ||
      impact === "property_transfer_duties_income" ||
      impact === "local_transfer_duties_increase",
  );

  if (taxesIncomes.length === 0) {
    return undefined;
  }

  return sumListWithKey(taxesIncomes, "amount");
};

const getFullTimeJobsImpact = (
  impactsData?: ReconversionProjectImpacts["social"]["fullTimeJobs"],
) => {
  if (!impactsData) {
    return undefined;
  }
  const { difference, base, forecast } = impactsData;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    difference,
  };
};

const getHouseholdsPoweredByRenewableEnergy = (
  impactsData?: ReconversionProjectImpacts["social"],
) => {
  if (!impactsData?.householdsPoweredByRenewableEnergy) {
    return undefined;
  }

  return impactsData.householdsPoweredByRenewableEnergy.difference;
};

const getAvoidedCo2eqEmissions = (impactsData?: ReconversionProjectImpacts["environmental"]) => {
  if (!impactsData) {
    return 0;
  }

  const { avoidedCo2eqEmissions } = impactsData;
  const total =
    (avoidedCo2eqEmissions?.withAirConditioningDiminution ?? 0) +
    (avoidedCo2eqEmissions?.withCarTrafficDiminution ?? 0) +
    (avoidedCo2eqEmissions?.withRenewableEnergyProduction ?? 0);

  if (impactsData.soilsCo2eqStorage) {
    return total + impactsData.soilsCo2eqStorage.difference;
  }

  return total;
};

const getPermeableSurfaceArea = (impactsData?: ReconversionProjectImpacts["environmental"]) => {
  if (!impactsData?.permeableSurfaceArea) {
    return undefined;
  }
  const { forecast, base, difference } = impactsData.permeableSurfaceArea;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    difference,
  };
};

const getNonContaminatedSurfaceArea = (
  impactsData: ReconversionProjectImpacts["environmental"],
  relatedSiteData: SiteData,
) => {
  const siteContaminatedSurfaceArea = relatedSiteData.contaminatedSoilSurface ?? 0;
  const siteSurfaceArea = relatedSiteData.surfaceArea;
  const nonContaminatedSurfaceAreaImpact = impactsData.nonContaminatedSurfaceArea;

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
  impactsData: ReconversionProjectImpacts["socioeconomic"]["impacts"],
) => {
  const localPropertyValueIncrease = impactsData.find(
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
        isAgriculturalFriche?: boolean;
        permeableSurfaceAreaDifference?: number;
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
  impactsData: ReconversionProjectImpacts,
  relatedSiteData: SiteData,
) => {
  const { isFriche, isAgriculturalFriche } = getRelatedSiteInfos(relatedSiteData);
  const projectImpactBalance = getProjectImpactBalance({
    economicBalanceTotal: impactsData.economicBalance.total,
    socioEconomicMonetaryImpactsTotal: impactsData.socioeconomic.total,
  });
  const avoidedFricheCostsForLocalAuthority = getAvoidedFricheCostsForLocalAuthority(
    impactsData.socioeconomic.impacts,
    relatedSiteData.owner,
  );
  const taxesIncomesImpact = getTaxesIncomeImpact(impactsData.socioeconomic.impacts);
  const fullTimeJobs = getFullTimeJobsImpact(impactsData.social.fullTimeJobs);
  const householdsPoweredByRenewableEnergy = getHouseholdsPoweredByRenewableEnergy(
    impactsData.social,
  );
  const avoidedCo2eqEmissions = getAvoidedCo2eqEmissions(impactsData.environmental);
  const permeableSurfaceArea = getPermeableSurfaceArea(impactsData.environmental);
  const nonContaminatedSurfaceArea = getNonContaminatedSurfaceArea(
    impactsData.environmental,
    relatedSiteData,
  );
  const localPropertyValueIncrease = getLocalPropertyValueIncrease(
    impactsData.socioeconomic.impacts,
  );

  const impacts: KeyImpactIndicatorData[] = [];

  if (isFriche) {
    impacts.push({
      name: "zanCompliance",
      isSuccess: !isAgriculturalFriche,
      value: {
        isAgriculturalFriche,
      },
    });
  } else {
    impacts.push({
      name: "zanCompliance",
      isSuccess: false,
      value: {
        permeableSurfaceAreaDifference: permeableSurfaceArea?.difference,
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

const getAvoidedMaintenanceCostsForLocalAuthority = (
  socioEconomicList: UrbanSprawlComparisonImpacts["socioeconomic"]["impacts"],
  conversionSiteIsFriche: boolean,
  siteOwner: SiteData["owner"],
) => {
  const siteOwnerStructureType = siteOwner?.structureType ?? "";
  const isOwnerLocalAuthority = isLocalAuthority(siteOwnerStructureType);

  if (conversionSiteIsFriche) {
    const avoidedFricheCosts = socioEconomicList.find(
      ({ impact }) => impact === "avoided_friche_costs",
    );

    const avoidedRoadAndUtilitiesMaintenance =
      socioEconomicList.find(
        ({ impact }) => impact === "avoided_roads_and_utilities_maintenance_expenses",
      )?.amount ?? 0;

    if (!avoidedRoadAndUtilitiesMaintenance && (!avoidedFricheCosts || !isOwnerLocalAuthority)) {
      return undefined;
    }
    const fricheCosts = isOwnerLocalAuthority ? (avoidedFricheCosts?.amount ?? 0) : 0;

    return {
      amount: avoidedRoadAndUtilitiesMaintenance + fricheCosts,
      avoidedRoadAndUtilitiesMaintenance: avoidedRoadAndUtilitiesMaintenance,
      avoidedFricheCosts: fricheCosts,
    };
  }
  const statuQuoFricheCosts = socioEconomicList.find(
    ({ impact }) => impact === "statu_quo_friche_costs",
  );

  const roadAndUtilitiesMaintenance =
    socioEconomicList.find(({ impact }) => impact === "roads_and_utilities_maintenance_expenses")
      ?.amount ?? 0;

  if (roadAndUtilitiesMaintenance && (!statuQuoFricheCosts || !isOwnerLocalAuthority)) {
    return undefined;
  }

  const fricheCosts = isOwnerLocalAuthority ? (statuQuoFricheCosts?.amount ?? 0) : 0;

  return {
    amount: roadAndUtilitiesMaintenance + fricheCosts,
    roadAndUtilitiesMaintenance: roadAndUtilitiesMaintenance,
    fricheCosts,
  };
};

export const getUrbanSprawlComparisonImpactIndicatorsList = (
  data:
    | UrbanSprawlImpactsComparisonState["baseCase"]
    | UrbanSprawlImpactsComparisonState["comparisonCase"],
) => {
  if (!data) {
    return [];
  }
  const impactsData = data.comparisonImpacts;
  const { isFriche, isAgriculturalFriche } = getRelatedSiteInfos(data.conversionSiteData);
  const projectImpactBalance = getProjectImpactBalance({
    economicBalanceTotal: impactsData.economicBalance.total,
    socioEconomicMonetaryImpactsTotal: impactsData.socioeconomic.total,
  });
  const avoidedMaintenanceCostsForLocalAuthority = getAvoidedMaintenanceCostsForLocalAuthority(
    impactsData.socioeconomic.impacts,
    data.conversionSiteData.nature === "FRICHE",
    {
      name: data.conversionSiteData.ownerName,
      structureType: data.conversionSiteData.ownerStructureType,
    },
  );
  const taxesIncomesList = impactsData.socioeconomic.impacts.filter(
    ({ impact }) =>
      impact === "taxes_income" ||
      impact === "property_transfer_duties_income" ||
      impact === "local_transfer_duties_increase",
  );
  const taxesIncomesImpact =
    taxesIncomesList.length > 0 ? sumListWithKey(taxesIncomesList, "amount") : undefined;

  const fullTimeJobs = getFullTimeJobsImpact(impactsData.social.fullTimeJobs);
  const householdsPoweredByRenewableEnergy = getHouseholdsPoweredByRenewableEnergy(
    impactsData.social,
  );
  const avoidedCo2eqEmissions = getAvoidedCo2eqEmissions(impactsData.environmental);
  const permeableSurfaceArea = getPermeableSurfaceArea(impactsData.environmental);
  const nonContaminatedSurfaceArea = getNonContaminatedSurfaceArea(
    impactsData.environmental,
    data.conversionSiteData,
  );
  const localPropertyValueIncrease = impactsData.socioeconomic.impacts.find(
    ({ impact }) => impact === "local_property_value_increase",
  )?.amount;

  const impacts: KeyImpactIndicatorData[] = [];

  if (isFriche) {
    impacts.push({
      name: "zanCompliance",
      isSuccess: !isAgriculturalFriche,
      value: {
        isAgriculturalFriche,
      },
    });
  } else {
    impacts.push({
      name: "zanCompliance",
      isSuccess: false,
      value: {
        permeableSurfaceAreaDifference: permeableSurfaceArea?.difference,
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

  if (avoidedMaintenanceCostsForLocalAuthority) {
    impacts.push({
      name: "avoidedMaintenanceCostsForLocalAuthority",
      isSuccess: avoidedMaintenanceCostsForLocalAuthority.amount > 0,
      value: avoidedMaintenanceCostsForLocalAuthority,
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
