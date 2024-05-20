import { useEffect } from "react";
import SiteOwnerForm, { FormValues } from "./SiteOwnerForm";

import { revertOwnerStep } from "@/features/create-site/application/createSite.actions";
import { completeOwner } from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import {
  LoadingState,
  SiteLocalAuthorities,
} from "@/features/create-site/application/siteMunicipalityData.reducer";
import { Owner } from "@/features/create-site/domain/siteFoncier.types";
import { selectCurrentUserStructure } from "@/features/users/application/user.reducer";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type LocalAuthoritiesList = {
  type: "municipality" | "epci" | "region" | "department";
  name: string;
}[];

const getLocalAuthoritiesList = (
  siteLocalAuthorities?: SiteLocalAuthorities,
): LocalAuthoritiesList => {
  const { city, department, region, epci } = siteLocalAuthorities ?? {
    city: { name: "Mairie" },
    department: { name: "Département" },
    region: { name: "Région" },
    epci: { name: "Établissement public de coopération intercommunale" },
  };

  return [
    {
      type: "municipality",
      name: city.name,
    },
    {
      type: "epci",
      name: epci?.name ?? "Établissement public de coopération intercommunale",
    },
    {
      type: "department",
      name: department.name,
    },
    {
      type: "region",
      name: region.name,
    },
  ];
};

const convertFormValuesForStore = (
  data: FormValues,
  currentUserStructure: string,
  siteLocalAuthorities: LocalAuthoritiesList,
  siteLocalAuthoritiesLoadingState: LoadingState,
): Owner => {
  switch (data.ownerType) {
    case "user_company":
      return {
        name: currentUserStructure,
        structureType: "company",
      };
    case "local_or_regional_authority": {
      const localAuthority = siteLocalAuthorities.find(({ type }) => type === data.localAuthority);
      if (siteLocalAuthoritiesLoadingState === "success" && localAuthority) {
        return {
          name: formatLocalAuthorityName(data.localAuthority, localAuthority.name),
          structureType: data.localAuthority,
        };
      }
      return {
        name: localAuthority?.name ?? "",
        structureType: data.localAuthority,
      };
    }
    case "other_company":
      return {
        name: data.ownerName,
        structureType: "company",
      };
    case "private_individual":
      return {
        name: data.ownerName,
        structureType: "private_individual",
      };
  }
};

function SiteOwnerFormContainer() {
  const currentUserStructure = useAppSelector(selectCurrentUserStructure);
  const { localAuthorities, loadingState } = useAppSelector((state) => state.siteMunicipalityData);
  const isFriche = useAppSelector((state) => state.siteCreation.siteData.isFriche) ?? false;
  const dispatch = useAppDispatch();

  const localAuthoritiesList = getLocalAuthoritiesList(localAuthorities);

  const onSubmit = (data: FormValues) => {
    if (!localAuthorities) return;
    dispatch(
      completeOwner({
        owner: convertFormValuesForStore(
          data,
          currentUserStructure?.name || "",
          localAuthoritiesList,
          loadingState,
        ),
      }),
    );
  };

  const onBack = () => {
    dispatch(revertOwnerStep());
  };

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  return (
    <SiteOwnerForm
      isFriche={isFriche}
      localAuthoritiesList={localAuthoritiesList}
      localAuthoritiesLoadingState={loadingState}
      currentUserStructureName={currentUserStructure?.name}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default SiteOwnerFormContainer;
