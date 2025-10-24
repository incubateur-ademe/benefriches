import SitePurchaseAmountsForm from "@/features/create-project/views/common-views/expenses/site-purchase-amounts/SitePurchaseAmountsForm";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function SitePurchaseAmountsContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS"),
  );

  return (
    <SitePurchaseAmountsForm
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
      initialValues={{
        sellingPrice: stepAnswers?.sitePurchaseSellingPrice,
        propertyTransferDuties: stepAnswers?.sitePurchasePropertyTransferDuties,
      }}
    />
  );
}

export default SitePurchaseAmountsContainer;
