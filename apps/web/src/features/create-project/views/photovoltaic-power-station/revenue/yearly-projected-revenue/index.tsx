import { RecurringRevenue } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import ProjectYearlyRevenueForm from "@/features/create-project/views/project-form/common/revenues/yearly-projected-revenue/ProjectYearlyRevenueForm";
import { getLabelForRecurringRevenueSource } from "@/shared/core/reconversionProject";

const fields = ["operations", "other"] as const;

function YearlyProjectedRevenueFormContainer() {
  const { onBack, onRequestStepCompletion, selectPVYearlyProjectedRevenueViewData } =
    useRenewableEnergyForm();
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
      onBack={onBack}
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
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
          answers: { yearlyProjectedRevenues },
        });
      }}
    />
  );
}

export default YearlyProjectedRevenueFormContainer;
