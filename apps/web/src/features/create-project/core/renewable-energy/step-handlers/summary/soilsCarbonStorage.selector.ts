import { RootState } from "@/app/store/store";

export const selectSoilsCarbonStorageViewData = (state: RootState) =>
  state.projectCreation.renewableEnergyProject.soilsCarbonStorage;
