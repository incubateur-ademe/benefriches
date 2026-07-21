import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type SitePurchaseAmounts = {
  sellingPrice: number;
  propertyTransferDuties: number;
};
export const createSelectSitePurchaseAmounts = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector([selectSteps], (steps): SitePurchaseAmounts | undefined => {
    const amounts = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
    );
    if (!amounts?.sellingPrice) return undefined;
    return {
      sellingPrice: amounts.sellingPrice ?? 0,
      propertyTransferDuties: amounts.propertyTransferDuties ?? 0,
    };
  });
