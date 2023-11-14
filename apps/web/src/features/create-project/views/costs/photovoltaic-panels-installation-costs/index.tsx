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
    onSubmit: (costs: FormValues) => {
      const totalCost = Object.values(costs).reduce(
        (sum, cost) => sum + (cost ?? 0),
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
