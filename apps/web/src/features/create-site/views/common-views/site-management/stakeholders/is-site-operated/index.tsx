import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import IsSiteOperatedForm, { type FormValues } from "./IsSiteOperatedForm";

const mapInitialValues = (isSiteOperated: boolean | undefined): FormValues => {
  if (isSiteOperated === undefined) {
    return { isSiteOperated: null };
  }
  return {
    isSiteOperated: isSiteOperated ? "yes" : "no",
  };
};

function IsSiteOperatedFormContainer() {
  const { onBack, onRequestStepCompletion, selectIsSiteOperatedFormViewData } = useCustomSiteForm();
  const { isSiteOperated, siteNature } = useAppSelector(selectIsSiteOperatedFormViewData);

  const onSubmit = ({ isSiteOperated }: FormValues) => {
    onRequestStepCompletion({
      stepId: "IS_SITE_OPERATED",
      answers: { isSiteOperated: isSiteOperated === "yes" },
    });
  };

  return (
    <IsSiteOperatedForm
      initialValues={mapInitialValues(isSiteOperated)}
      siteNature={siteNature}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default IsSiteOperatedFormContainer;
