import { createSelector } from "@reduxjs/toolkit";
import { getRevenueAmountByPurpose } from "shared";

import { selectCreationData } from "./urbanProject.selectors";

export const selectUrbanProjectFinancialAssistanceRevenueInitialValues = createSelector(
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
