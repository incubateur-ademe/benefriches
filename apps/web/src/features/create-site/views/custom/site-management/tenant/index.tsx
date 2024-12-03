import { useEffect } from "react";

import { revertTenantStep } from "@/features/create-site/application/createSite.actions";
import { completeTenant } from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import {
  AvailableLocalAuthority,
  selectAvailableLocalAuthorities,
} from "@/features/create-site/application/siteMunicipalityData.reducer";
import { Tenant } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import FricheTenantForm, { FormValues } from "./SiteTenantForm";

const convertFormValuesForStore = (
  data: FormValues,
  localAuthorities: AvailableLocalAuthority[],
): Tenant | undefined => {
  if (data.tenantType === "local_or_regional_authority") {
    const localAuthority = localAuthorities.find(
      ({ type }) => type === data.localAuthority,
    ) as AvailableLocalAuthority;
    return {
      name: localAuthority.name,
      structureType: data.localAuthority,
    };
  }

  if (data.tenantType === "company") {
    return {
      structureType: "company",
      name: data.companyName,
    };
  }
  return undefined;
};

function FricheTenantFormContainer() {
  const dispatch = useAppDispatch();
  const localAuthoritiesList = useAppSelector(selectAvailableLocalAuthorities);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  const onSubmit = (data: FormValues) => {
    const tenant = convertFormValuesForStore(data, localAuthoritiesList);
    dispatch(completeTenant({ tenant }));
  };

  const onBack = () => {
    dispatch(revertTenantStep());
  };

  return (
    <FricheTenantForm
      onSubmit={onSubmit}
      onBack={onBack}
      localAuthoritiesList={localAuthoritiesList}
    />
  );
}

export default FricheTenantFormContainer;
