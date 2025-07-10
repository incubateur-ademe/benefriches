import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSitePurchaseAmounts } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectSitePurchaseAmounts } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SitePurchaseAmountsForm, {
  FormValues,
} from "../../../../common-views/expenses/site-purchase-amounts/SitePurchaseAmountsForm";

function SitePurchaseAmountsContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectSitePurchaseAmounts);

  return (
    <SitePurchaseAmountsForm
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        dispatch(
          completeSitePurchaseAmounts({
            sellingPrice: data.sellingPrice ?? 0,
            propertyTransferDuties: data.propertyTransferDuties,
          }),
        );
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default SitePurchaseAmountsContainer;
