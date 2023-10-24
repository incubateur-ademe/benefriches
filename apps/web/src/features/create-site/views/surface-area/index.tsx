import SiteSurfaceAreaForm from "./SiteSurfaceAreaForm";

import {
  goToStep,
  setSurfaceArea,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: { surfaceArea: number }) => {
      dispatch(setSurfaceArea(formData.surfaceArea));
      dispatch(goToStep(SiteCreationStep.SOILS));
    },
  };
};

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteSurfaceAreaForm {...mapProps(dispatch)} />;
}

export default SiteSurfaceAreaFormContainer;
