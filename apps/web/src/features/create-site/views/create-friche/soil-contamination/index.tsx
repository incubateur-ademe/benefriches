import SoilContaminationForm from "./SoilContaminationForm";

import { setContaminatedSoilSurface } from "@/features/create-site/application/createFriche.reducers";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: { contaminatedSurface: number }) => {
      dispatch(setContaminatedSoilSurface(data.contaminatedSurface ?? 0));
    },
  };
};

function SoilContaminationFormController() {
  const dispatch = useAppDispatch();

  return <SoilContaminationForm {...mapProps(dispatch)} />;
}

export default SoilContaminationFormController;