import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import SiteResaleRevenueForm from "./SiteResaleRevenueForm";

function SiteResaleRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"),
  );

  const onBack = useStepBack();

  return (
    <SiteResaleRevenueForm
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
            answers: {
              siteResaleExpectedSellingPrice: formData.sellingPrice,
              siteResaleExpectedPropertyTransferDuties: formData.propertyTransferDuties,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        sellingPrice: stepAnswers?.siteResaleExpectedSellingPrice,
        propertyTransferDuties: stepAnswers?.siteResaleExpectedPropertyTransferDuties,
      }}
    />
  );
}

export default SiteResaleRevenueFormContainer;
