import {
  completeSitePurchaseAmounts,
  revertSitePurchaseAmounts,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { AppDispatch } from "@/shared/core/store-config/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SitePurchaseAmountsForm, {
  FormValues,
} from "../../../common-views/costs/site-purchase-amounts/SitePurchaseAmountsForm";

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
