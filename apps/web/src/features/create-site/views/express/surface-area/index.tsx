import { expressSiteSaved } from "@/features/create-site/core/actions/finalStep.actions";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { siteSurfaceAreaStepCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { selectSiteSurfaceAreaFormViewData } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSurfaceAreaForm from "../../common-views/SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const { siteSurfaceArea, siteNature } = useAppSelector(selectSiteSurfaceAreaFormViewData);

  return (
    <SiteSurfaceAreaForm
      initialValues={{ surfaceArea: siteSurfaceArea }}
      siteNature={siteNature}
      onSubmit={(formData: { surfaceArea: number }) => {
        dispatch(siteSurfaceAreaStepCompleted({ surfaceArea: formData.surfaceArea }));
        void dispatch(expressSiteSaved());
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default SiteSurfaceAreaFormContainer;
