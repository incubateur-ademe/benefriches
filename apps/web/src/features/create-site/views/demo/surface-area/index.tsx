import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/demo/demoFactory";
import { demoSiteSaved } from "@/features/create-site/core/demo/demoSiteSaved.action";
import { selectSiteSurfaceAreaFormViewData } from "@/features/create-site/core/demo/steps/surface-area/surfaceArea.selectors";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

import SiteSurfaceAreaForm from "../../common-views/SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
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
        dispatch(
          stepCompletionRequested({ stepId: "DEMO_SITE_SURFACE_AREA", answers: { surfaceArea } }),
        );
        void dispatch(demoSiteSaved());
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default SiteSurfaceAreaFormContainer;
