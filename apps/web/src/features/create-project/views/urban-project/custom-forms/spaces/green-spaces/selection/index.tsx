import {
  greenSpacesSelectionCompleted,
  greenSpacesSelectionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import UrbanGreenSpacesSelection, { FormValues } from "./UrbanGreenSpacesSelection";

export default function UrbanGreenSpacesSelectionContainer() {
  const dispatch = useAppDispatch();

  return (
    <UrbanGreenSpacesSelection
      onBack={() => {
        dispatch(greenSpacesSelectionReverted());
      }}
      onSubmit={(formData: FormValues) => {
        dispatch(greenSpacesSelectionCompleted({ greenSpaces: formData.greenSpaces }));
      }}
    />
  );
}
