import { ProjectStakeholder } from "@/features/create-project/core/project.types";
import { AvailableLocalAuthority } from "@/features/create-site/core/siteMunicipalityData.reducer";

import { AvailableProjectStakeholder, hasStakeholder } from "../../helpers/stakeholders";

type Props = {
  projectAvailableStakeholders: AvailableProjectStakeholder[];
  projectDeveloper?: ProjectStakeholder;
  reinstatementContractOwner?: ProjectStakeholder;
};
export const getUrbanProjectAvailableStakeholders = ({
  projectAvailableStakeholders,
  projectDeveloper,
  reinstatementContractOwner,
}: Props) => {
  const stakeholders = projectAvailableStakeholders.slice();

  if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
    stakeholders.push({
      name: projectDeveloper.name,
      role: "project_stakeholder",
      structureType: projectDeveloper.structureType,
    });
  }

  if (reinstatementContractOwner && !hasStakeholder(reinstatementContractOwner, stakeholders)) {
    stakeholders.push({
      name: reinstatementContractOwner.name,
      role: "project_stakeholder",
      structureType: reinstatementContractOwner.structureType,
    });
  }

  return stakeholders;
};

type LocalAuthoritiesProps = {
  availableLocalAuthoritiesStakeholders: AvailableLocalAuthority[];
  projectDeveloper?: ProjectStakeholder;
  reinstatementContractOwner?: ProjectStakeholder;
};
export const getUrbanProjectAvailableLocalAuthoritiesStakeholders = ({
  availableLocalAuthoritiesStakeholders,
  projectDeveloper,
  reinstatementContractOwner,
}: LocalAuthoritiesProps) => {
  return availableLocalAuthoritiesStakeholders.filter((addressLocalAuthority) => {
    const isProjectDeveloper =
      addressLocalAuthority.type === projectDeveloper?.structureType &&
      addressLocalAuthority.name === projectDeveloper.name;
    const isReinstatementContractOwner =
      addressLocalAuthority.type === reinstatementContractOwner?.structureType &&
      addressLocalAuthority.name === reinstatementContractOwner.name;

    return !isProjectDeveloper && !isReinstatementContractOwner;
  });
};
