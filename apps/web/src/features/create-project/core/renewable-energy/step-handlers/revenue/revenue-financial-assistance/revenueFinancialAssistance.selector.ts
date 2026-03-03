import { createSelector } from "@reduxjs/toolkit";
import { getRevenueAmountByPurpose } from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

export const selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues = createSelector(
  [selectSteps],
  (steps) => {
    const financialStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
    );
    const financialAssistanceRevenues = financialStep?.financialAssistanceRevenues;
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
