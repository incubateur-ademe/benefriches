import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import type { SiteYearlyExpensesConfig } from "@/features/create-site/core/steps/site-management/expenses.functions";
import { selectSiteYearlyExpensesViewData } from "@/features/create-site/core/steps/site-management/siteManagement.selectors";

import SiteYearlyExpensesForm, { type FormValues } from "./SiteYearlyExpensesForm";
import { getInitialValues, mapFormDataToExpenses } from "./mappers";

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
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
        dispatch(previousStepRequested());
      }}
      onSubmit={(formData: FormValues) => {
        const expenses = mapFormDataToExpenses(formData, expensesBaseconfig);
        dispatch(stepCompletionRequested({ stepId: "YEARLY_EXPENSES", answers: expenses }));
      }}
      siteManagementYearlyExpensesConfig={managementExpensesConfig}
      siteSecurityExpensesConfig={securityExpensesConfig}
    />
  );
}

export default SiteYearlyExpensesFormContainer;
