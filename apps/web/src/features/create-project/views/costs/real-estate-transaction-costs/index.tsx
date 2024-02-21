import {
  goToStep,
  ProjectCreationStep,
  setRealEstateTransactionCost,
} from "../../../application/createProject.reducer";
import RealEstateTransactionCostsForm, { FormValues } from "./RealEstateTransactionCostsForm";

import { AppDispatch } from "@/app/application/store";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      const totalCost = sumObjectValues(data);
      dispatch(setRealEstateTransactionCost(totalCost));
      dispatch(goToStep(ProjectCreationStep.COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION));
    },
  };
};

function RealEstateTransactionCostsContainer() {
  const dispatch = useAppDispatch();
  return <RealEstateTransactionCostsForm {...mapProps(dispatch)} />;
}

export default RealEstateTransactionCostsContainer;
