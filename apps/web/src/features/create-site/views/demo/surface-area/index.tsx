import { useAppSelector } from "@/app/hooks/store.hooks";
import { useDemoSiteForm } from "@/features/create-site/views/site-form/useDemoSiteForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import SiteSurfaceAreaForm from "../../common-views/SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const { onBack, onRequestStepCompletion, onSave, selectSiteSurfaceAreaFormViewData } =
    useDemoSiteForm();
  const { initialValues, siteNature } = useAppSelector(selectSiteSurfaceAreaFormViewData);

  return (
    <SiteSurfaceAreaForm
      initialValues={initialValues ?? {}}
      instructions={
        <FormInfo emoji="📏">
          <span className="title">Pourquoi renseigner la superficie&nbsp;?</span>
          L’ampleur des impacts sera fonction de la superficie de la friche.
        </FormInfo>
      }
      siteNature={siteNature}
      onSubmit={({ surfaceArea }) => {
        onRequestStepCompletion({ stepId: "DEMO_SITE_SURFACE_AREA", answers: { surfaceArea } });
        onSave();
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default SiteSurfaceAreaFormContainer;
