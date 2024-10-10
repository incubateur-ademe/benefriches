import {
  publicSpacesSelectionCompleted,
  publicSpacesSelectionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import PublicSpacesSelection, { FormValues } from "./PublicSpacesSelection";

export default function PublicSpacesSelectionContainer() {
  const dispatch = useAppDispatch();

  return (
    <PublicSpacesSelection
      onBack={() => {
        dispatch(publicSpacesSelectionReverted());
      }}
      onSubmit={(formData: FormValues) => {
        dispatch(publicSpacesSelectionCompleted(formData.publicSpaces));
      }}
    />
  );
}
