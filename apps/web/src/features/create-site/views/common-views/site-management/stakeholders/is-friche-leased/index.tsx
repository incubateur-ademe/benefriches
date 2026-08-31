import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import IsFricheLeasedForm, { FormValues } from "./IsFricheLeasedForm";

const mapInitialValues = (isFricheLeased: boolean | undefined): FormValues => {
  if (isFricheLeased === undefined) {
    return { isFricheLeased: null };
  }
  return {
    isFricheLeased: isFricheLeased ? "yes" : "no",
  };
};

function IsFricheLeasedFormContainer() {
  const { onBack, onRequestStepCompletion, selectDerivedSiteData } = useCustomSiteForm();
  const isFricheLeased = useAppSelector((state) => selectDerivedSiteData(state).isFricheLeased);

  const onSubmit = ({ isFricheLeased }: FormValues) => {
    onRequestStepCompletion({
      stepId: "IS_FRICHE_LEASED",
      answers: { isFricheLeased: isFricheLeased === "yes" },
    });
  };

  return (
    <IsFricheLeasedForm
      initialValues={mapInitialValues(isFricheLeased)}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default IsFricheLeasedFormContainer;
