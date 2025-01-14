import {
  spacesSelectionCompleted,
  spacesSelectionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectSpacesCategories } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanProjectSpacesSelection, { FormValues } from "./SpacesCategoriesSelection";

export default function UrbanProjectSpacesCategoriesSelectionContainer() {
  const dispatch = useAppDispatch();
  const selectedSpacesCategories = useAppSelector(selectSpacesCategories);

  return (
    <UrbanProjectSpacesSelection
      initialValues={selectedSpacesCategories}
      onBack={() => {
        dispatch(spacesSelectionReverted());
      }}
      onSubmit={(data: FormValues) => {
        dispatch(spacesSelectionCompleted({ spacesCategories: data.spaceCategories }));
      }}
    />
  );
}
