import {
  getLabelForYearlyBuildingsOperationsRevenues,
  YearlyBuildingsOperationsRevenues,
} from "shared";

import {
  yearlyBuildingsOperationsRevenuesCompleted,
  yearlyBuildingsOperationsRevenuesReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import ProjectYearlyRevenuesForm from "@/features/create-project/views/common-views/revenues/yearly-projected-revenue/ProjectYearlyRevenueForm";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const fields = ["rent", "other"] as const;

export default function YearlyBuildingsOperationsRevenuesForm() {
  const dispatch = useAppDispatch();

  return (
    <ProjectYearlyRevenuesForm
      title="Recettes annuelles d'exploitation des bâtiments"
      fields={fields}
      getFieldLabel={getLabelForYearlyBuildingsOperationsRevenues}
      onBack={() => {
        dispatch(yearlyBuildingsOperationsRevenuesReverted());
      }}
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
        dispatch(yearlyBuildingsOperationsRevenuesCompleted(revenues));
      }}
    />
  );
}
