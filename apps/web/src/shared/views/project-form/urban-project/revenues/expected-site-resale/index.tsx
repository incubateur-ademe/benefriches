import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import SiteResaleRevenueForm from "./SiteResaleRevenueForm";

function SiteResaleRevenueFormContainer() {
  const { onBack, selectSiteResaleRevenueViewData, onRequestStepCompletion } = useProjectForm();

  const { isPriceEstimated, initialSellingPrice, initialPropertyTransferDuties } = useAppSelector(
    selectSiteResaleRevenueViewData,
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
      isPriceEstimated={isPriceEstimated}
      initialValues={{
        sellingPrice: initialSellingPrice,
        propertyTransferDuties: initialPropertyTransferDuties,
      }}
    />
  );
}

export default SiteResaleRevenueFormContainer;
