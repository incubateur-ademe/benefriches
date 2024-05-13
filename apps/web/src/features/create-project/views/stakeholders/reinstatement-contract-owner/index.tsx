import { useEffect } from "react";
import SiteReinstatementContractOwnerForm, {
  FormValues,
} from "./SiteReinstatementContractOwnerForm";

import {
  completeReinstatementContractOwner,
  revertReinstatementContractOwner,
} from "@/features/create-project/application/createProject.reducer";
import { fetchSiteLocalAuthorities } from "@/features/create-project/application/projectSiteLocalAuthorities.actions";
import {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
} from "@/features/create-project/application/stakeholders.selector";
import { ProjectStakeholder } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const convertFormValuesForStore = (
  data: FormValues,
  stakeholdersList: AvailableProjectStakeholder[],
  siteLocalAuthorities: AvailableLocalAuthorityStakeholder[],
): ProjectStakeholder => {
  switch (data.stakeholder) {
    case "site_operator":
    case "site_owner":
    case "project_developer":
    case "future_site_operator":
    case "user_company": {
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
      return {
        name: "Inconnu",
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
