import { ReactNode, useEffect } from "react";
import { LocalAuthority } from "shared";

import { fetchSiteLocalAuthorities } from "@/features/create-project/core/actions/getSiteLocalAuthorities.action";
import {
  ProjectStakeholder,
  ProjectStakeholderStructure,
} from "@/features/create-project/core/project.types";
import {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
} from "@/shared/core/reducers/project-form/helpers/stakeholders";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import StakeholderForm, { FormValues } from "./StakeholderForm";

const DEFAULT_UNKNOWN_NAME = "Aménageur";

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
        name: DEFAULT_UNKNOWN_NAME,
        structureType: "unknown",
      };
  }
};

const convertInitialValueForForm = (
  stakeholder: { name: string; structureType: ProjectStakeholderStructure } | undefined,
  availableStakeholdersList: AvailableProjectStakeholder[],
): FormValues | undefined => {
  if (!stakeholder) {
    return undefined;
  }

  const role = availableStakeholdersList.find(
    ({ name, structureType }) =>
      stakeholder.name === name && stakeholder.structureType === structureType,
  )?.role;

  if (role) {
    return {
      stakeholder: role,
      localAuthority: undefined,
      otherStructureName: undefined,
    };
  }

  if (stakeholder.structureType === "unknown") {
    if (stakeholder.name !== DEFAULT_UNKNOWN_NAME) {
      return {
        stakeholder: "other_structure",
        otherStructureName: stakeholder.name,
        localAuthority: undefined,
      };
    }
    return {
      stakeholder: "unknown",
      localAuthority: undefined,
      otherStructureName: undefined,
    };
  }

  if (
    stakeholder.structureType === "department" ||
    stakeholder.structureType === "municipality" ||
    stakeholder.structureType === "epci" ||
    stakeholder.structureType === "region"
  ) {
    return {
      stakeholder: "local_or_regional_authority",
      localAuthority: stakeholder.structureType,
      otherStructureName: undefined,
    };
  }
};

type Props = {
  initialValues?: { name: string; structureType: ProjectStakeholderStructure };
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
  initialValues,
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
      initialValues={convertInitialValueForForm(initialValues, availableStakeholdersList)}
    />
  );
}

export default StakeholderFormContainer;
