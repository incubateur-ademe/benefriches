import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectSitePurchaseAmounts } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";
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
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
            answers: {
              sellingPrice: data.sellingPrice ?? 0,
              propertyTransferDuties: data.propertyTransferDuties,
            },
          }),
        );
      }}
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
    />
  );
}

export default SitePurchaseAmountsContainer;
