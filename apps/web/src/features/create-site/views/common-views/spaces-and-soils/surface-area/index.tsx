import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSiteSurfaceAreaFormViewData } from "@/features/create-site/core/steps/spaces/spaces.selectors";

import SiteSurfaceAreaForm from "../../SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const { siteSurfaceArea, siteNature } = useAppSelector(selectSiteSurfaceAreaFormViewData);

  return (
    <SiteSurfaceAreaForm
      initialValues={{ surfaceArea: siteSurfaceArea }}
      siteNature={siteNature}
      onSubmit={(formData: { surfaceArea: number }) => {
        dispatch(
          stepCompletionRequested({
            stepId: "SURFACE_AREA",
            answers: { surfaceArea: formData.surfaceArea },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default SiteSurfaceAreaFormContainer;
