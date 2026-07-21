import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type {
  AvailableLocalAuthorityStakeholder,
  AvailableProjectStakeholder,
} from "@/features/create-project/core/project-form/stakeholders";

type PVStakeholderFormViewData = {
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: AvailableLocalAuthorityStakeholder[];
};

export const createSelectPVDeveloperViewData = (
  selectRenewableEnergyProjectAvailableStakeholders: Selector<
    RootState,
    AvailableProjectStakeholder[]
  >,
  selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders: Selector<
    RootState,
    AvailableLocalAuthorityStakeholder[]
  >,
) =>
  createSelector(
    [
      selectRenewableEnergyProjectAvailableStakeholders,
      selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
    ],
    (
      availableStakeholdersList,
      availableLocalAuthoritiesStakeholders,
    ): PVStakeholderFormViewData => ({
      availableStakeholdersList,
      availableLocalAuthoritiesStakeholders,
    }),
  );
