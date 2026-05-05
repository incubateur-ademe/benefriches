import { createSelector } from "@reduxjs/toolkit";
import {
  IndirectEconomicImpact,
  ProjectOperatingEconomicBalanceItem,
  ReconversionProjectImpactsBreakEvenLevel,
  sumList,
  sumListWithKey,
} from "shared";

import { RootState } from "@/app/store/store";

const selectBreakEvenLevel = (state: RootState) => state.projectImpacts.betaImpactsData;

const selectEvaluationPeriodInYears = (state: RootState) => state.projectImpacts.evaluationPeriod;

const cropAndSum = <T extends IndirectEconomicImpact | ProjectOperatingEconomicBalanceItem>(
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

export const selectBreakEvenLevelByEvaluationPeriod = createSelector(
  [selectBreakEvenLevel, selectEvaluationPeriodInYears],
  (
    breakEvenLevel,
    evaluationPeriodInYears,
  ): ReconversionProjectImpactsBreakEvenLevel | undefined => {
    if (!breakEvenLevel || !evaluationPeriodInYears) {
      return breakEvenLevel;
    }

    const croppedProjectionYears = breakEvenLevel?.projectionYears.slice(
      0,
      evaluationPeriodInYears,
    );

    const croppedCumulativeBalanceByYear = breakEvenLevel?.cumulativeBalanceByYear.slice(
      0,
      evaluationPeriodInYears,
    );

    const croppedEconomicBalance = breakEvenLevel?.economicBalance.details.map((item) => {
      return item.name === "projectOperatingEconomicBalance"
        ? cropAndSum(item, evaluationPeriodInYears)
        : item;
    });

    const croppedIndirectEconomicImpactsDetails =
      breakEvenLevel?.indirectEconomicImpacts.details.map((item) =>
        cropAndSum(item, evaluationPeriodInYears),
      );

    return {
      ...breakEvenLevel,
      projectionYears: croppedProjectionYears,
      cumulativeBalanceByYear: croppedCumulativeBalanceByYear,
      economicBalance: {
        details: croppedEconomicBalance,
        total: sumListWithKey(croppedEconomicBalance, "total"),
      },
      indirectEconomicImpacts: {
        details: croppedIndirectEconomicImpactsDetails,
        total: sumListWithKey(croppedIndirectEconomicImpactsDetails, "total"),
      },
    };
  },
);

type Bearer = "local_authority" | "local_people_or_company" | "humanity";
const isLocalAuthority = (structureType?: string) => structureType === "local_authority";

type OwnerRelatedCategory =
  | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
  | "oldRentalIncomeLoss"
  | "projectedRentalIncome"
  | "projectedRentalIncomeIncrease"
  | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
  | "previousSiteOperationBenefitLoss"
  | "projectOperatingEconomicBalance";

export type LocalAuthorityCategory =
  | OwnerRelatedCategory
  | "propertyTransferDutiesIncome"
  | "localTransferDutiesIncrease"
  | "waterRegulation"
  | "projectNewHousesTaxesIncome"
  | "projectNewCompanyTaxationIncome"
  | "projectPhotovoltaicTaxesIncome"
  | "fricheRoadsAndUtilitiesExpenses";

export type LocalPeopleOrCompanyCategory =
  | OwnerRelatedCategory
  | "localPropertyValueIncrease"
  | "avoidedCarRelatedExpenses"
  | "travelTimeSavedPerTravelerExpenses"
  | "avoidedPropertyDamageExpenses";

export type HumanityCategory =
  | "avoidedCo2eqWithEnergyProduction"
  | "avoidedAirConditioningCo2eqEmissions"
  | "avoidedTrafficCo2EqEmissions"
  | "storedCo2Eq"
  | "natureRelatedWelnessAndLeisure"
  | "forestRelatedProduct"
  | "pollination"
  | "invasiveSpeciesRegulation"
  | "waterCycle"
  | "nitrogenCycle"
  | "soilErosion"
  | "avoidedAirPollutionHealthExpenses"
  | "avoidedAccidentsMinorInjuriesExpenses"
  | "avoidedAccidentsSevereInjuriesExpenses"
  | "avoidedAccidentsDeathsExpenses";

const getBearerForImpact = (
  name: ReconversionProjectImpactsBreakEvenLevel["indirectEconomicImpacts"]["details"][number]["name"],
  stakeholders: ReconversionProjectImpactsBreakEvenLevel["stakeholders"],
): Bearer => {
  switch (name) {
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
    case "oldRentalIncomeLoss":
    case "projectedRentalIncome":
    case "projectedRentalIncomeIncrease":
      return isLocalAuthority(stakeholders.current.owner?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
      return isLocalAuthority(stakeholders.current.tenant?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "previousSiteOperationBenefitLoss":
      return isLocalAuthority(stakeholders.current.operator?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "projectOperatingEconomicBalance":
      return isLocalAuthority(stakeholders.project.developer?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "propertyTransferDutiesIncome":
    case "localTransferDutiesIncrease":
    case "waterRegulation":
    case "projectNewHousesTaxesIncome":
    case "projectNewCompanyTaxationIncome":
    case "projectPhotovoltaicTaxesIncome":
    case "fricheRoadsAndUtilitiesExpenses":
      return "local_authority";

    case "localPropertyValueIncrease":
    case "avoidedCarRelatedExpenses":
    case "travelTimeSavedPerTravelerExpenses":
    case "avoidedPropertyDamageExpenses":
    case "avoidedAirConditioningExpenses":
      return "local_people_or_company";

    case "avoidedCo2eqWithEnergyProduction":
    case "avoidedAirConditioningCo2eqEmissions":
    case "avoidedTrafficCo2EqEmissions":
    case "storedCo2Eq":
    case "natureRelatedWelnessAndLeisure":
    case "forestRelatedProduct":
    case "pollination":
    case "invasiveSpeciesRegulation":
    case "waterCycle":
    case "nitrogenCycle":
    case "soilErosion":
    case "avoidedAirPollutionHealthExpenses":
    case "avoidedAccidentsMinorInjuriesExpenses":
    case "avoidedAccidentsSevereInjuriesExpenses":
    case "avoidedAccidentsDeathsExpenses":
      return "humanity";
  }
};

export type IndirectEconomicImpactsByBearer = {
  local_authority: { total: number; details: { name: LocalAuthorityCategory; amount: number }[] };
  local_people_or_company: {
    total: number;
    details: {
      name: LocalPeopleOrCompanyCategory;
      amount: number;
    }[];
  };
  humanity: {
    total: number;
    details: {
      name: HumanityCategory;
      amount: number;
    }[];
  };
};

const EMPTY_BEARER_STATE: IndirectEconomicImpactsByBearer = {
  local_authority: { total: 0, details: [] },
  local_people_or_company: { total: 0, details: [] },
  humanity: { total: 0, details: [] },
};
export const selectIndirectEconomicImpactsByBearer = createSelector(
  selectBreakEvenLevelByEvaluationPeriod,
  (impacts): IndirectEconomicImpactsByBearer => {
    if (!impacts) {
      return EMPTY_BEARER_STATE;
    }
    return impacts.indirectEconomicImpacts.details.reduce<IndirectEconomicImpactsByBearer>(
      (result, { name, total }) => {
        const bearer = getBearerForImpact(name, impacts.stakeholders);
        return {
          ...result,
          [bearer]: {
            details: [...result[bearer].details, { amount: total, name }],
            total: result[bearer].total + total,
          },
        };
      },
      structuredClone(EMPTY_BEARER_STATE),
    );
  },
);

export type BreakEvenLevelTabDataView =
  | (ReconversionProjectImpactsBreakEvenLevel & {
      indirectEconomicImpactsByBearer: IndirectEconomicImpactsByBearer;
    })
  | undefined;
export const selectBreakEvenLevelTabDataView = createSelector(
  [selectBreakEvenLevelByEvaluationPeriod, selectIndirectEconomicImpactsByBearer],
  (
    breakEvenLevelForEvaluationPeriod,
    indirectEconomicImpactsByBearer,
  ): BreakEvenLevelTabDataView => {
    if (!breakEvenLevelForEvaluationPeriod) {
      return undefined;
    }
    return {
      ...breakEvenLevelForEvaluationPeriod,
      indirectEconomicImpactsByBearer,
    };
  },
);
