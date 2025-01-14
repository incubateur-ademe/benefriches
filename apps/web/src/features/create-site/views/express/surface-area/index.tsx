import {
  revertSurfaceAreaStep,
  saveExpressSiteAction,
} from "@/features/create-site/core/actions/createSite.actions";
import { completeSiteSurfaceArea } from "@/features/create-site/core/createSite.reducer";
import { selectSiteSurfaceArea } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSurfaceAreaForm from "../../common-views/SiteSurfaceAreaForm";

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(selectSiteSurfaceArea);

  return (
    <SiteSurfaceAreaForm
      initialValues={{ surfaceArea: siteSurfaceArea }}
      onSubmit={(formData: { surfaceArea: number }) => {
        dispatch(completeSiteSurfaceArea({ surfaceArea: formData.surfaceArea }));
        void dispatch(saveExpressSiteAction());
      }}
      onBack={() => {
        dispatch(revertSurfaceAreaStep());
      }}
    />
  );
}

export default SiteSurfaceAreaFormContainer;
