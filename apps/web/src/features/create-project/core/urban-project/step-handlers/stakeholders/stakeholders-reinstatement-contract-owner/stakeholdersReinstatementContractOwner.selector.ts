import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
} from "@/features/create-project/core/project-form/stakeholders";
import type { ProjectStakeholder } from "@/features/create-project/core/project.types";
import type { WizardFormState } from "@/features/create-project/core/urban-project/urbanProjectForm.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

type ReinstatementContractOwnerViewData = {
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: AvailableLocalAuthorityStakeholder[];
  reinstatementContractOwner: ProjectStakeholder | undefined;
};

export const createSelectReinstatementContractOwnerViewData = (
  selectStepState: Selector<RootState, WizardFormState["urbanProject"]["steps"]>,
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
