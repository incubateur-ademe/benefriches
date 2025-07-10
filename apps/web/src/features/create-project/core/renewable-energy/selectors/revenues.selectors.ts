import { createSelector } from "@reduxjs/toolkit";
import { getRevenueAmountByPurpose } from "shared";
import { computeDefaultPhotovoltaicYearlyRecurringRevenueAmount } from "shared";

import { selectCreationData } from "./renewableEnergy.selector";

export const selectPhotovoltaicPowerStationYearlyRevenueInitialValues = createSelector(
  selectCreationData,
  (creationData) => {
    const { photovoltaicExpectedAnnualProduction, yearlyProjectedRevenues } = creationData;

    if (yearlyProjectedRevenues?.length) {
      return {
        operations: getRevenueAmountByPurpose(yearlyProjectedRevenues, "operations") ?? 0,
        other: getRevenueAmountByPurpose(yearlyProjectedRevenues, "other") ?? 0,
      };
    }

    return {
      operations: computeDefaultPhotovoltaicYearlyRecurringRevenueAmount(
        photovoltaicExpectedAnnualProduction ?? 0,
      ),
      other: 0,
    };
  },
);

export const selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues = createSelector(
  [selectCreationData],
  (creationData) => {
    const { financialAssistanceRevenues } = creationData;
    if (financialAssistanceRevenues?.length) {
      return {
        localOrRegionalAuthority:
          getRevenueAmountByPurpose(
            financialAssistanceRevenues,
            "local_or_regional_authority_participation",
          ) ?? 0,
        publicSubsidies:
          getRevenueAmountByPurpose(financialAssistanceRevenues, "public_subsidies") ?? 0,
        other: getRevenueAmountByPurpose(financialAssistanceRevenues, "other") ?? 0,
      };
    }

    return {
      localOrRegionalAuthority: 0,
      publicSubsidies: 0,
      other: 0,
    };
  },
);
