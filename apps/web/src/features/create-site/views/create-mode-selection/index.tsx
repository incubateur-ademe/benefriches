import { useAppDispatch } from "@/app/hooks/store.hooks";

import { createModeSelectionCompleted } from "../../core/steps/introduction/introduction.actions";
import type { FormValues } from "./CreateModeSelectionForm";
import CreateModeSelectionForm from "./CreateModeSelectionForm";

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
