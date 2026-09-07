import { createSelector } from "@reduxjs/toolkit";
import type { LocalAuthority } from "shared";

import {
  selectAvailableLocalAuthorities,
  type AvailableLocalAuthority,
} from "@/features/create-site/core/siteMunicipalityData.reducer";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

type ManagerViewData = {
  initialValues: {
    structureType: "activity_park_manager" | "local_authority" | undefined;
    localAuthority: LocalAuthority | undefined;
    localAuthorityName: string | undefined;
  };
  localAuthoritiesList: AvailableLocalAuthority[];
};

/**
 * `selectAvailableLocalAuthorities` is NOT lens-parameterised here (same documented deviation as
 * `createSiteManagementSelectors` on the custom bundle's OWNER step, see siteManagement.selectors
 * .ts) — it stays bound to creation's singleton `siteCreation` slice. Low blast radius: it only
 * affects which local authorities are offered in the dropdown, not the update wizard's own
 * hydrated manager answer. Flagged as a follow-up, not fixed in this ticket.
 */
export const createManagerSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectManagerViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps, selectAvailableLocalAuthorities],
    (steps, localAuthoritiesList): ManagerViewData => {
      const answers = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_MANAGER");
      return {
        initialValues: {
          structureType: answers?.structureType,
          localAuthority:
            answers?.structureType === "local_authority" ? answers.localAuthority : undefined,
          localAuthorityName:
            answers?.structureType === "local_authority" ? answers.localAuthorityName : undefined,
        },
        localAuthoritiesList,
      };
    },
  );

  return { selectManagerViewData };
};

export const { selectManagerViewData } = createManagerSelectors(siteCreationRootSelectors);
