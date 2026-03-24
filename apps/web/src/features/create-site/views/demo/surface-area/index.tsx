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
