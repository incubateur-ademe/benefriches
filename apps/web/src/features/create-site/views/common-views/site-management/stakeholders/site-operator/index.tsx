import { useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import type { Tenant } from "@/features/create-site/core/siteFoncier.types";
import type { AvailableLocalAuthority } from "@/features/create-site/core/siteMunicipalityData.reducer";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteOperatorForm, { type FormValues } from "./SiteOperatorForm";

const getTenant = (
  data: FormValues,
  localAuthorities: AvailableLocalAuthority[],
): Tenant | undefined => {
  switch (data.operator) {
    case "company":
      return {
        structureType: data.operator,
        name: data.companyName,
      };
    case "private_individual":
      return {
        structureType: data.operator,
        name: data.operatorName,
      };
    case "local_or_regional_authority": {
      const localAuthority = localAuthorities.find(
        ({ type }) => type === data.localAuthority,
      ) as AvailableLocalAuthority;
      return {
        name: localAuthority.name,
        structureType: data.localAuthority,
      };
    }
    case "site_owner": // si l'exploitant est le propriétaire, alors il n'y a pas de locataire
      return undefined;
  }
};

function SiteOperatorFormContainer() {
  const {
    onBack,
    onRequestStepCompletion,
    onFetchSiteMunicipalityData,
    selectSiteOperatorFormViewData,
  } = useCustomSiteForm();
  const { siteOwner, localAuthoritiesList } = useAppSelector(selectSiteOperatorFormViewData);

  useEffect(() => {
    void onFetchSiteMunicipalityData();
  }, [onFetchSiteMunicipalityData]);

  const onSubmit = (data: FormValues) => {
    onRequestStepCompletion({
      stepId: "OPERATOR",
      answers: { tenant: getTenant(data, localAuthoritiesList) },
    });
  };

  return (
    <SiteOperatorForm
      onSubmit={onSubmit}
      onBack={onBack}
      localAuthoritiesList={localAuthoritiesList}
      currentOwnerStructureName={siteOwner?.name ?? ""}
    />
  );
}

export default SiteOperatorFormContainer;
