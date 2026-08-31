import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectDerivedSiteData } from "@/features/create-site/core/selectors/createSite.selectors";

import AgriculturalOperationActivityForm, { FormValues } from "./AgriculturalOperationActivityForm";

export default function AgriculturalOperationActivityFormContainer() {
  const dispatch = useAppDispatch();
  const activity = useAppSelector(
    (state) => selectDerivedSiteData(state).agriculturalOperationActivity,
  );

  return (
    <AgriculturalOperationActivityForm
      initialValues={activity ? { activity } : undefined}
      onSubmit={(data: FormValues) => {
        dispatch(
          stepCompletionRequested({ stepId: "AGRICULTURAL_OPERATION_ACTIVITY", answers: data }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}
