import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { createModeReverted, createModeSelectionCompleted } from "../../core/createSite.reducer";
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
        dispatch(createModeReverted());
      }}
    />
  );
}
