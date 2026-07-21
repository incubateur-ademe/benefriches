import type { Selector } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyProjectState } from "@/features/create-project/core/renewable-energy/renewableEnergy.reducer";

export const createSelectSoilsCarbonStorageViewData = (
  selectSoilsCarbonStorage: Selector<RootState, RenewableEnergyProjectState["soilsCarbonStorage"]>,
) => createSelector(selectSoilsCarbonStorage, (soilsCarbonStorage) => soilsCarbonStorage);
