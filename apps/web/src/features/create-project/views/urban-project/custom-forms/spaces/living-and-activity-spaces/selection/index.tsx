import {
  livingAndActivitySpacesSelectionCompleted,
  livingAndActivitySpacesSelectionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import LivingAndActivitySpacesSelection, { FormValues } from "./LivingAndActivitySpacesSelection";

export default function LivingAndActivitySpacesSelectionContainer() {
  const dispatch = useAppDispatch();

  return (
    <LivingAndActivitySpacesSelection
      onBack={() => {
        dispatch(livingAndActivitySpacesSelectionReverted());
      }}
      onSubmit={(formData: FormValues) => {
        dispatch(livingAndActivitySpacesSelectionCompleted(formData.livingAndActivitySpaces));
      }}
    />
  );
}
