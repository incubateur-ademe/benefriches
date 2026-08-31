import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteSpacesSelectionForm, { type FormValues } from "./SpacesSelectionForm";

const SiteSpacesSelectionFormContainer = () => {
  const { onBack, onRequestStepCompletion, selectSpacesSelectionFormViewData } =
    useCustomSiteForm();
  const { siteNature, soils } = useAppSelector(selectSpacesSelectionFormViewData);

  return (
    <SiteSpacesSelectionForm
      siteNature={siteNature}
      initialValues={{
        soils,
      }}
      onSubmit={(formData: FormValues) => {
        onRequestStepCompletion({
          stepId: "SPACES_SELECTION",
          answers: { soils: formData.soils },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
};

export default SiteSpacesSelectionFormContainer;
