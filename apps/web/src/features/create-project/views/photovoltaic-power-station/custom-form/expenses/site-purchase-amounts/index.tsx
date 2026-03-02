import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSitePurchaseAmounts } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectSitePurchaseAmounts } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import SitePurchaseAmountsForm, {
  FormValues,
} from "@/shared/views/project-form/common/expenses/site-purchase-amounts/SitePurchaseAmountsForm";

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
        dispatch(stepReverted());
      }}
    />
  );
}

export default SitePurchaseAmountsContainer;
