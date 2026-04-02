import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  createModeCompleted,
  stepReverted,
} from "@/features/create-project/core/usecase-selection/useCaseSelection.actions";
import { selectUseCaseCreateModeViewData } from "@/features/create-project/core/usecase-selection/useCaseSelection.selectors";

import CreateModeSelectionForm from "./CreateModeSelectionForm";

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();
  const { creationMode } = useAppSelector(selectUseCaseCreateModeViewData);

  return (
    <CreateModeSelectionForm
      onSubmit={(formData) => {
        dispatch(createModeCompleted(formData.createMode));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
      initialValues={creationMode ? { createMode: creationMode } : undefined}
    />
  );
}
