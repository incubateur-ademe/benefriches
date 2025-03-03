import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { createModeReverted, createModeSelectionCompleted } from "../../core/createSite.reducer";
import CreateModeSelectionForm, { FormValues } from "./CreateModeSelectionForm";

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector((state) => state.siteCreation.siteData.isFriche);

  return (
    <CreateModeSelectionForm
      isFriche={isFriche}
      onSubmit={(data: FormValues) => {
        dispatch(createModeSelectionCompleted(data));
      }}
      onBack={() => {
        dispatch(createModeReverted());
      }}
    />
  );
}
