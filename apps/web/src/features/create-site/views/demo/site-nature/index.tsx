import { useAppSelector } from "@/app/hooks/store.hooks";
import { useDemoSiteForm } from "@/features/create-site/views/site-form/useDemoSiteForm";

import SiteNatureForm, { FormValues } from "./SiteNatureForm";

function SiteNatureFormContainer() {
  const { onBack, onRequestStepCompletion, selectSiteNatureViewData } = useDemoSiteForm();
  const { initialValues } = useAppSelector(selectSiteNatureViewData);

  return (
    <SiteNatureForm
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "DEMO_SITE_NATURE_SELECTION",
          answers: data,
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default SiteNatureFormContainer;
