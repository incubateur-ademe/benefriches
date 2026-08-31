import { useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import type { Tenant } from "@/features/create-site/core/siteFoncier.types";
import type { AvailableLocalAuthority } from "@/features/create-site/core/siteMunicipalityData.reducer";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

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
  const {
    onBack,
    onRequestStepCompletion,
    onFetchSiteMunicipalityData,
    selectSiteTenantFormViewData,
  } = useCustomSiteForm();
  const { tenant, localAuthoritiesList } = useAppSelector(selectSiteTenantFormViewData);

  useEffect(() => {
    void onFetchSiteMunicipalityData();
  }, [onFetchSiteMunicipalityData]);

  const onSubmit = (data: FormValues) => {
    const tenantData = convertFormValuesForStore(data, localAuthoritiesList);
    onRequestStepCompletion({ stepId: "TENANT", answers: { tenant: tenantData } });
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
