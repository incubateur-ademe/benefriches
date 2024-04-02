import { useEffect } from "react";
import SiteOwnerForm, { FormValues } from "./SiteOwnerForm";

import { revertOwnerStep } from "@/features/create-site/application/createSite.actions";
import { completeOwner } from "@/features/create-site/application/createSite.reducer";
import { fetchSiteMunicipalityData } from "@/features/create-site/application/siteMunicipalityData.actions";
import { SiteLocalAuthorities } from "@/features/create-site/application/siteMunicipalityData.reducer";
import { Owner } from "@/features/create-site/domain/siteFoncier.types";
import { selectCurrentUserStructure } from "@/features/users/application/user.reducer";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  currentUserStructure: string,
  localAuthorities: SiteLocalAuthorities,
): Owner => {
  switch (data.ownerType) {
    case "user_company":
      return {
        name: currentUserStructure,
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
  const currentUserStructure = useAppSelector(selectCurrentUserStructure);
  const { localAuthorities, loadingState } = useAppSelector((state) => state.siteMunicipalityData);
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    if (!localAuthorities) return;
    dispatch(
      completeOwner({
        owner: convertFormValuesForStore(data, currentUserStructure?.name || "", localAuthorities),
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
      siteLocalAuthorities={{ localAuthorities, loadingState }}
      currentUserStructureName={currentUserStructure?.name}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default SiteOwnerFormContainer;
