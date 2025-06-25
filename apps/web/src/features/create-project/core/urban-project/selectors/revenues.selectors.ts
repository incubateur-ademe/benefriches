import { createSelector } from "@reduxjs/toolkit";
import { getRevenueAmountByPurpose } from "shared";

import { selectIsReviewing } from "../../createProject.selectors";
import { selectCreationData } from "./urbanProject.selectors";

type UrbanProjectFinancialAssistanceRevenueView = {
  values: {
    localOrRegionalAuthority: number;
    publicSubsidies: number;
    other: number;
  };
  isReviewing: boolean;
};

export const selectUrbanProjectFinancialAssistanceRevenueView = createSelector(
  [selectCreationData, selectIsReviewing],
  ({ financialAssistanceRevenues }, isReviewing): UrbanProjectFinancialAssistanceRevenueView => {
    if (financialAssistanceRevenues?.length) {
      const values = {
        localOrRegionalAuthority:
          getRevenueAmountByPurpose(
            financialAssistanceRevenues,
            "local_or_regional_authority_participation",
          ) ?? 0,
        publicSubsidies:
          getRevenueAmountByPurpose(financialAssistanceRevenues, "public_subsidies") ?? 0,
        other: getRevenueAmountByPurpose(financialAssistanceRevenues, "other") ?? 0,
      };
      return { values, isReviewing };
    }

    return {
      isReviewing,
      values: {
        localOrRegionalAuthority: 0,
        publicSubsidies: 0,
        other: 0,
      },
    };
  },
);
