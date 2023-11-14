import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicPanelsInstallationCost,
} from "../../../application/createProject.reducer";
import PhotovoltaicPanelsInstallationCostsForm, {
  FormValues,
} from "./PhotoVoltaicPanelsInstallationCostsForm";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (amounts: FormValues) => {
      const totalCost = Object.values(amounts).reduce(
        (sum, amount) => sum + (amount ?? 0),
        0,
      );
      dispatch(setPhotovoltaicPanelsInstallationCost(totalCost));
      dispatch(goToStep(ProjectCreationStep.COSTS_PROJECTED_YEARLY_COSTS));
    },
  };
};

function PhotovoltaicPanelsInstallationCostsFormContainer() {
  const dispatch = useAppDispatch();

  return <PhotovoltaicPanelsInstallationCostsForm {...mapProps(dispatch)} />;
}

export default PhotovoltaicPanelsInstallationCostsFormContainer;
