import CreateModeSelectionForm, { FormValues } from "./CreateModeSelectionForm";

import {
  createModeStepReverted,
  expressCreateModeSelected,
} from "@/features/create-project/application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    if (data.createMode === "express") {
      void dispatch(expressCreateModeSelected());
    }
  };

  const onBack = () => {
    dispatch(createModeStepReverted());
  };

  return <CreateModeSelectionForm onSubmit={onSubmit} onBack={onBack} />;
}
