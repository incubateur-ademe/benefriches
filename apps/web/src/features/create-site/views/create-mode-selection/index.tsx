import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { createModeSelectionCompleted } from "../../core/actions/introduction.actions";
import { stepRevertAttempted } from "../../core/actions/revert.actions";
import CreateModeSelectionForm, { FormValues } from "./CreateModeSelectionForm";

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <CreateModeSelectionForm
      siteNature={siteNature ?? "FRICHE"}
      onSubmit={(data: FormValues) => {
        dispatch(createModeSelectionCompleted(data));
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}
