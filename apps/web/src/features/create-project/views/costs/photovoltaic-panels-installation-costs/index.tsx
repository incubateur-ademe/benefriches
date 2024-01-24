import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicPanelsInstallationCost,
} from "../../../application/createProject.reducer";
import PhotovoltaicPanelsInstallationCostsForm, {
  FormValues,
} from "./PhotoVoltaicPanelsInstallationCostsForm";

import { AppDispatch } from "@/app/application/store";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (amounts: FormValues) => {
      const totalCost = sumObjectValues(amounts);
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
