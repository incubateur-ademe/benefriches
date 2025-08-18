import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

const selectSelf = (state: RootState) => state.projectCreation.urbanProjectEventSourcing;

export const selectLoadingState = createSelector(
  [selectSelf],
  (state) => state.soilsCarbonStorage.loadingState,
);

export const selectCurrentAndProjectedSoilsCarbonStorage = createSelector(
  [selectSelf],
  (state) => ({
    current: state.soilsCarbonStorage.current,
    projected: state.soilsCarbonStorage.projected,
  }),
);
