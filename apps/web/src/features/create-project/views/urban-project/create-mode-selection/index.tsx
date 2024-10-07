import CreateModeSelectionForm, { FormValues } from "./CreateModeSelectionForm";

import {
  createModeStepReverted,
  customCreateModeSelected,
  expressCreateModeSelected,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    if (data.createMode === "express") {
      void dispatch(expressCreateModeSelected());
    }
    if (data.createMode === "custom") {
      void dispatch(customCreateModeSelected());
    }
  };

  const onBack = () => {
    dispatch(createModeStepReverted());
  };

  return <CreateModeSelectionForm onSubmit={onSubmit} onBack={onBack} />;
}
