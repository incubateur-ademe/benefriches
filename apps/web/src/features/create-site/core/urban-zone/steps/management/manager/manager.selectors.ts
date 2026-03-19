import { createSelector } from "@reduxjs/toolkit";
import type { LocalAuthority } from "shared";

import type { RootState } from "@/app/store/store";
import {
  selectAvailableLocalAuthorities,
  type AvailableLocalAuthority,
} from "@/features/create-site/core/siteMunicipalityData.reducer";

import { ReadStateHelper } from "../../../stateHelpers";

type ManagerViewData = {
  initialValues: {
    structureType: "activity_park_manager" | "local_authority" | undefined;
    localAuthority: LocalAuthority | undefined;
  };
  localAuthoritiesList: AvailableLocalAuthority[];
};

export const selectManagerViewData = createSelector(
  [(state: RootState) => state.siteCreation.urbanZone.steps, selectAvailableLocalAuthorities],
  (steps, localAuthoritiesList): ManagerViewData => {
    const answers = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_MANAGER");
    return {
      initialValues: {
        structureType: answers?.structureType,
        localAuthority:
          answers?.structureType === "local_authority" ? answers.localAuthority : undefined,
      },
      localAuthoritiesList,
    };
  },
);
