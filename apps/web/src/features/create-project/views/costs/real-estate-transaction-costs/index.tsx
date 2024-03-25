import {
  completeRealEstateTransactionCost,
  revertRealEstateTransactionCost,
} from "../../../application/createProject.reducer";
import RealEstateTransactionCostsForm, { FormValues } from "./RealEstateTransactionCostsForm";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(
        completeRealEstateTransactionCost({
          sellingPrice: data.sellingPrice ?? 0,
          propertyTransferDuties: data.propertyTransferDuties,
        }),
      );
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
