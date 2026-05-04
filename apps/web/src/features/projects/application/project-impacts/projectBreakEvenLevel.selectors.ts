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
      return "local_authority";

    case "localPropertyValueIncrease":
    case "avoidedCarRelatedExpenses":
    case "travelTimeSavedPerTravelerExpenses":
      return "local_people_or_company";

    case "avoidedCo2eqWithEnergyProduction":
    case "avoidedAirConditioningCo2eqEmissions":
    case "avoidedTrafficCo2EqEmissions":
    case "avoidedAirConditioningExpenses":
    case "avoidedTrafficCO2Emissions":
    case "storedCo2Eq":
    case "natureRelatedWelnessAndLeisure":
    case "forestRelatedProduct":
    case "pollination":
    case "invasiveSpeciesRegulation":
    case "waterCycle":
    case "nitrogenCycle":
    case "soilErosion":
    case "avoidedPropertyDamageExpenses":
    case "avoidedAirPollutionHealthExpenses":
    case "avoidedAccidentsMinorInjuriesExpenses":
    case "avoidedAccidentsSevereInjuriesExpenses":
    case "avoidedAccidentsDeathsExpenses":
      return "humanity";
  }
};

export type IndirectEconomicImpactsByBearer = {
  local_authority: number;
  local_people_or_company: number;
  humanity: number;
};

export const selectIndirectEconomicImpactsByBearer = createSelector(
  selectBreakEvenLevelByEvaluationPeriod,
  (impacts): IndirectEconomicImpactsByBearer => {
    if (!impacts) {
      return { local_authority: 0, local_people_or_company: 0, humanity: 0 };
    }
    return impacts.indirectEconomicImpacts.details.reduce<Record<Bearer, number>>(
      (acc, { name, total }) => {
        const bearer = getBearerForImpact(name, impacts.stakeholders);
        acc[bearer] = (acc[bearer] ?? 0) + total;
        return acc;
      },
      { local_authority: 0, local_people_or_company: 0, humanity: 0 },
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
