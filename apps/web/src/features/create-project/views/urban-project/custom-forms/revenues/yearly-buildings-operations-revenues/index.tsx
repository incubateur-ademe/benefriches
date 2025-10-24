import {
  getLabelForYearlyBuildingsOperationsRevenues,
  YearlyBuildingsOperationsRevenues,
} from "shared";

import ProjectYearlyRevenuesForm from "@/features/create-project/views/common-views/revenues/yearly-projected-revenue/ProjectYearlyRevenueForm";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

const fields = ["rent", "other"] as const;

export default function YearlyBuildingsOperationsRevenuesForm() {
  const { onBack, selectStepAnswers, onRequestStepCompletion } = useProjectForm();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"),
  );

  return (
    <ProjectYearlyRevenuesForm
      title="Recettes annuelles d'exploitation des bâtiments"
      instructions={
        <p>
          Les montants sont exprimés en <strong>€ HT</strong>.
        </p>
      }
      fields={fields}
      getFieldLabel={getLabelForYearlyBuildingsOperationsRevenues}
      onSubmit={(formData) => {
        const revenues: YearlyBuildingsOperationsRevenues[] = [];
        for (const field of fields) {
          if (formData[field]) {
            revenues.push({
              source: field,
              amount: formData[field],
            });
          }
        }
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          answers: {
            yearlyProjectedRevenues: revenues,
          },
        });
      }}
      onBack={onBack}
      initialValues={{
        rent:
          stepAnswers?.yearlyProjectedRevenues?.find(({ source }) => source === "rent")?.amount ??
          0,
        other:
          stepAnswers?.yearlyProjectedRevenues?.find(({ source }) => source === "other")?.amount ??
          0,
      }}
    />
  );
}
