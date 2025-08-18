import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import {
  AvailableProjectStakeholder,
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
  hasStakeholder,
} from "../stakeholders.selectors";
import { FormState } from "./form-state/formState";

export const getUrbanProjectAvailableStakeholders = createSelector(
  [
    getProjectAvailableStakeholders,
    (state: RootState) => state.projectCreation.urbanProjectEventSourcing.events,
  ],
  (projectAvailableStakeholders, events) => {
    const stakeholders: AvailableProjectStakeholder[] = projectAvailableStakeholders.slice();

    const projectDeveloper = FormState.getStepAnswers(
      events,
      "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;

    if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
      stakeholders.push({
        name: projectDeveloper.name,
        role: "project_stakeholder",
        structureType: projectDeveloper.structureType,
      });
    }

    const reinstatementContractOwner = FormState.getStepAnswers(
      events,
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
  [
    getAvailableLocalAuthoritiesStakeholders,
    (state: RootState) => state.projectCreation.urbanProjectEventSourcing.events,
  ],
  (availableLocalAuthoritiesStakeholders, events) => {
    const projectDeveloper = FormState.getStepAnswers(
      events,
      "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;

    const reinstatementContractOwner = FormState.getStepAnswers(
      events,
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
