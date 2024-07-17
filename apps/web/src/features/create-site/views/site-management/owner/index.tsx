import { useEffect } from "react";
import SiteOwnerForm, { FormValues } from "./SiteOwnerForm";

import { revertOwnerStep } from "@/features/create-site/application/createSite.actions";
import { completeOwner } from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import {
  AvailableLocalAuthority,
  getAvailableLocalAuthoritiesWithoutCurrentUser,
} from "@/features/create-site/application/siteMunicipalityData.reducer";
import { Owner } from "@/features/create-site/domain/siteFoncier.types";
import { selectCurrentUserStructure } from "@/features/users/application/user.reducer";
import { UserStructure } from "@/features/users/domain/user";
import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type LocalAuthoritiesList = {
  type: "municipality" | "epci" | "region" | "department";
  name: string;
}[];

const convertFormValuesForStore = (
  data: FormValues,
  siteLocalAuthorities: LocalAuthoritiesList,
  currentUserStructure?: UserStructure,
): Owner => {
  switch (data.ownerType) {
    case "user_structure":
      return {
        name: currentUserStructure?.name ?? "",
        structureType:
          currentUserStructure?.type === "local_authority"
            ? (currentUserStructure.activity as LocalAutorityStructureType)
            : currentUserStructure?.type ?? "company",
      };
    case "local_or_regional_authority": {
      const localAuthority = siteLocalAuthorities.find(
        ({ type }) => type === data.localAuthority,
      ) as AvailableLocalAuthority;
      return {
        name: localAuthority.name,
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
  const isFriche = useAppSelector((state) => state.siteCreation.siteData.isFriche) ?? false;
  const dispatch = useAppDispatch();

  const localAuthoritiesList = useAppSelector(getAvailableLocalAuthoritiesWithoutCurrentUser);

  const onSubmit = (data: FormValues) => {
    dispatch(
      completeOwner({
        owner: convertFormValuesForStore(data, localAuthoritiesList, currentUserStructure),
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
      currentUserStructure={currentUserStructure}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default SiteOwnerFormContainer;
