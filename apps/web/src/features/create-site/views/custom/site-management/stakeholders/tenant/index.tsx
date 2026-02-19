import { useEffect } from "react";

import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { fetchSiteMunicipalityData } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import type { Tenant } from "@/features/create-site/core/siteFoncier.types";
import type { AvailableLocalAuthority } from "@/features/create-site/core/siteMunicipalityData.reducer";
import { tenantStepCompleted } from "@/features/create-site/core/steps/site-management/siteManagement.actions";
import { selectSiteTenantFormViewData } from "@/features/create-site/core/steps/site-management/siteManagement.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import FricheTenantForm, { type FormValues } from "./SiteTenantForm";

const mapInitialValues = (tenant: Tenant | undefined): FormValues | undefined => {
  if (!tenant) return undefined;

  switch (tenant.structureType) {
    case "region":
    case "municipality":
    case "department":
    case "epci":
      return {
        tenantType: "local_or_regional_authority",
        localAuthority: tenant.structureType,
        tenantName: undefined,
        companyName: undefined,
      };
    case "company":
      return {
        tenantType: "company",
        localAuthority: undefined,
        companyName: tenant.name,
        tenantName: undefined,
      };
    case "private_individual":
      return {
        tenantType: "private_individual",
        localAuthority: undefined,
        tenantName: tenant.name,
        companyName: undefined,
      };
  }
};

const convertFormValuesForStore = (
  data: FormValues,
  localAuthorities: AvailableLocalAuthority[],
): Tenant => {
  switch (data.tenantType) {
    case "local_or_regional_authority":
      // eslint-disable-next-line no-case-declarations
      const localAuthority = localAuthorities.find(
        ({ type }) => type === data.localAuthority,
      ) as AvailableLocalAuthority;
      return {
        name: localAuthority.name,
        structureType: data.localAuthority,
      };
    case "company":
      return {
        structureType: "company",
        name: data.companyName,
      };
    case "private_individual":
      return {
        structureType: "private_individual",
        name: data.tenantName,
      };
  }
};

function FricheTenantFormContainer() {
  const dispatch = useAppDispatch();
  const { tenant, localAuthoritiesList } = useAppSelector(selectSiteTenantFormViewData);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  const onSubmit = (data: FormValues) => {
    const tenantData = convertFormValuesForStore(data, localAuthoritiesList);
    dispatch(tenantStepCompleted({ tenant: tenantData }));
  };

  const onBack = () => {
    dispatch(stepReverted());
  };

  return (
    <FricheTenantForm
      initialValues={mapInitialValues(tenant)}
      onSubmit={onSubmit}
      onBack={onBack}
      localAuthoritiesList={localAuthoritiesList}
    />
  );
}

export default FricheTenantFormContainer;
