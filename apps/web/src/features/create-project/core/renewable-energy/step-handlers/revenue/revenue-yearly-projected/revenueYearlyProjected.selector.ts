import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import {
  computeDefaultPhotovoltaicYearlyRecurringRevenueAmount,
  getRevenueAmountByPurpose,
} from "shared";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

const createSelectPhotovoltaicPowerStationYearlyRevenueInitialValues = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(selectSteps, (steps) => {
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
  });

type PVYearlyProjectedRevenueViewData = {
  initialValues: ReturnType<
    ReturnType<typeof createSelectPhotovoltaicPowerStationYearlyRevenueInitialValues>
  >;
};

export const createSelectPVYearlyProjectedRevenueViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) => {
  const selectPhotovoltaicPowerStationYearlyRevenueInitialValues =
    createSelectPhotovoltaicPowerStationYearlyRevenueInitialValues(selectSteps);

  return createSelector(
    [selectPhotovoltaicPowerStationYearlyRevenueInitialValues],
    (initialValues): PVYearlyProjectedRevenueViewData => ({
      initialValues,
    }),
  );
};
