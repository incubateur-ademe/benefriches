import { useEffect } from "react";

import { fetchSiteLocalAuthorities } from "@/features/create-project/application/getSiteLocalAuthorities.action";
import {
  completeReinstatementContractOwner,
  revertReinstatementContractOwner,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
} from "@/features/create-project/application/renewable-energy/stakeholders.selector";
import { ProjectStakeholder } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteReinstatementContractOwnerForm, {
  FormValues,
} from "./SiteReinstatementContractOwnerForm";

const convertFormValuesForStore = (
  data: FormValues,
  stakeholdersList: AvailableProjectStakeholder[],
  siteLocalAuthorities: AvailableLocalAuthorityStakeholder[],
): ProjectStakeholder => {
  switch (data.stakeholder) {
    case "site_tenant":
    case "site_owner":
    case "project_developer":
    case "future_site_operator":
    case "user_structure": {
      const stakeholder = stakeholdersList.find(
        ({ role }) => role === data.stakeholder,
      ) as AvailableProjectStakeholder;
      return {
        name: stakeholder.name,
        structureType: stakeholder.structureType,
      };
    }

    case "local_or_regional_authority": {
      const localAuthority = siteLocalAuthorities.find(
        ({ type }) => type === data.localAuthority,
      ) as AvailableLocalAuthorityStakeholder;
      return {
        name: localAuthority.name,
        structureType: data.localAuthority,
      };
    }

    case "other_structure":
      return {
        name: data.otherStructureName,
        structureType: "other",
      };
    case "unknown":
    case null:
      return {
        name: "Maître d’ouvrage des travaux de remise en état",
        structureType: "unknown",
      };
  }
};

function SiteReinstatementContractOwnerFormContainer() {
  const dispatch = useAppDispatch();

  const availableStakeholdersList = useAppSelector(getProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    getAvailableLocalAuthoritiesStakeholders,
  );

  const onSubmit = (data: FormValues) => {
    dispatch(
      completeReinstatementContractOwner(
        convertFormValuesForStore(
          data,
          availableStakeholdersList,
          availableLocalAuthoritiesStakeholders,
        ),
      ),
    );
  };

  const onBack = () => {
    dispatch(revertReinstatementContractOwner());
  };

  useEffect(() => void dispatch(fetchSiteLocalAuthorities()), [dispatch]);

  return (
    <SiteReinstatementContractOwnerForm
      onSubmit={onSubmit}
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
}

export default SiteReinstatementContractOwnerFormContainer;
