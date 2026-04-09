import { createSelector } from "@reduxjs/toolkit";
import {
  computeDefaultPhotovoltaicYearlyRecurringRevenueAmount,
  getRevenueAmountByPurpose,
} from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

const selectPhotovoltaicPowerStationYearlyRevenueInitialValues = createSelector(
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
};

export const selectPVYearlyProjectedRevenueViewData = createSelector(
  [selectPhotovoltaicPowerStationYearlyRevenueInitialValues],
  (initialValues): PVYearlyProjectedRevenueViewData => ({
    initialValues,
  }),
);
