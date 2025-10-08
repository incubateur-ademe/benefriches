import {
  getLabelForYearlyBuildingsOperationsRevenues,
  YearlyBuildingsOperationsRevenues,
} from "shared";

import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import ProjectYearlyRevenuesForm from "@/features/create-project/views/common-views/revenues/yearly-projected-revenue/ProjectYearlyRevenueForm";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";

const fields = ["rent", "other"] as const;

export default function YearlyBuildingsOperationsRevenuesForm() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"),
  );
  const onBack = useStepBack();

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
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
            answers: {
              yearlyProjectedRevenues: revenues,
            },
          }),
        );
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
