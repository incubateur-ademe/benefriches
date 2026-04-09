import { RecurringRevenue } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVYearlyProjectedRevenueViewData } from "@/features/create-project/core/renewable-energy/step-handlers/revenue/revenue-yearly-projected/revenueYearlyProjected.selector";
import { getLabelForRecurringRevenueSource } from "@/shared/core/reconversionProject";
import ProjectYearlyRevenueForm from "@/shared/views/project-form/common/revenues/yearly-projected-revenue/ProjectYearlyRevenueForm";

const fields = ["operations", "other"] as const;

function YearlyProjectedRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectPVYearlyProjectedRevenueViewData);

  return (
    <ProjectYearlyRevenueForm
      title="Recettes annuelles"
      getFieldLabel={getLabelForRecurringRevenueSource}
      fields={fields}
      initialValues={{
        operations: initialValues.operations,
        other: initialValues.other,
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
      onSubmit={(formData) => {
        const yearlyProjectedRevenues: RecurringRevenue[] = [];
        for (const field of fields) {
          if (formData[field]) {
            yearlyProjectedRevenues.push({
              source: field,
              amount: formData[field],
            });
          }
        }
        dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
            answers: { yearlyProjectedRevenues },
          }),
        );
      }}
    />
  );
}

export default YearlyProjectedRevenueFormContainer;
