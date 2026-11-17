import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import type { FormValues } from "@/features/create-project/views/project-form/common/expenses/site-purchase-amounts/SitePurchaseAmountsForm";
import SitePurchaseAmountsForm from "@/features/create-project/views/project-form/common/expenses/site-purchase-amounts/SitePurchaseAmountsForm";

function SitePurchaseAmountsContainer() {
  const { onBack, onRequestStepCompletion, selectSitePurchaseAmountsDataView } =
    useRenewableEnergyForm();
  const { defaultValues, currentValues, futureSiteOwnerName } = useAppSelector(
    selectSitePurchaseAmountsDataView,
  );

  return (
    <SitePurchaseAmountsForm
      futureSiteOwnerName={futureSiteOwnerName}
      defaultValues={
        defaultValues
          ? {
              sellingPrice: defaultValues?.sellingPrice,
              propertyTransferDuties: defaultValues?.propertyTransferDuties,
            }
          : undefined
      }
      currentValues={{
        sellingPrice: currentValues?.sellingPrice,
        propertyTransferDuties: currentValues?.propertyTransferDuties,
      }}
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
