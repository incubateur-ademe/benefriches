import {
  completeRealEstateTransactionCost,
  revertRealEstateTransactionCost,
} from "../../../application/createProject.reducer";
import RealEstateTransactionCostsForm, { FormValues } from "./RealEstateTransactionCostsForm";

import { AppDispatch } from "@/app/application/store";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      const totalCost = sumObjectValues(data);
      dispatch(completeRealEstateTransactionCost(totalCost));
    },
    onBack: () => {
      dispatch(revertRealEstateTransactionCost());
    },
  };
};

function RealEstateTransactionCostsContainer() {
  const dispatch = useAppDispatch();
  return <RealEstateTransactionCostsForm {...mapProps(dispatch)} />;
}

export default RealEstateTransactionCostsContainer;
