import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/demo/demoFactory";
import { demoSiteSaved } from "@/features/create-site/core/demo/demoSiteSaved.action";
import { selectSiteSurfaceAreaFormViewData } from "@/features/create-site/core/demo/steps/surface-area/surfaceArea.selectors";

import SiteSurfaceAreaForm from "../../common-views/SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, siteNature } = useAppSelector(selectSiteSurfaceAreaFormViewData);

  return (
    <SiteSurfaceAreaForm
      initialValues={initialValues ?? {}}
      instructions={
        <div className="flex flex-col gap-4">
          <span className="text-3xl!" aria-hidden="true" role="img">
            📏
          </span>
          <strong className="text-xl">Pourquoi renseigner la superficie&nbsp;?</strong>
          L’ampleur des impacts sera fonction de la superficie de la friche.
        </div>
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
