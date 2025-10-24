import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsResaleRevenueForm from "./BuildingsResaleRevenueForm";

function BuildingsResaleRevenueFormContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE"));

  return (
    <BuildingsResaleRevenueForm
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
      initialValues={{
        sellingPrice: stepAnswers?.buildingsResaleSellingPrice,
        propertyTransferDuties: stepAnswers?.buildingsResalePropertyTransferDuties,
      }}
    />
  );
}

export default BuildingsResaleRevenueFormContainer;
