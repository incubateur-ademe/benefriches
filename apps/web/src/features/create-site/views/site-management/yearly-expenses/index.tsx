import { useEffect } from "react";
import {
  getSiteManagementExpensesWithBearer,
  getSiteSecurityExpensesWithBearer,
  mapFormDataToExpenses,
} from "./mappers";
import SiteYearlyExpensesForm, { FormValues } from "./SiteYearlyExpensesForm";

import { AppDispatch, RootState } from "@/app/application/store";
import { revertYearlyExpensesStep } from "@/features/create-site/application/createSite.actions";
import { completeYearlyExpenses } from "@/features/create-site/application/createSite.reducer";
import { getDefaultValuesForYearlyExpenses } from "@/features/create-site/application/expenses.selectors";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import { hasTenant } from "@/features/create-site/domain/site.functions";
import { Expense, SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (
  dispatch: AppDispatch,
  { siteData }: RootState["siteCreation"],
  defaultValues: {
    illegalDumpingCostAmount?: number;
    securityAmount?: number;
    maintenanceAmount?: number;
  },
) => {
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

  const defaultValues = useAppSelector(getDefaultValuesForYearlyExpenses);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  return <SiteYearlyExpensesForm {...mapProps(dispatch, siteCreationState, defaultValues)} />;
}

export default SiteYearlyExpensesFormContainer;
