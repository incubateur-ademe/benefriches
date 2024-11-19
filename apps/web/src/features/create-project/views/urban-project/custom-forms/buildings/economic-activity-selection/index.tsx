import { BuildingsEconomicActivityUse } from "shared";

import {
  buildingsEconomicActivitySelectionCompleted,
  buildingsEconomicActivitySelectionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import EconomicActivitiesSelectionSelection from "./EconomicActivitySelection";

export default function BuildingsEconomicActivitySelectionContainer() {
  const dispatch = useAppDispatch();

  return (
    <EconomicActivitiesSelectionSelection
      onSubmit={({
        economicActivityCategories,
      }: {
        economicActivityCategories: BuildingsEconomicActivityUse[];
      }) => {
        dispatch(buildingsEconomicActivitySelectionCompleted(economicActivityCategories));
      }}
      onBack={() => {
        dispatch(buildingsEconomicActivitySelectionReverted());
      }}
    />
  );
}
