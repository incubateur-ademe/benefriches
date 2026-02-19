import { createSelector } from "@reduxjs/toolkit";
import type { Address, SiteNature } from "shared";

import { selectSiteAddress, selectSiteNature } from "../../selectors/createSite.selectors";

// Address Form ViewData
type AddressFormViewData = {
  siteNature: SiteNature | undefined;
  address: Address | undefined;
};

export const selectAddressFormViewData = createSelector(
  [selectSiteNature, selectSiteAddress],
  (siteNature, address): AddressFormViewData => ({
    siteNature,
    address,
  }),
);
