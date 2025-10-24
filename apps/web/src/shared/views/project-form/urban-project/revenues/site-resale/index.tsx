import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import SiteResaleRevenueForm from "./SiteResaleRevenueForm";

function SiteResaleRevenueFormContainer() {
  const { onBack, selectStepAnswers, onRequestStepCompletion } = useProjectForm();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"),
  );

  return (
    <SiteResaleRevenueForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          answers: {
            siteResaleExpectedSellingPrice: formData.sellingPrice,
            siteResaleExpectedPropertyTransferDuties: formData.propertyTransferDuties,
          },
        });
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
