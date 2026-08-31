import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import FricheActivityForm, { FormValues } from "./FricheActivityForm";

function FricheActivityFormContainer() {
  const { onBack, onRequestStepCompletion, selectFricheActivity } = useCustomSiteForm();
  const fricheActivity = useAppSelector(selectFricheActivity);

  return (
    <FricheActivityForm
      initialValues={{ activity: fricheActivity }}
      onSubmit={(formData: FormValues) => {
        onRequestStepCompletion({ stepId: "FRICHE_ACTIVITY", answers: formData.activity });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default FricheActivityFormContainer;
