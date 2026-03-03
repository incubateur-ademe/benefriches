import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";
import {
  AvailableProjectStakeholder,
  getAvailableLocalAuthoritiesStakeholders,
  getProjectAvailableStakeholders,
  hasStakeholder,
} from "@/shared/core/reducers/project-form/helpers/stakeholders";

import { selectSiteData } from "../../createProject.selectors";
import type { ProjectStakeholder } from "../../project.types";
import { ReadStateHelper } from "../helpers/readState";
import { selectSteps } from "./renewableEnergy.selector";

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
  [selectProjectAvailableStakeholders, selectSteps],
  (projectAvailableStakeholders, steps) => {
    const stakeholders: AvailableProjectStakeholder[] = projectAvailableStakeholders;

    const projectDeveloper = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;
    if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
      stakeholders.push({
        name: projectDeveloper.name,
        role: "project_stakeholder",
        structureType: projectDeveloper.structureType,
      });
    }

    const futureOperator = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    )?.futureOperator;
    if (futureOperator && !hasStakeholder(futureOperator, stakeholders)) {
      stakeholders.push({
        name: futureOperator.name,
        role: "project_stakeholder",
        structureType: futureOperator.structureType,
      });
    }

    const reinstatementContractOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    )?.reinstatementContractOwner;
    if (reinstatementContractOwner && !hasStakeholder(reinstatementContractOwner, stakeholders)) {
      stakeholders.push({
        name: reinstatementContractOwner.name,
        role: "project_stakeholder",
        structureType: reinstatementContractOwner.structureType,
      });
    }

    const futureSiteOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
    )?.futureSiteOwner;
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
  [selectAvailableLocalAuthoritiesStakeholders, selectSteps],
  (availableLocalAuthoritiesStakeholders, steps) => {
    const projectDeveloper = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;
    const futureOperator = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    )?.futureOperator;
    const reinstatementContractOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    )?.reinstatementContractOwner;
    const futureSiteOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
    )?.futureSiteOwner;

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

type PVStakeholderFormViewData = {
  availableStakeholdersList: AvailableProjectStakeholder[];
  availableLocalAuthoritiesStakeholders: ReturnType<
    typeof getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders
  >;
};

export const selectPVDeveloperViewData = createSelector(
  [
    getRenewableEnergyProjectAvailableStakeholders,
    getRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
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

type PVOperatorViewData = {
  currentUser: ReturnType<typeof selectCurrentUserStructure>;
  initialValue: ProjectStakeholder | undefined;
};

export const selectPVOperatorViewData = createSelector(
  [selectCurrentUserStructure, selectSteps],
  (currentUser, steps): PVOperatorViewData => ({
    currentUser,
    initialValue: ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    )?.futureOperator,
  }),
);

export const selectSitePurchasedViewData = createSelector(
  [selectSteps, selectSiteData, selectCurrentUserStructure],
  (steps, siteData, currentUserStructure): SitePurchasedViewData => {
    const isCurrentUserSiteOwner =
      siteData && currentUserStructure
        ? siteData.owner.name === currentUserStructure.name &&
          siteData.owner.structureType === currentUserStructure.type
        : false;

    const sitePurchase = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
    );

    return {
      isCurrentUserSiteOwner,
      initialValues:
        sitePurchase?.willSiteBePurchased !== undefined
          ? { willSiteBePurchased: sitePurchase.willSiteBePurchased }
          : undefined,
      siteOwnerName: siteData ? siteData.owner.name : undefined,
    };
  },
);
