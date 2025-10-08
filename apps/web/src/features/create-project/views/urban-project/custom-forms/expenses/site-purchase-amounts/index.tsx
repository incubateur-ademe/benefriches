import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import SitePurchaseAmountsForm from "@/features/create-project/views/common-views/expenses/site-purchase-amounts/SitePurchaseAmountsForm";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";

function SitePurchaseAmountsContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS"),
  );
  const onBack = useStepBack();

  return (
    <SitePurchaseAmountsForm
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
            answers: {
              sitePurchasePropertyTransferDuties: formData.propertyTransferDuties,
              sitePurchaseSellingPrice: formData.sellingPrice,
            },
          }),
        );
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
