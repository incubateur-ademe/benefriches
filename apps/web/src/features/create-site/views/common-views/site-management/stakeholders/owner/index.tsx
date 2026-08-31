import { useEffect } from "react";
import type { LocalAuthority } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import type { Owner } from "@/features/create-site/core/siteFoncier.types";
import type { AvailableLocalAuthority } from "@/features/create-site/core/siteMunicipalityData.reducer";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import type { UserStructure } from "@/features/onboarding/core/user";

import SiteOwnerForm, { type FormValues } from "./SiteOwnerForm";

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
  const {
    onBack,
    onRequestStepCompletion,
    onFetchSiteMunicipalityData,
    selectSiteOwnerFormViewData,
  } = useCustomSiteForm();
  const { currentUserStructure, siteNature, owner, localAuthoritiesList } = useAppSelector(
    selectSiteOwnerFormViewData,
  );

  const onSubmit = (data: FormValues) => {
    onRequestStepCompletion({
      stepId: "OWNER",
      answers: {
        owner: convertFormValuesForStore(data, localAuthoritiesList, currentUserStructure),
      },
    });
  };

  useEffect(() => {
    void onFetchSiteMunicipalityData();
  }, [onFetchSiteMunicipalityData]);

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
