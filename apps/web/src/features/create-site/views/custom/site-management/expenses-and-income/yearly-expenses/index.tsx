import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { yearlyExpensesStepCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import { SiteYearlyExpensesConfig } from "@/features/create-site/core/expenses.functions";
import { selectSiteYearlyExpensesViewData } from "@/features/create-site/core/selectors/expenses.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteYearlyExpensesForm, { FormValues } from "./SiteYearlyExpensesForm";
import { getInitialValues, mapFormDataToExpenses } from "./mappers";

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const {
    siteNature,
    hasTenant,
    estimatedAmounts,
    managementExpensesConfig,
    securityExpensesConfig,
  } = useAppSelector(selectSiteYearlyExpensesViewData);
  const expensesInStore = useAppSelector((state) => state.siteCreation.siteData.yearlyExpenses);

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
        dispatch(stepRevertAttempted());
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
