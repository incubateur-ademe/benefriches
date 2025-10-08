import { requestStepCompletion } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import BuildingsResaleRevenueForm from "./BuildingsResaleRevenueForm";

function BuildingsResaleRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE"));
  const onBack = useStepBack();

  return (
    <BuildingsResaleRevenueForm
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
            answers: {
              buildingsResaleSellingPrice: formData.sellingPrice,
              buildingsResalePropertyTransferDuties: formData.propertyTransferDuties,
            },
          }),
        );
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
