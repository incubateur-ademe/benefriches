import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import BuildingsResaleRevenueForm from "./BuildingsResaleRevenueForm";

function BuildingsResaleRevenueFormContainer() {
  const { onBack, onRequestStepCompletion, selectStepValues, selectSiteCityReferenceViewData } =
    useProjectForm();

  const stepValues = useAppSelector(selectStepValues("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE"));

  const cityReferenceData = useAppSelector(selectSiteCityReferenceViewData);

  return (
    <BuildingsResaleRevenueForm
      landAndRealEstateValues={cityReferenceData}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
          answers: {
            buildingsResaleSellingPrice: formData.sellingPrice,
            buildingsResalePropertyTransferDuties: formData.propertyTransferDuties,
          },
        });
      }}
      onBack={onBack}
      defaultValues={{
        sellingPrice: stepValues?.defaultValues?.buildingsResaleSellingPrice,
        propertyTransferDuties: stepValues?.defaultValues?.buildingsResalePropertyTransferDuties,
      }}
      currentValues={{
        sellingPrice: stepValues?.payload?.buildingsResaleSellingPrice,
        propertyTransferDuties: stepValues?.payload?.buildingsResalePropertyTransferDuties,
      }}
    />
  );
}

export default BuildingsResaleRevenueFormContainer;
