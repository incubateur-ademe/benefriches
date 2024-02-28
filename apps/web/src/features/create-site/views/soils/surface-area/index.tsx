import SiteSurfaceAreaForm from "./SiteSurfaceAreaForm";

import { AppDispatch } from "@/app/application/store";
import { completeSiteSurfaceArea } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: { surfaceArea: number }) => {
      dispatch(completeSiteSurfaceArea({ surfaceArea: formData.surfaceArea }));
    },
  };
};

function SiteSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteSurfaceAreaForm {...mapProps(dispatch)} />;
}

export default SiteSurfaceAreaFormContainer;
