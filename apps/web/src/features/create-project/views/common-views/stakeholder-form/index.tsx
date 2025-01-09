import { ReactNode, useEffect } from "react";
import { LocalAuthority } from "shared";

import { fetchSiteLocalAuthorities } from "@/features/create-project/application/getSiteLocalAuthorities.action";
import {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
} from "@/features/create-project/application/stakeholders.selectors";
import {
  ProjectStakeholder,
  ProjectStakeholderStructure,
} from "@/features/create-project/domain/project.types";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import StakeholderForm, { FormValues } from "./StakeholderForm";

const convertFormValuesForStore = (
  data: FormValues,
  stakeholdersList: AvailableProjectStakeholder[],
  siteLocalAuthorities: AvailableLocalAuthorityStakeholder[],
): ProjectStakeholder => {
  switch (data.stakeholder) {
    case "site_tenant":
    case "site_owner":
    case "project_stakeholder":
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
        structureType: "unknown",
      };
    case "unknown":
    case null:
      return {
        name: "Aménageur",
        structureType: "unknown",
      };
  }
};

type Props = {
  onSubmit: (data: { name: string; structureType: ProjectStakeholderStructure }) => void;
  onBack: () => void;
  title: ReactNode;
  instructions?: ReactNode;
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: {
    type: LocalAuthority;
    name: string;
  }[];
};

function StakeholderFormContainer({
  onSubmit,
  onBack,
  title,
  instructions,
  availableStakeholdersList,
  availableLocalAuthoritiesStakeholders,
}: Props) {
  const dispatch = useAppDispatch();

  const _onSubmit = (data: FormValues) => {
    onSubmit(
      convertFormValuesForStore(
        data,
        availableStakeholdersList,
        availableLocalAuthoritiesStakeholders,
      ),
    );
  };

  useEffect(() => void dispatch(fetchSiteLocalAuthorities()), [dispatch]);

  return (
    <StakeholderForm
      title={title}
      instructions={instructions}
      onSubmit={_onSubmit}
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
}

export default StakeholderFormContainer;
