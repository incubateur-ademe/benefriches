import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import AgriculturalOperationActivityForm, { FormValues } from "./AgriculturalOperationActivityForm";

export default function AgriculturalOperationActivityFormContainer() {
  const { onBack, onRequestStepCompletion, selectDerivedSiteData } = useCustomSiteForm();
  const activity = useAppSelector(
    (state) => selectDerivedSiteData(state).agriculturalOperationActivity,
  );

  return (
    <AgriculturalOperationActivityForm
      initialValues={activity ? { activity } : undefined}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({ stepId: "AGRICULTURAL_OPERATION_ACTIVITY", answers: data });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}
