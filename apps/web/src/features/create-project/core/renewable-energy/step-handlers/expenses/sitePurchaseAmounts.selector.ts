import { createSelector } from "@reduxjs/toolkit";

import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

type SitePurchaseAmounts = {
  sellingPrice: number;
  propertyTransferDuties: number;
};
export const selectSitePurchaseAmounts = createSelector(
  [selectSteps],
  (steps): SitePurchaseAmounts | undefined => {
    const amounts = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
    );
    if (!amounts?.sellingPrice) return undefined;
    return {
      sellingPrice: amounts.sellingPrice ?? 0,
      propertyTransferDuties: amounts.propertyTransferDuties ?? 0,
    };
  },
);
