import { useAppSelector } from "@/app/hooks/store.hooks";
import type { LocalAuthorityExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/local-authority-expenses/localAuthorityExpenses.schema";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import LocalAuthorityExpensesForm from "./LocalAuthorityExpensesForm";

function LocalAuthorityExpensesContainer() {
  const { onBack, onRequestStepCompletion, selectLocalAuthorityExpensesViewData } =
    useUrbanZoneSiteForm();
  const { initialValues } = useAppSelector(selectLocalAuthorityExpensesViewData);

  const onSubmit = (data: LocalAuthorityExpenses) => {
    onRequestStepCompletion({
      stepId: "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
      answers: data,
    });
  };

  return (
    <LocalAuthorityExpensesForm initialValues={initialValues} onSubmit={onSubmit} onBack={onBack} />
  );
}

export default LocalAuthorityExpensesContainer;
