import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { siteSurfaceAreaStepCompleted } from "@/features/create-site/core/steps/spaces/spaces.actions";
import { selectSiteSurfaceAreaFormViewData } from "@/features/create-site/core/steps/spaces/spaces.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSurfaceAreaForm from "../../../common-views/SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const { siteSurfaceArea, siteNature } = useAppSelector(selectSiteSurfaceAreaFormViewData);

  return (
    <SiteSurfaceAreaForm
      initialValues={{ surfaceArea: siteSurfaceArea }}
      siteNature={siteNature}
      onSubmit={(formData: { surfaceArea: number }) => {
        dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: formData.surfaceArea }));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default SiteSurfaceAreaFormContainer;
