import { createSelector } from "@reduxjs/toolkit";
import { getRevenueAmountByPurpose } from "shared";
import { computeDefaultPhotovoltaicYearlyRecurringRevenueAmount } from "shared";

import { ReadStateHelper } from "../helpers/readState";
import { selectSteps } from "./renewableEnergy.selector";

export const selectPhotovoltaicPowerStationYearlyRevenueInitialValues = createSelector(
  selectSteps,
  (steps) => {
    const revenueStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
    );
    const productionStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
    );
    const yearlyProjectedRevenues = revenueStep?.yearlyProjectedRevenues;
    const photovoltaicExpectedAnnualProduction =
      productionStep?.photovoltaicExpectedAnnualProduction;

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

type PVYearlyProjectedRevenueViewData = {
  initialValues: ReturnType<typeof selectPhotovoltaicPowerStationYearlyRevenueInitialValues>;
  photovoltaicExpectedAnnualProduction: number | undefined;
};

export const selectPVYearlyProjectedRevenueViewData = createSelector(
  [selectPhotovoltaicPowerStationYearlyRevenueInitialValues, selectSteps],
  (initialValues, steps): PVYearlyProjectedRevenueViewData => ({
    initialValues,
    photovoltaicExpectedAnnualProduction: ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
    )?.photovoltaicExpectedAnnualProduction,
  }),
);

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
