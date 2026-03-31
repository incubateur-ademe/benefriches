import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsConstructionAndRehabilitationExpensesForm from "./BuildingsConstructionAndRehabilitationExpensesForm";

export default function BuildingsConstructionAndRehabilitationExpensesContainer() {
  const {
    onBack,
    onRequestStepCompletion,
    selectExpensesBuildingsConstructionAndRehabilitationViewData,
  } = useProjectForm();
  const viewData = useAppSelector(selectExpensesBuildingsConstructionAndRehabilitationViewData);

  return (
    <BuildingsConstructionAndRehabilitationExpensesForm
      initialValues={{
        technicalStudiesAndFees: viewData.technicalStudiesAndFees,
        buildingsConstructionWorks: viewData.buildingsConstructionWorks,
        buildingsRehabilitationWorks: viewData.buildingsRehabilitationWorks,
        otherConstructionExpenses: viewData.otherConstructionExpenses,
      }}
      hasConstruction={viewData.hasConstruction}
      hasRehabilitation={viewData.hasRehabilitation}
      onBack={onBack}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
          answers: {
            technicalStudiesAndFees: formData.technicalStudiesAndFees,
            buildingsConstructionWorks: viewData.hasConstruction
              ? formData.buildingsConstructionWorks
              : undefined,
            buildingsRehabilitationWorks: viewData.hasRehabilitation
              ? formData.buildingsRehabilitationWorks
              : undefined,
            otherConstructionExpenses: formData.otherConstructionExpenses,
          },
        });
      }}
    />
  );
}
