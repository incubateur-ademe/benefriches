import { useEffect } from "react";

import { AppDispatch, RootState } from "@/app/application/store";
import { revertYearlyExpensesStep } from "@/features/create-site/application/createSite.actions";
import { completeYearlyExpenses } from "@/features/create-site/application/createSite.reducer";
import {
  EstimatedSiteYearlyExpenses,
  selectEstimatedYearlyExpensesForSite,
} from "@/features/create-site/application/expenses.selectors";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import { hasTenant } from "@/features/create-site/domain/site.functions";
import { Expense, SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteYearlyExpensesForm, { FormValues, Props } from "./SiteYearlyExpensesForm";
import {
  getSiteManagementExpensesWithBearer,
  getSiteSecurityExpensesWithBearer,
  mapFormDataToExpenses,
} from "./mappers";

const mapProps = (
  dispatch: AppDispatch,
  { siteData }: RootState["siteCreation"],
  defaultValues: EstimatedSiteYearlyExpenses,
): Props => {
  const siteHasTenant = hasTenant(siteData as SiteDraft);

  const siteManagementExpensesWithBearer = getSiteManagementExpensesWithBearer(
    siteData.isFriche ?? false,
    siteData.isSiteOperated ?? false,
    siteHasTenant,
  );

  const siteSecurityExpensesWithBearer = getSiteSecurityExpensesWithBearer(
    siteHasTenant,
    siteData.hasRecentAccidents ?? false,
  );

  return {
    hasTenant: siteHasTenant,
    isFriche: !!siteData.isFriche,
    siteManagementExpensesWithBearer,
    siteSecurityExpensesWithBearer,
    defaultValues: {
      maintenance: { amount: defaultValues.maintenanceAmount },
      illegalDumpingCost: { amount: defaultValues.illegalDumpingCostAmount },
      security: { amount: defaultValues.securityAmount },
      propertyTaxes: { amount: defaultValues.propertyTaxesAmount },
    },
    onBack: () => {
      dispatch(revertYearlyExpensesStep());
    },
    onSubmit: (formData: FormValues) => {
      const expenses: Expense[] = mapFormDataToExpenses(formData, [
        ...siteManagementExpensesWithBearer,
        ...siteSecurityExpensesWithBearer,
      ]);

      dispatch(completeYearlyExpenses(expenses));
    },
  };
};

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  const defaultValues = useAppSelector(selectEstimatedYearlyExpensesForSite);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  return <SiteYearlyExpensesForm {...mapProps(dispatch, siteCreationState, defaultValues)} />;
}

export default SiteYearlyExpensesFormContainer;
