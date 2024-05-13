import { useEffect } from "react";
import SiteOperatorForm, { FormValues } from "./SiteOperatorForm";

import { revertOperatorStep } from "@/features/create-site/application/createSite.actions";
import { completeOperator } from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import {
  LoadingState,
  SiteLocalAuthorities,
} from "@/features/create-site/application/siteMunicipalityData.reducer";
import { Operator } from "@/features/create-site/domain/siteFoncier.types";
import { OwnerStructureType } from "@/shared/domain/stakeholder";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type LocalAuthoritiesList = {
  type: "municipality" | "epci" | "region" | "department";
  name: string;
}[];

const getLocalAuthoritiesList = (
  siteOwnerStructureType?: OwnerStructureType,
  siteLocalAuthorities?: SiteLocalAuthorities,
): LocalAuthoritiesList => {
  const localAuthorities: LocalAuthoritiesList = [];

  const { city, department, region, epci } = siteLocalAuthorities ?? {
    city: { name: "Mairie" },
    department: { name: "Département" },
    region: { name: "Région" },
    epci: { name: "Établissement public de coopération intercommunale" },
  };

  if (siteOwnerStructureType !== "municipality") {
    localAuthorities.push({
      type: "municipality",
      name: city.name,
    });
  }
  if (siteOwnerStructureType !== "epci") {
    localAuthorities.push({
      type: "epci",
      name: epci?.name ?? "Établissement public de coopération intercommunale",
    });
  }
  if (siteOwnerStructureType !== "department") {
    localAuthorities.push({
      type: "department",
      name: department.name,
    });
  }
  if (siteOwnerStructureType !== "region") {
    localAuthorities.push({
      type: "region",
      name: region.name,
    });
  }
  return localAuthorities;
};

const convertFormValuesForStore = (
  data: FormValues,
  localAuthorities: LocalAuthoritiesList,
  localAuthoritiesLoadingState: LoadingState,
): Operator | undefined => {
  if (data.operatorStructureType === "local_or_regional_authority") {
    const localAuthority = localAuthorities.find(({ type }) => type === data.localAuthority);
    if (localAuthoritiesLoadingState === "success" && localAuthority) {
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

  return {
    structureType: data.operatorStructureType,
    name: data.name,
  };
};

function SiteOperatorFormContainer() {
  const dispatch = useAppDispatch();
  const siteOwner = useAppSelector((state) => state.siteCreation.siteData.owner);
  const { localAuthorities, loadingState } = useAppSelector((state) => state.siteMunicipalityData);

  const localAuthoritiesList = getLocalAuthoritiesList(siteOwner?.structureType, localAuthorities);

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  const onSubmit = (data: FormValues) => {
    if (!localAuthorities) return;
    const operator = convertFormValuesForStore(data, localAuthoritiesList, loadingState);
    dispatch(completeOperator({ operator }));
  };

  const onBack = () => {
    dispatch(revertOperatorStep());
  };

  return (
    <SiteOperatorForm
      onSubmit={onSubmit}
      onBack={onBack}
      localAuthoritiesList={localAuthoritiesList}
      localAuthoritiesLoadingState={loadingState}
    />
  );
}

export default SiteOperatorFormContainer;
