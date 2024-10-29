import { AppDispatch } from "@/app/application/store";
import {
  completeSitePurchaseAmounts,
  revertSitePurchaseAmounts,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SitePurchaseAmountsForm, { FormValues } from "./SitePurchaseAmountsForm";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(
        completeSitePurchaseAmounts({
          sellingPrice: data.sellingPrice ?? 0,
          propertyTransferDuties: data.propertyTransferDuties,
        }),
      );
    },
    onBack: () => {
      dispatch(revertSitePurchaseAmounts());
    },
  };
};

function SitePurchaseAmountsContainer() {
  const dispatch = useAppDispatch();
  return <SitePurchaseAmountsForm {...mapProps(dispatch)} />;
}

export default SitePurchaseAmountsContainer;
