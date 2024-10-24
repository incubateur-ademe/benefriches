import {
  buildingsUseCategorySelectionCompleted,
  buildingsUseCategorySelectionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { BuildingsUseCategory } from "@/features/create-project/domain/urbanProject";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import BuildingsUseSelection from "./BuildingsUseSelection";

export default function BuildingsUseSelectionContainer() {
  const dispatch = useAppDispatch();

  return (
    <BuildingsUseSelection
      onSubmit={({
        buildingsUseCategories,
      }: {
        buildingsUseCategories: BuildingsUseCategory[];
      }) => {
        dispatch(buildingsUseCategorySelectionCompleted(buildingsUseCategories));
      }}
      onBack={() => {
        dispatch(buildingsUseCategorySelectionReverted());
      }}
    />
  );
}
