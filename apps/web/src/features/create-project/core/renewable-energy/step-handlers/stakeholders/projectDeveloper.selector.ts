import { createSelector } from "@reduxjs/toolkit";

import type { AvailableProjectStakeholder } from "@/shared/core/reducers/project-form/helpers/stakeholders";

import {
  selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  selectRenewableEnergyProjectAvailableStakeholders,
} from "../../selectors/stakeholders.selectors";

type PVStakeholderFormViewData = {
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: ReturnType<
    typeof selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders
  >;
};

export const selectPVDeveloperViewData = createSelector(
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

export const selectPVFutureSiteOwnerViewData = selectPVDeveloperViewData;
export const selectPVReinstatementContractOwnerViewData = selectPVDeveloperViewData;
