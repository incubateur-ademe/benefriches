import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { yearlyExpensesStepCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import type { SiteYearlyExpensesConfig } from "@/features/create-site/core/expenses.functions";
import { selectSiteYearlyExpensesViewData } from "@/features/create-site/core/selectors/expenses.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
        dispatch(stepReverted());
      }}
      onSubmit={(formData: FormValues) => {
        const expenses = mapFormDataToExpenses(formData, expensesBaseconfig);
        dispatch(yearlyExpensesStepCompleted(expenses));
      }}
      siteManagementYearlyExpensesConfig={managementExpensesConfig}
      siteSecurityExpensesConfig={securityExpensesConfig}
    />
  );
}

export default SiteYearlyExpensesFormContainer;
