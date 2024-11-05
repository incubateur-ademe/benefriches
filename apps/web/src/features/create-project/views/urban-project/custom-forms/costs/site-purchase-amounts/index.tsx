import { AppDispatch } from "@/app/application/store";
import {
  sitePurchaseCompleted,
  sitePurchaseReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import SitePurchaseAmountsForm, {
  FormValues,
} from "@/features/create-project/views/common-views/costs/site-purchase-amounts/SitePurchaseAmountsForm";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(
        sitePurchaseCompleted({
          sellingPrice: data.sellingPrice,
          propertyTransferDuties: data.propertyTransferDuties,
        }),
      );
    },
    onBack: () => {
      dispatch(sitePurchaseReverted());
    },
  };
};

function SitePurchaseAmountsContainer() {
  const dispatch = useAppDispatch();
  return <SitePurchaseAmountsForm {...mapProps(dispatch)} />;
}

export default SitePurchaseAmountsContainer;
