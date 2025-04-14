import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { yearlyExpensesStepCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import { SiteYearlyExpensesBaseConfig } from "@/features/create-site/core/expenses.functions";
import {
  selectSiteManagementExpensesBaseConfig,
  selectSiteSecurityExpensesBaseConfig,
  selectSiteYearlyExpensesViewData,
} from "@/features/create-site/core/selectors/expenses.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteYearlyExpensesForm, { FormValues } from "./SiteYearlyExpensesForm";
import { getInitialValues, mapFormDataToExpenses } from "./mappers";

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const { siteNature, hasTenant, estimatedAmounts } = useAppSelector(
    selectSiteYearlyExpensesViewData,
  );
  const expensesInStore = useAppSelector((state) => state.siteCreation.siteData.yearlyExpenses);
  const siteManagementExpensesBaseConfig = useAppSelector(selectSiteManagementExpensesBaseConfig);
  const siteSecurityExpensesBaseConfig = useAppSelector(selectSiteSecurityExpensesBaseConfig);

  const expensesBaseconfig: SiteYearlyExpensesBaseConfig = [
    ...siteManagementExpensesBaseConfig,
    ...siteSecurityExpensesBaseConfig,
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
      siteManagementYearlyExpensesBaseConfig={siteManagementExpensesBaseConfig}
      siteSecurityExpensesBaseConfig={siteSecurityExpensesBaseConfig}
    />
  );
}

export default SiteYearlyExpensesFormContainer;
