import { useAppSelector } from "@/app/hooks/store.hooks";
import type { VacantPremisesExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.schema";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import VacantPremisesExpensesForm from "./VacantPremisesExpensesForm";

function VacantPremisesExpensesContainer() {
  const { onBack, onRequestStepCompletion, selectVacantPremisesExpensesViewData } =
    useUrbanZoneSiteForm();
  const { initialValues } = useAppSelector(selectVacantPremisesExpensesViewData);

  const onSubmit = (data: VacantPremisesExpenses) => {
    onRequestStepCompletion({
      stepId: "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
      answers: data,
    });
  };

  return (
    <VacantPremisesExpensesForm initialValues={initialValues} onSubmit={onSubmit} onBack={onBack} />
  );
}

export default VacantPremisesExpensesContainer;
