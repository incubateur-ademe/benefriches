import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectSitePurchaseAmounts } from "@/features/create-project/core/renewable-energy/step-handlers/expenses/sitePurchaseAmounts.selector";
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
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
            answers: {
              sellingPrice: data.sellingPrice ?? 0,
              propertyTransferDuties: data.propertyTransferDuties,
            },
          }),
        );
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default SitePurchaseAmountsContainer;
