import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

type PVNonSuitableSoilsNoticeViewData = {
  photovoltaicPanelsSurfaceArea: number;
  suitableSurfaceArea: number;
};

export const createSelectPVNonSuitableSoilsNoticeViewData = (
  selectPhotovoltaicPanelsSurfaceArea: Selector<RootState, number>,
  selectSuitableSurfaceAreaForPhotovoltaicPanels: Selector<RootState, number>,
) =>
  createSelector(
    [selectPhotovoltaicPanelsSurfaceArea, selectSuitableSurfaceAreaForPhotovoltaicPanels],
    (photovoltaicPanelsSurfaceArea, suitableSurfaceArea): PVNonSuitableSoilsNoticeViewData => ({
      photovoltaicPanelsSurfaceArea,
      suitableSurfaceArea,
    }),
  );
