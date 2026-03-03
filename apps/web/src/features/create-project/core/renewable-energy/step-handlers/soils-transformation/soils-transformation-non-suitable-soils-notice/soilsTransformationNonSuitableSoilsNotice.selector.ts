import { createSelector } from "@reduxjs/toolkit";

import {
  selectPhotovoltaicPanelsSurfaceArea,
  selectSuitableSurfaceAreaForPhotovoltaicPanels,
} from "../../../selectors/soilsTransformation.selectors";

type PVNonSuitableSoilsNoticeViewData = {
  photovoltaicPanelsSurfaceArea: number;
  suitableSurfaceArea: number;
};

export const selectPVNonSuitableSoilsNoticeViewData = createSelector(
  [selectPhotovoltaicPanelsSurfaceArea, selectSuitableSurfaceAreaForPhotovoltaicPanels],
  (photovoltaicPanelsSurfaceArea, suitableSurfaceArea): PVNonSuitableSoilsNoticeViewData => ({
    photovoltaicPanelsSurfaceArea,
    suitableSurfaceArea,
  }),
);
