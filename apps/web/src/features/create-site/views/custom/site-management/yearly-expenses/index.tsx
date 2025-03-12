import { useEffect } from "react";

import { revertYearlyExpensesStep } from "@/features/create-site/core/actions/createSite.actions";
import { fetchSiteMunicipalityData } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import { completeYearlyExpenses } from "@/features/create-site/core/createSite.reducer";
import { SiteYearlyExpensesBaseConfig } from "@/features/create-site/core/expenses.functions";
import {
  selectEstimatedYearlyExpensesForSite,
  selectSiteManagementExpensesBaseConfig,
  selectSiteSecurityExpensesBaseConfig,
} from "@/features/create-site/core/selectors/expenses.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteYearlyExpensesForm, { FormValues } from "./SiteYearlyExpensesForm";
import { getInitialValues, mapFormDataToExpenses } from "./mappers";

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);
  const expensesInStore = useAppSelector((state) => state.siteCreation.siteData.yearlyExpenses);
  const siteManagementExpensesBaseConfig = useAppSelector(selectSiteManagementExpensesBaseConfig);
  const siteSecurityExpensesBaseConfig = useAppSelector(selectSiteSecurityExpensesBaseConfig);
  const siteExpensesEstimatedAmounts = useAppSelector(selectEstimatedYearlyExpensesForSite);

  const expensesBaseconfig: SiteYearlyExpensesBaseConfig = [
    ...siteManagementExpensesBaseConfig,
    ...siteSecurityExpensesBaseConfig,
  ];

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);
  return (
    <SiteYearlyExpensesForm
      hasTenant={!!siteCreationState.siteData.tenant}
      siteNature={siteCreationState.siteData.nature}
      initialValues={getInitialValues(
        expensesBaseconfig,
        expensesInStore,
        siteExpensesEstimatedAmounts,
      )}
      onBack={() => {
        dispatch(revertYearlyExpensesStep());
      }}
      onSubmit={(formData: FormValues) => {
        const expenses = mapFormDataToExpenses(formData, expensesBaseconfig);
        dispatch(completeYearlyExpenses(expenses));
      }}
      siteManagementYearlyExpensesBaseConfig={siteManagementExpensesBaseConfig}
      siteSecurityExpensesBaseConfig={siteSecurityExpensesBaseConfig}
    />
  );
}

export default SiteYearlyExpensesFormContainer;
