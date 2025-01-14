import { createSelector } from "@reduxjs/toolkit";

import {
  AvailableProjectStakeholder,
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
  hasStakeholder,
} from "../../stakeholders.selectors";
import { selectCreationData } from "./urbanProject.selectors";

export const getUrbanProjectAvailableStakeholders = createSelector(
  [getProjectAvailableStakeholders, selectCreationData],
  (projectAvailableStakeholders, creationData) => {
    const stakeholders: AvailableProjectStakeholder[] = projectAvailableStakeholders.slice();

    const projectDeveloper = creationData.projectDeveloper;
    if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
      stakeholders.push({
        name: projectDeveloper.name,
        role: "project_stakeholder",
        structureType: projectDeveloper.structureType,
      });
    }

    const reinstatementContractOwner = creationData.reinstatementContractOwner;
    if (reinstatementContractOwner && !hasStakeholder(reinstatementContractOwner, stakeholders)) {
      stakeholders.push({
        name: reinstatementContractOwner.name,
        role: "project_stakeholder",
        structureType: reinstatementContractOwner.structureType,
      });
    }

    return stakeholders;
  },
);

export const getUrbanProjectAvailableLocalAuthoritiesStakeholders = createSelector(
  [getAvailableLocalAuthoritiesStakeholders, selectCreationData],
  (availableLocalAuthoritiesStakeholders, creationData) => {
    const { projectDeveloper, reinstatementContractOwner } = creationData;

    return availableLocalAuthoritiesStakeholders.filter((addressLocalAuthority) => {
      const isProjectDeveloper =
        addressLocalAuthority.type === projectDeveloper?.structureType &&
        addressLocalAuthority.name === projectDeveloper.name;
      const isReinstatementContractOwner =
        addressLocalAuthority.type === reinstatementContractOwner?.structureType &&
        addressLocalAuthority.name === reinstatementContractOwner.name;

      return !isProjectDeveloper && !isReinstatementContractOwner;
    });
  },
);
