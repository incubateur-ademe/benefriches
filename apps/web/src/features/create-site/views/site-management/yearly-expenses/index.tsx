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
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "@/features/create-site/domain/defaultValues";
import { hasTenant } from "@/features/create-site/domain/site.functions";
import { Expense, SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const getDefaultValues = (siteData: SiteDraft, population?: number) => {
  const { soilsDistribution = {}, surfaceArea, isFriche } = siteData;
  const buildingsSurface = soilsDistribution.BUILDINGS;
  const maintenance = buildingsSurface
    ? computeMaintenanceDefaultCost(buildingsSurface)
    : undefined;

  if (isFriche) {
    const illegalDumpingCost = population
      ? computeIllegalDumpingDefaultCost(population)
      : undefined;
    const security = surfaceArea ? computeSecurityDefaultCost(surfaceArea) : undefined;

    return {
      illegalDumpingCost: { amount: illegalDumpingCost },
      security: { amount: security },
      maintenance: { amount: maintenance },
    };
  }
  return {
    maintenance: { amount: maintenance },
  };
};

const mapProps = (
  dispatch: AppDispatch,
  { siteData }: RootState["siteCreation"],
  population?: number,
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
    defaultValues: getDefaultValues(siteData as SiteDraft, population),
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

  const { population, loadingState } = useAppSelector((state) => state.siteMunicipalityData);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  if (loadingState === "loading") {
    return <LoadingSpinner />;
  }

  return <SiteYearlyExpensesForm {...mapProps(dispatch, siteCreationState, population)} />;
}

export default SiteYearlyExpensesFormContainer;
