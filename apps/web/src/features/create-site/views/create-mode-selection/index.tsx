import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import { completeCreateModeSelectionStep } from "../../application/createSite.reducer";
import CreateModeSelectionForm, { FormValues } from "./CreateModeSelectionForm";

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    void dispatch(completeCreateModeSelectionStep(data));
  };

  return <CreateModeSelectionForm onSubmit={onSubmit} />;
}
