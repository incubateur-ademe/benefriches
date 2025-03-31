import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { siteSurfaceAreaStepCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { selectSiteSurfaceArea } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSurfaceAreaForm from "../../../common-views/SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(selectSiteSurfaceArea);
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteSurfaceAreaForm
      initialValues={{ surfaceArea: siteSurfaceArea }}
      siteNature={siteNature}
      onSubmit={(formData: { surfaceArea: number }) => {
        dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: formData.surfaceArea }));
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default SiteSurfaceAreaFormContainer;
