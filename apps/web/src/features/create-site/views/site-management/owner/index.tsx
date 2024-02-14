import { useEffect } from "react";
import SiteOwnerForm, { FormValues } from "./SiteOwnerForm";

import {
  goToStep,
  setOwner,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import { SiteLocalAuthorities } from "@/features/create-site/application/siteMunicipalityData.reducer";
import { Owner } from "@/features/create-site/domain/siteFoncier.types";
import { selectCurrentUserCompany } from "@/features/users/application/user.reducer";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  currentUserCompany: string,
  localAuthorities: SiteLocalAuthorities,
): Owner => {
  switch (data.ownerType) {
    case "user_company":
      return {
        name: currentUserCompany,
        structureType: "company",
      };
    case "local_or_regional_authority":
      return {
        name: formatLocalAuthorityName(data.localAuthority, localAuthorities),
        structureType: data.localAuthority,
      };
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
  const currentUserCompany = useAppSelector(selectCurrentUserCompany);
  const { localAuthorities, loadingState } = useAppSelector((state) => state.siteMunicipalityData);
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    if (!localAuthorities) return;
    dispatch(setOwner(convertFormValuesForStore(data, currentUserCompany, localAuthorities)));
    dispatch(goToStep(SiteCreationStep.TENANT));
  };

  useEffect(() => {
    void dispatch(fetchSiteMunicipalityData());
  }, [dispatch]);

  return (
    <SiteOwnerForm
      currentUserCompany={currentUserCompany}
      siteLocalAuthorities={{ localAuthorities, loadingState }}
      onSubmit={onSubmit}
    />
  );
}

export default SiteOwnerFormContainer;
