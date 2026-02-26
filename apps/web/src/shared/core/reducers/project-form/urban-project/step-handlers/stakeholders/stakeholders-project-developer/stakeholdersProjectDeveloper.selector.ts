import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { ProjectStakeholder } from "@/features/create-project/core/project.types";
import type {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
} from "@/shared/core/reducers/project-form/helpers/stakeholders";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";
import type { RootState } from "@/shared/core/store-config/store";

type ProjectDeveloperViewData = {
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: AvailableLocalAuthorityStakeholder[];
  projectDeveloper: ProjectStakeholder | undefined;
};

export const createSelectProjectDeveloperViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectUrbanProjectAvailableStakeholders: Selector<RootState, AvailableProjectStakeholder[]>,
  selectUrbanProjectAvailableLocalAuthoritiesStakeholders: Selector<
    RootState,
    AvailableLocalAuthorityStakeholder[]
  >,
) =>
  createSelector(
    [
      selectUrbanProjectAvailableStakeholders,
      selectUrbanProjectAvailableLocalAuthoritiesStakeholders,
      selectStepState,
    ],
    (
      availableStakeholdersList,
      availableLocalAuthoritiesStakeholders,
      steps,
    ): ProjectDeveloperViewData => ({
      availableStakeholdersList,
      availableLocalAuthoritiesStakeholders,
      projectDeveloper: ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
      )?.projectDeveloper,
    }),
  );
