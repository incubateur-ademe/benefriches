import {
  goToStep,
  ProjectCreationStep,
  setReinstatementCost,
} from "../../../application/createProject.reducer";
import ReinstatementsCostsForm, { FormValues } from "./ReinstatementCostsForm";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (amounts: FormValues) => {
      const totalCost = Object.values(amounts).reduce(
        (sum, amount) => sum + (amount ?? 0),
        0,
      );
      dispatch(setReinstatementCost(totalCost));
      dispatch(
        goToStep(ProjectCreationStep.COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION),
      );
    },
  };
};

function ReinstatementCostsFormContainer() {
  const dispatch = useAppDispatch();

  return <ReinstatementsCostsForm {...mapProps(dispatch)} />;
}

export default ReinstatementCostsFormContainer;
