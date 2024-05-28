import { useEffect } from "react";
import SiteOperatorForm, { FormValues } from "./SiteOperatorForm";

import { revertOperatorStep } from "@/features/create-site/application/createSite.actions";
import { completeOperator } from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import {
  getAvailableLocalAuthorities,
  LocalAuthority,
} from "@/features/create-site/application/siteMunicipalityData.reducer";
import { Tenant } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const getTenant = (data: FormValues, localAuthorities: LocalAuthority[]): Tenant | undefined => {
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
      ) as LocalAuthority;
      return {
        name: localAuthority.name,
        structureType: data.localAuthority,
      };
    }
    case "site_owner": // si l’exploitant est le propriétaire, alors il n’y a pas de locataire
      return undefined;
  }
};

function SiteOperatorFormContainer() {
  const dispatch = useAppDispatch();
  const siteOwner = useAppSelector((state) => state.siteCreation.siteData.owner);
  const localAuthoritiesList = useAppSelector(getAvailableLocalAuthorities);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  const onSubmit = (data: FormValues) => {
    dispatch(completeOperator({ tenant: getTenant(data, localAuthoritiesList) }));
  };

  const onBack = () => {
    dispatch(revertOperatorStep());
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
