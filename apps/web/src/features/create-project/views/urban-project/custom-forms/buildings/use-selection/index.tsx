import { BuildingsUse } from "shared";

import {
  buildingsUseSelectionCompleted,
  buildingsUseSelectionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import BuildingsUseSelection from "./BuildingsUseSelection";

export default function BuildingsUseSelectionContainer() {
  const dispatch = useAppDispatch();

  return (
    <BuildingsUseSelection
      onSubmit={({ buildingsUse }: { buildingsUse: BuildingsUse[] }) => {
        dispatch(buildingsUseSelectionCompleted(buildingsUse));
      }}
      onBack={() => {
        dispatch(buildingsUseSelectionReverted());
      }}
    />
  );
}
