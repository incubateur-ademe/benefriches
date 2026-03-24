import { useAppDispatch } from "@/app/hooks/store.hooks";

import { createModeSelectionCompleted } from "../../core/steps/introduction/introduction.actions";
import CreateModeSelectionForm, { FormValues } from "./CreateModeSelectionForm";

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <CreateModeSelectionForm
      onSubmit={(data: FormValues) => {
        dispatch(createModeSelectionCompleted(data));
      }}
    />
  );
}
