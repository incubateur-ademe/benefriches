import { useAppSelector } from "@/app/hooks/store.hooks";
import SitePurchaseAmountsForm from "@/features/create-project/views/project-form/common/expenses/site-purchase-amounts/SitePurchaseAmountsForm";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

function SitePurchaseAmountsContainer() {
  const { onBack, onRequestStepCompletion, selectSitePurchaseAmountsDataView } = useProjectForm();
  const { currentValues, defaultValues, futureSiteOwnerName, landAndRealEstateValues } =
    useAppSelector(selectSitePurchaseAmountsDataView);

  return (
    <SitePurchaseAmountsForm
      futureSiteOwnerName={futureSiteOwnerName}
      landAndRealEstateValues={landAndRealEstateValues}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: {
            sitePurchasePropertyTransferDuties: formData.propertyTransferDuties,
            sitePurchaseSellingPrice: formData.sellingPrice,
          },
        });
      }}
      onBack={onBack}
      defaultValues={
        defaultValues
          ? {
              sellingPrice: defaultValues?.sitePurchaseSellingPrice,
              propertyTransferDuties: defaultValues?.sitePurchasePropertyTransferDuties,
            }
          : undefined
      }
      currentValues={{
        sellingPrice: currentValues?.sitePurchaseSellingPrice,
        propertyTransferDuties: currentValues?.sitePurchasePropertyTransferDuties,
      }}
    />
  );
}

export default SitePurchaseAmountsContainer;
