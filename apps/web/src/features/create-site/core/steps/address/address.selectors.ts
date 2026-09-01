import { createSelector } from "@reduxjs/toolkit";
import type { Address, SiteNature } from "shared";

import type { createSiteFormRootSelectors } from "../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../selectors/createSite.selectors";

// Address Form ViewData
type AddressFormViewData = {
  siteNature: SiteNature | undefined;
  address: Address | undefined;
};

export const createAddressSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectAddressFormViewData = createSelector(
    [rootSelectors.selectSiteNature, rootSelectors.selectSiteAddress],
    (siteNature, address): AddressFormViewData => ({
      siteNature,
      address,
    }),
  );

  return { selectAddressFormViewData };
};

export const { selectAddressFormViewData } = createAddressSelectors(siteCreationRootSelectors);
