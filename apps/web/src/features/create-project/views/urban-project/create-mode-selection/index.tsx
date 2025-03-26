import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import {
  customCreateModeSelected,
  expressCreateModeSelected,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import CreateModeSelectionForm, { FormValues } from "./CreateModeSelectionForm";

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
    dispatch(stepRevertAttempted());
  };

  return <CreateModeSelectionForm onSubmit={onSubmit} onBack={onBack} />;
}
