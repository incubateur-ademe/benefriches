import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteSurfaceAreaForm from "../../SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const { onBack, onRequestStepCompletion, selectSiteSurfaceAreaFormViewData } =
    useCustomSiteForm();
  const { siteSurfaceArea, siteNature } = useAppSelector(selectSiteSurfaceAreaFormViewData);

  return (
    <SiteSurfaceAreaForm
      initialValues={{ surfaceArea: siteSurfaceArea }}
      siteNature={siteNature}
      onSubmit={(formData: { surfaceArea: number }) => {
        onRequestStepCompletion({
          stepId: "SURFACE_AREA",
          answers: { surfaceArea: formData.surfaceArea },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default SiteSurfaceAreaFormContainer;
