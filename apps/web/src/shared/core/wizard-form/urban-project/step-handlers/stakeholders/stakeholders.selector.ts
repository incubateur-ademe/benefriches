import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
} from "@/shared/core/wizard-form/helpers/stakeholders";
import type { ProjectFormState } from "@/shared/core/wizard-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/wizard-form/urban-project/helpers/readState";
import {
  getUrbanProjectAvailableLocalAuthoritiesStakeholders,
  getUrbanProjectAvailableStakeholders,
} from "@/shared/core/wizard-form/urban-project/helpers/stakeholders";

const createSelectProjectDeveloper = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
) =>
  createSelector(
    [selectStepState],
    (steps) =>
      ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER")
        ?.projectDeveloper,
  );

const createSelectReinstatementContractOwner = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
) =>
  createSelector(
    [selectStepState],
    (steps) =>
      ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      )?.reinstatementContractOwner,
  );

export const createSelectUrbanProjectAvailableStakeholders = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectProjectAvailableStakeholders: Selector<RootState, AvailableProjectStakeholder[]>,
) => {
  const selectProjectDeveloper = createSelectProjectDeveloper(selectStepState);
  const selectReinstatementContractOwner = createSelectReinstatementContractOwner(selectStepState);

  return createSelector(
    [selectProjectAvailableStakeholders, selectProjectDeveloper, selectReinstatementContractOwner],
    (projectAvailableStakeholders, projectDeveloper, reinstatementContractOwner) =>
      getUrbanProjectAvailableStakeholders({
        projectAvailableStakeholders,
        projectDeveloper,
        reinstatementContractOwner,
      }),
  );
};

export const createSelectUrbanProjectAvailableLocalAuthoritiesStakeholders = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectAvailableLocalAuthoritiesStakeholders: Selector<
    RootState,
    AvailableLocalAuthorityStakeholder[]
  >,
) => {
  const selectProjectDeveloper = createSelectProjectDeveloper(selectStepState);
  const selectReinstatementContractOwner = createSelectReinstatementContractOwner(selectStepState);

  return createSelector(
    [
      selectAvailableLocalAuthoritiesStakeholders,
      selectProjectDeveloper,
      selectReinstatementContractOwner,
    ],
    (availableLocalAuthoritiesStakeholders, projectDeveloper, reinstatementContractOwner) => {
      return getUrbanProjectAvailableLocalAuthoritiesStakeholders({
        availableLocalAuthoritiesStakeholders,
        projectDeveloper,
        reinstatementContractOwner,
      });
    },
  );
};
