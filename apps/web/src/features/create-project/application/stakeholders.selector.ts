import { createSelector } from "@reduxjs/toolkit";
import { formatLocalAuthorityName } from "shared";
import { LocalAuthority } from "shared/dist/local-authority";

import { RootState } from "@/app/application/store";
import { UserStructure } from "@/features/users/domain/user";

import { ProjectStakeholder, ProjectStakeholderStructure } from "../domain/project.types";

export type AvailableProjectStakeholder = {
  name: string;
  role:
    | "site_owner"
    | "site_tenant"
    | "project_developer"
    | "user_structure"
    | "future_operator"
    | "reinstatement_contract_owner"
    | "future_site_owner";
  structureType: ProjectStakeholderStructure | UserStructure["type"];
};

const hasStakeholder = (
  stakeholder: { name: string; structureType: string },
  stakeholders: AvailableProjectStakeholder[],
) => {
  return stakeholders.find(
    (element) =>
      stakeholder.name === element.name && stakeholder.structureType === element.structureType,
  );
};

export const getProjectAvailableStakeholders = createSelector(
  [(state: RootState) => state.projectCreation, (state: RootState) => state.currentUser],
  (projectCreation, currentUserState) => {
    const currentUser = currentUserState.currentUser;

    const stakeholders: AvailableProjectStakeholder[] = currentUser?.structureName
      ? [
          {
            structureType: currentUser.structureType,
            role: "user_structure",
            name: currentUser.structureName,
          },
        ]
      : [];

    const siteOwner = projectCreation.siteData?.owner;
    if (siteOwner && !hasStakeholder(siteOwner, stakeholders)) {
      stakeholders.push({
        name: siteOwner.name,
        role: "site_owner",
        structureType: siteOwner.structureType,
      });
    }

    const siteTenant = projectCreation.siteData?.tenant;
    if (siteTenant && !hasStakeholder(siteTenant, stakeholders)) {
      stakeholders.push({
        name: siteTenant.name,
        role: "site_tenant",
        structureType: siteTenant.structureType,
      });
    }

    const projectDeveloper = projectCreation.projectData.projectDeveloper;
    if (projectDeveloper && !hasStakeholder(projectDeveloper, stakeholders)) {
      stakeholders.push({
        name: projectDeveloper.name,
        role: "project_developer",
        structureType: projectDeveloper.structureType,
      });
    }

    const futureOperator = projectCreation.projectData.futureOperator;
    if (futureOperator && !hasStakeholder(futureOperator, stakeholders)) {
      stakeholders.push({
        name: futureOperator.name,
        role: "future_operator",
        structureType: futureOperator.structureType,
      });
    }

    const reinstatementContractOwner = projectCreation.projectData.reinstatementContractOwner;
    if (reinstatementContractOwner && !hasStakeholder(reinstatementContractOwner, stakeholders)) {
      stakeholders.push({
        name: reinstatementContractOwner.name,
        role: "reinstatement_contract_owner",
        structureType: reinstatementContractOwner.structureType,
      });
    }

    const futureSiteOwner = projectCreation.projectData.futureSiteOwner;
    if (futureSiteOwner && !hasStakeholder(futureSiteOwner, stakeholders)) {
      stakeholders.push({
        name: futureSiteOwner.name,
        role: "future_site_owner",
        structureType: futureSiteOwner.structureType,
      });
    }

    return stakeholders;
  },
);

export type AvailableLocalAuthorityStakeholder = {
  type: LocalAuthority;
  name: string;
};

export const getAvailableLocalAuthoritiesStakeholders = createSelector(
  [
    (state: RootState) => state.projectSiteLocalAuthorities,
    (state: RootState) => state.projectCreation,
    (state: RootState) => state.currentUser,
  ],
  (siteLocalAuthorities, projectCreation, currentUserState) => {
    const currentUser = currentUserState.currentUser;
    const { owner: siteOwner, tenant: siteTenant } = projectCreation.siteData ?? {};
    const { projectDeveloper, futureOperator, reinstatementContractOwner, futureSiteOwner } =
      projectCreation.projectData;

    const projectLocalAuthorities = [
      siteOwner,
      siteTenant,
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

    if (currentUser?.structureType === "local_authority" && currentUser.structureName) {
      currentLocalAuthorities.push({
        type: currentUser.structureActivity as AvailableLocalAuthorityStakeholder["type"],
        name: currentUser.structureName,
      });
    }

    const { city, department, region, epci } = siteLocalAuthorities.localAuthorities ?? {};

    const addressLocalAuthorities = [
      {
        type: "municipality",
        name: city ? formatLocalAuthorityName("municipality", city.name) : "Mairie",
      },
      {
        type: "epci",
        name: epci
          ? formatLocalAuthorityName("epci", epci.name)
          : "Établissement public de coopération intercommunale",
      },
      {
        type: "department",
        name: department ? formatLocalAuthorityName("department", department.name) : "Département",
      },
      {
        type: "region",
        name: region ? formatLocalAuthorityName("region", region.name) : "Région",
      },
    ];

    return addressLocalAuthorities.filter(
      (addressLocalAuthority) =>
        !currentLocalAuthorities.some(
          (currentLocalAuthority) =>
            currentLocalAuthority.type === addressLocalAuthority.type &&
            currentLocalAuthority.name === addressLocalAuthority.name,
        ),
    ) as AvailableLocalAuthorityStakeholder[];
  },
);
