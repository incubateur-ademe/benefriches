import { useEffect } from "react";
import type { LocalAuthority } from "shared";

import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { fetchSiteMunicipalityData } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import type { Owner } from "@/features/create-site/core/siteFoncier.types";
import type { AvailableLocalAuthority } from "@/features/create-site/core/siteMunicipalityData.reducer";
import { ownerStepCompleted } from "@/features/create-site/core/steps/site-management/siteManagement.actions";
import { selectSiteOwnerFormViewData } from "@/features/create-site/core/steps/site-management/siteManagement.selectors";
import type { UserStructure } from "@/features/onboarding/core/user";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
  const { currentUserStructure, siteNature, owner, localAuthoritiesList } = useAppSelector(
    selectSiteOwnerFormViewData,
  );
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    dispatch(
      ownerStepCompleted({
        owner: convertFormValuesForStore(data, localAuthoritiesList, currentUserStructure),
      }),
    );
  };

  const onBack = () => {
    dispatch(stepReverted());
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
