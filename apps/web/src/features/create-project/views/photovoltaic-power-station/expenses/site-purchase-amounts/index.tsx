import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import SitePurchaseAmountsForm, {
  FormValues,
} from "@/features/create-project/views/project-form/common/expenses/site-purchase-amounts/SitePurchaseAmountsForm";

function SitePurchaseAmountsContainer() {
  const { onBack, onRequestStepCompletion, selectSitePurchaseAmounts } = useRenewableEnergyForm();
  const initialValues = useAppSelector(selectSitePurchaseAmounts);

  return (
    <SitePurchaseAmountsForm
      initialValues={initialValues}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: {
            sellingPrice: data.sellingPrice ?? 0,
            propertyTransferDuties: data.propertyTransferDuties,
          },
        });
      }}
      onBack={onBack}
    />
  );
}

export default SitePurchaseAmountsContainer;
