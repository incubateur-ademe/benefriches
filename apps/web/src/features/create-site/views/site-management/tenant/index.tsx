import { useEffect } from "react";
import FricheTenantForm, { FormValues } from "./SiteTenantForm";

import { completeTenant } from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import { SiteLocalAuthorities } from "@/features/create-site/application/siteMunicipalityData.reducer";
import { Tenant } from "@/features/create-site/domain/siteFoncier.types";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  localAuthorities: SiteLocalAuthorities,
): Tenant | undefined => {
  if (data.tenantType === "local_or_regional_authority") {
    return {
      name: formatLocalAuthorityName(data.localAuthority, localAuthorities),
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
  const { localAuthorities, loadingState } = useAppSelector((state) => state.siteMunicipalityData);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  const onSubmit = (data: FormValues) => {
    if (!localAuthorities) return;
    const tenant = convertFormValuesForStore(data, localAuthorities);
    dispatch(completeTenant({ tenant }));
  };

  return (
    <FricheTenantForm
      onSubmit={onSubmit}
      siteLocalAuthorities={{ localAuthorities, loadingState }}
    />
  );
}

export default FricheTenantFormContainer;
