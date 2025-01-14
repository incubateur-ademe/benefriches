import {
  sitePurchaseCompleted,
  sitePurchaseReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectSitePurchaseAmounts } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import SitePurchaseAmountsForm, {
  FormValues,
} from "@/features/create-project/views/common-views/costs/site-purchase-amounts/SitePurchaseAmountsForm";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SitePurchaseAmountsContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectSitePurchaseAmounts);

  return (
    <SitePurchaseAmountsForm
      onSubmit={(data: FormValues) => {
        dispatch(
          sitePurchaseCompleted({
            sellingPrice: data.sellingPrice,
            propertyTransferDuties: data.propertyTransferDuties,
          }),
        );
      }}
      onBack={() => {
        dispatch(sitePurchaseReverted());
      }}
      initialValues={initialValues}
    />
  );
}

export default SitePurchaseAmountsContainer;
