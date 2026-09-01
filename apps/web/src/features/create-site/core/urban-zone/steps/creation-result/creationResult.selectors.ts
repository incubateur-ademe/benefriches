import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../selectors/createSite.selectors";
import { createUrbanZoneNamingSelectors } from "../naming/naming.selectors";

type UrbanZoneCreationResultViewData = {
  siteId: string;
  siteName: string;
  saveState: "idle" | "dirty" | "loading" | "success" | "error";
};

export const createCreationResultSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const { selectUrbanZoneNamingViewData } = createUrbanZoneNamingSelectors(rootSelectors);

  const selectUrbanZoneCreationResultViewData = createSelector(
    [selectUrbanZoneNamingViewData, rootSelectors.selectUrbanZoneSaveState],
    (namingViewData, saveState): UrbanZoneCreationResultViewData => ({
      siteId: namingViewData.siteId,
      siteName: namingViewData.initialValues.name,
      saveState,
    }),
  );

  return { selectUrbanZoneCreationResultViewData };
};

export const { selectUrbanZoneCreationResultViewData } =
  createCreationResultSelectors(siteCreationRootSelectors);
