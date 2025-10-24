import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsOperationsExpensesForm from "./BuildingsOperationsExpensesForm";

function YearlyProjectedExpensesFormContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();

  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"),
  );

  return (
    <BuildingsOperationsExpensesForm
      initialValues={{
        maintenance: stepAnswers?.yearlyProjectedBuildingsOperationsExpenses?.find(
          ({ purpose }) => purpose === "maintenance",
        )?.amount,
        taxes: stepAnswers?.yearlyProjectedBuildingsOperationsExpenses?.find(
          ({ purpose }) => purpose === "taxes",
        )?.amount,
        other: stepAnswers?.yearlyProjectedBuildingsOperationsExpenses?.find(
          ({ purpose }) => purpose === "other",
        )?.amount,
      }}
      onSubmit={(formData) => {
        const expenses = (
          [
            { purpose: "maintenance", amount: formData.maintenance ?? 0 },
            { purpose: "taxes", amount: formData.taxes ?? 0 },
            { purpose: "other", amount: formData.other ?? 0 },
          ] as const
        ).filter(({ amount }) => amount > 0);
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
          answers: {
            yearlyProjectedBuildingsOperationsExpenses: expenses,
          },
        });
      }}
      onBack={onBack}
    />
  );
}

export default YearlyProjectedExpensesFormContainer;
