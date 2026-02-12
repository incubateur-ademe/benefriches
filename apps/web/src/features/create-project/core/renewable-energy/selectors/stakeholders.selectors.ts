import { createSelector } from "@reduxjs/toolkit";

import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";
import {
  AvailableProjectStakeholder,
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
  hasStakeholder,
} from "@/shared/core/reducers/project-form/helpers/stakeholders";
import { RootState } from "@/shared/core/store-config/store";

import { selectSiteData } from "../../createProject.selectors";
import { ProjectStakeholder } from "../../project.types";
import { selectCreationData } from "./renewableEnergy.selector";

const selectProjectAvailableStakeholders = createSelector(
  [selectSiteData, (state: RootState) => state.currentUser.currentUser],
  (siteData, currentUser) => {
    return getProjectAvailableStakeholders({
      siteOwner: siteData?.owner,
      siteTenant: siteData?.tenant,
      currentUser: currentUser ?? undefined,
    });
  },
);

const selectAvailableLocalAuthoritiesStakeholders = createSelector(
  [
    (state: RootState) => state.projectCreation.siteRelatedLocalAuthorities,
    selectProjectAvailableStakeholders,
  ],
  (siteRelatedLocalAuthorities, projectAvailableStakeholders) => {
    return getAvailableLocalAuthoritiesStakeholders(
      siteRelatedLocalAuthorities,
      projectAvailableStakeholders,
    );
  },
);

export const getRenewableEnergyProjectAvailableStakeholders = createSelector(
  [selectProjectAvailableStakeholders, selectCreationData],
  (projectAvailableStakeholders, creationData) => {
    const stakeholders: AvailableProjectStakeholder[] = projectAvailableStakeholders;

    const projectDeveloper = creationData.projectDeveloper;
    if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
      stakeholders.push({
        name: projectDeveloper.name,
        role: "project_stakeholder",
        structureType: projectDeveloper.structureType,
      });
    }

    const futureOperator = creationData.futureOperator;
    if (futureOperator && !hasStakeholder(futureOperator, stakeholders)) {
      stakeholders.push({
        name: futureOperator.name,
        role: "project_stakeholder",
        structureType: futureOperator.structureType,
      });
    }

    const reinstatementContractOwner = creationData.reinstatementContractOwner;
    if (reinstatementContractOwner && !hasStakeholder(reinstatementContractOwner, stakeholders)) {
      stakeholders.push({
        name: reinstatementContractOwner.name,
        role: "project_stakeholder",
        structureType: reinstatementContractOwner.structureType,
      });
    }

    const futureSiteOwner = creationData.futureSiteOwner;
    if (futureSiteOwner && !hasStakeholder(futureSiteOwner, stakeholders)) {
      stakeholders.push({
        name: futureSiteOwner.name,
        role: "project_stakeholder",
        structureType: futureSiteOwner.structureType,
      });
    }

    return stakeholders;
  },
);

export const getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders = createSelector(
  [selectAvailableLocalAuthoritiesStakeholders, selectCreationData],
  (availableLocalAuthoritiesStakeholders, creationData) => {
    const { projectDeveloper, futureOperator, reinstatementContractOwner, futureSiteOwner } =
      creationData;

    const projectLocalAuthorities = [
      projectDeveloper,
      futureOperator,
      reinstatementContractOwner,
      futureSiteOwner,
    ].filter(
      (element) =>
        element && ["municipality", "epci", "department", "region"].includes(element.structureType),
    ) as ProjectStakeholder[];

    const currentLocalAuthorities = projectLocalAuthorities.map((element) => ({
      type: element.structureType,
      name: element.name,
    }));

    return availableLocalAuthoritiesStakeholders.filter(
      (addressLocalAuthority) =>
        !currentLocalAuthorities.some(
          (currentLocalAuthority) =>
            currentLocalAuthority.type === addressLocalAuthority.type &&
            currentLocalAuthority.name === addressLocalAuthority.name,
        ),
    );
  },
);

type SitePurchasedViewData = {
  isCurrentUserSiteOwner: boolean;
  initialValues:
    | {
        willSiteBePurchased: boolean;
      }
    | undefined;
  siteOwnerName: string | undefined;
};

export const selectSitePurchasedViewData = createSelector(
  [selectCreationData, selectSiteData, selectCurrentUserStructure],
  (creationData, siteData, currentUserStructure): SitePurchasedViewData => {
    const isCurrentUserSiteOwner =
      siteData && currentUserStructure
        ? siteData.owner.name === currentUserStructure.name &&
          siteData.owner.structureType === currentUserStructure.type
        : false;

    return {
      isCurrentUserSiteOwner,
      initialValues: creationData.willSiteBePurchased
        ? { willSiteBePurchased: creationData.willSiteBePurchased }
        : undefined,
      siteOwnerName: siteData ? siteData.owner.name : undefined,
    };
  },
);
