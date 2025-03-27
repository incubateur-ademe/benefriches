import { agriculturalOperationActivityCompleted } from "@/features/create-site/core/actions/introduction.actions";
import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import AgriculturalOperationActivityForm, { FormValues } from "./AgriculturalOperationActivityForm";

export default function AgriculturalOperationActivityFormContainer() {
  const dispatch = useAppDispatch();
  const activity = useAppSelector(
    (state) => state.siteCreation.siteData.agriculturalOperationActivity,
  );

  return (
    <AgriculturalOperationActivityForm
      initialValues={activity ? { activity } : undefined}
      onSubmit={(data: FormValues) => {
        dispatch(agriculturalOperationActivityCompleted(data));
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}
