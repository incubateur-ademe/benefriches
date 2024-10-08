import { AppDispatch } from "@/app/application/store";
import {
  revertSurfaceAreaStep,
  saveExpressSiteAction,
} from "@/features/create-site/application/createSite.actions";
import { completeSiteSurfaceArea } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SiteSurfaceAreaForm from "./SiteSurfaceAreaForm";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: { surfaceArea: number }) => {
      dispatch(completeSiteSurfaceArea({ surfaceArea: formData.surfaceArea }));
      void dispatch(saveExpressSiteAction());
    },
    onBack: () => {
      dispatch(revertSurfaceAreaStep());
    },
  };
};

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteSurfaceAreaForm {...mapProps(dispatch)} />;
}

export default SiteSurfaceAreaFormContainer;
