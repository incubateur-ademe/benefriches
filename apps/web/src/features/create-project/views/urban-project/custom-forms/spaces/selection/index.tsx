import UrbanProjectSpacesSelection, { FormValues } from "./SpacesCategoriesSelection";

import {
  spacesSelectionCompleted,
  spacesSelectionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

export default function UrbanProjectSpacesCategoriesSelectionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanProjectSpacesSelection
      onBack={() => {
        dispatch(spacesSelectionReverted());
      }}
      onSubmit={(data: FormValues) => {
        dispatch(spacesSelectionCompleted({ spacesCategories: data.spaceCategories }));
      }}
    />
  );
}
