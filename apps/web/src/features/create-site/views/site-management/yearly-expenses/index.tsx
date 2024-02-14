import { useEffect } from "react";
import { mapFormDataToExpenses } from "./mappers";
import SiteYearlyExpensesForm, { FormValues } from "./SiteYearlyExpensesForm";

import { AppDispatch, RootState } from "@/app/application/store";
import {
  addExpenses,
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "@/features/create-site/domain/defaultValues";
import { hasTenant } from "@/features/create-site/domain/site.functions";
import { Expense, SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (
  dispatch: AppDispatch,
  { siteData }: RootState["siteCreation"],
  population?: number,
) => {
  const siteHasTenant = hasTenant(siteData as SiteDraft);
  const { soilsDistribution = {}, surfaceArea = 0 } = siteData;
  const buildingsSurface = soilsDistribution.BUILDINGS ?? 0;

  return {
    hasTenant: siteHasTenant,
    isFriche: !!siteData.isFriche,
    hasRecentAccidents: !!siteData.hasRecentAccidents,
    prefillIllegalDumpingAmount: computeIllegalDumpingDefaultCost(population ?? 0),
    prefillSecurityAmount: computeSecurityDefaultCost(surfaceArea),
    prefillMaintenanceAmount: computeMaintenanceDefaultCost(buildingsSurface),
    onSubmit: (formData: FormValues) => {
      const expenses: Expense[] = mapFormDataToExpenses(formData, { siteHasTenant });

      dispatch(addExpenses(expenses));

      dispatch(goToStep(SiteCreationStep.EXPENSES_SUMMARY));
    },
  };
};

function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  const { population, loadingState } = useAppSelector((state) => state.siteMunicipalityData);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  if (loadingState === "loading") {
    return "Chargement...";
  }

  return <SiteYearlyExpensesForm {...mapProps(dispatch, siteCreationState, population)} />;
}

export default SiteYearlyExpensesFormContainer;
