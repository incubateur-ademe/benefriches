import { useEffect } from "react";
import { LocalAuthority } from "shared";

import {
  ownerStepCompleted,
  ownerStepReverted,
} from "@/features/create-site/core/actions/siteManagement.actions";
import { fetchSiteMunicipalityData } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import { selectSiteOwner } from "@/features/create-site/core/selectors/createSite.selectors";
import { Owner } from "@/features/create-site/core/siteFoncier.types";
import {
  AvailableLocalAuthority,
  selectAvailableLocalAuthoritiesWithoutCurrentUser,
} from "@/features/create-site/core/siteMunicipalityData.reducer";
import { UserStructure } from "@/features/onboarding/core/user";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteOwnerForm, { FormValues } from "./SiteOwnerForm";

type LocalAuthoritiesList = {
  type: LocalAuthority;
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
            ? (currentUserStructure.activity as LocalAuthority)
            : (currentUserStructure?.type ?? "company"),
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

const mapInitialValues = (
  owner: Owner | undefined,
  currentUserStructure: UserStructure | undefined,
): FormValues | undefined => {
  if (!owner) return undefined;

  if (
    owner.structureType === currentUserStructure?.type &&
    owner.name === currentUserStructure.name
  ) {
    return {
      ownerType: "user_structure",
      localAuthority: undefined,
      ownerName: undefined,
    };
  }

  switch (owner.structureType) {
    case "region":
    case "municipality":
    case "department":
    case "epci":
      return {
        ownerType: "local_or_regional_authority",
        localAuthority: owner.structureType,
        ownerName: undefined,
      };
    case "company":
      return {
        ownerType: "other_company",
        localAuthority: undefined,
        ownerName: owner.name,
      };
    case "private_individual":
      return {
        ownerType: "private_individual",
        localAuthority: undefined,
        ownerName: owner.name,
      };
  }
};

function SiteOwnerFormContainer() {
  const currentUserStructure = useAppSelector(selectCurrentUserStructure);
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);
  const owner = useAppSelector(selectSiteOwner);
  const dispatch = useAppDispatch();

  const localAuthoritiesList = useAppSelector(selectAvailableLocalAuthoritiesWithoutCurrentUser);

  const onSubmit = (data: FormValues) => {
    dispatch(
      ownerStepCompleted({
        owner: convertFormValuesForStore(data, localAuthoritiesList, currentUserStructure),
      }),
    );
  };

  const onBack = () => {
    dispatch(ownerStepReverted());
  };

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  return (
    <SiteOwnerForm
      initialValues={mapInitialValues(owner, currentUserStructure)}
      siteNature={siteNature}
      localAuthoritiesList={localAuthoritiesList}
      currentUserStructure={currentUserStructure}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default SiteOwnerFormContainer;
