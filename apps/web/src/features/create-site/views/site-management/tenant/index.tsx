import { useEffect } from "react";
import FricheTenantForm, { FormValues } from "./SiteTenantForm";

import {
  goToStep,
  setTenant,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { fetchSiteLocalAuthorities } from "@/features/create-site/application/siteLocalAuthorities.actions";
import { SiteLocalAuthorities } from "@/features/create-site/application/siteLocalAuthorities.reducer";
import { Tenant } from "@/features/create-site/domain/siteFoncier.types";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  localAuthorities: SiteLocalAuthorities,
): Tenant => {
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
  const siteDraft = useAppSelector((state) => state.siteCreation.siteData);
  const siteLocalAuthorities = useAppSelector((state) => state.siteLocalAuthorities);
  const { localAuthorities } = siteLocalAuthorities;

  useEffect(() => {
    void dispatch(fetchSiteLocalAuthorities());
  }, [dispatch]);

  const onSubmit = (data: FormValues) => {
    if (!localAuthorities) return;
    const tenant = convertFormValuesForStore(data, localAuthorities);
    if (tenant) {
      dispatch(setTenant(tenant));
    }
    const nextStep = siteDraft.isFriche
      ? SiteCreationStep.RECENT_ACCIDENTS
      : SiteCreationStep.YEARLY_EXPENSES;
    dispatch(goToStep(nextStep));
  };

  return <FricheTenantForm onSubmit={onSubmit} siteLocalAuthorities={siteLocalAuthorities} />;
}

export default FricheTenantFormContainer;
