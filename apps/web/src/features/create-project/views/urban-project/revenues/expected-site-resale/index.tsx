import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import SiteResaleRevenueForm from "./SiteResaleRevenueForm";

function SiteResaleRevenueFormContainer() {
  const { onBack, selectSiteResaleRevenueViewData, onRequestStepCompletion } = useProjectForm();

  const { landAndRealEstateValues, defaultValues, currentValues } = useAppSelector(
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
      landValues={landAndRealEstateValues}
      defaultValues={{
        sellingPrice: defaultValues?.sellingPrice,
        propertyTransferDuties: defaultValues?.propertyTransferDuties,
      }}
      currentValues={{
        sellingPrice: currentValues.sellingPrice,
        propertyTransferDuties: currentValues.propertyTransferDuties,
      }}
    />
  );
}

export default SiteResaleRevenueFormContainer;
