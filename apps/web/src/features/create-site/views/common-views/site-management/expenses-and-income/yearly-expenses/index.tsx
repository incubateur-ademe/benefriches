import { useAppSelector } from "@/app/hooks/store.hooks";
import type { SiteYearlyExpensesConfig } from "@/features/create-site/core/steps/site-management/expenses.functions";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteYearlyExpensesForm, { type FormValues } from "./SiteYearlyExpensesForm";
import { getInitialValues, mapFormDataToExpenses } from "./mappers";

function SiteYearlyExpensesFormContainer() {
  const { onBack, onRequestStepCompletion, selectSiteYearlyExpensesViewData } = useCustomSiteForm();
  const {
    siteNature,
    hasTenant,
    estimatedAmounts,
    managementExpensesConfig,
    securityExpensesConfig,
    expensesInStore,
  } = useAppSelector(selectSiteYearlyExpensesViewData);

  const expensesBaseconfig: SiteYearlyExpensesConfig = [
    ...managementExpensesConfig,
    ...securityExpensesConfig,
  ];

  return (
    <SiteYearlyExpensesForm
      siteNature={siteNature}
      hasTenant={hasTenant}
      initialValues={getInitialValues(expensesBaseconfig, expensesInStore, estimatedAmounts)}
      onBack={() => {
        onBack();
      }}
      onSubmit={(formData: FormValues) => {
        const expenses = mapFormDataToExpenses(formData, expensesBaseconfig);
        onRequestStepCompletion({ stepId: "YEARLY_EXPENSES", answers: expenses });
      }}
      siteManagementYearlyExpensesConfig={managementExpensesConfig}
      siteSecurityExpensesConfig={securityExpensesConfig}
    />
  );
}

export default SiteYearlyExpensesFormContainer;
