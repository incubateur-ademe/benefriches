import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectStakeholder } from "@/features/create-project/core/project.types";
import type {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
} from "@/shared/core/reducers/project-form/helpers/stakeholders";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

type ReinstatementContractOwnerViewData = {
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: AvailableLocalAuthorityStakeholder[];
  reinstatementContractOwner: ProjectStakeholder | undefined;
};

export const createSelectReinstatementContractOwnerViewData = (
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
    ): ReinstatementContractOwnerViewData => ({
      availableStakeholdersList,
      availableLocalAuthoritiesStakeholders,
      reinstatementContractOwner: ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      )?.reinstatementContractOwner,
    }),
  );
