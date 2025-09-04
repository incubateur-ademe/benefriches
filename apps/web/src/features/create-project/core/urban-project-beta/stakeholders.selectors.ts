import { createSelector } from "@reduxjs/toolkit";

import {
  AvailableProjectStakeholder,
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
  hasStakeholder,
} from "../stakeholders.selectors";
import { ReadStateHelper } from "./urbanProject.helpers";
import { selectStepState } from "./urbanProject.selectors";

export const getUrbanProjectAvailableStakeholders = createSelector(
  [getProjectAvailableStakeholders, selectStepState],
  (projectAvailableStakeholders, steps) => {
    const stakeholders: AvailableProjectStakeholder[] = projectAvailableStakeholders.slice();

    const projectDeveloper = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;

    if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
      stakeholders.push({
        name: projectDeveloper.name,
        role: "project_stakeholder",
        structureType: projectDeveloper.structureType,
      });
    }

    const reinstatementContractOwner = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    )?.reinstatementContractOwner;

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
  [getAvailableLocalAuthoritiesStakeholders, selectStepState],
  (availableLocalAuthoritiesStakeholders, steps) => {
    const projectDeveloper = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;

    const reinstatementContractOwner = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    )?.reinstatementContractOwner;

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
