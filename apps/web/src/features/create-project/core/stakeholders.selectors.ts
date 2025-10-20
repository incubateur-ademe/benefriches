import { createSelector } from "@reduxjs/toolkit";
import { formatLocalAuthorityName, LocalAuthority } from "shared";

import { RootState } from "@/shared/core/store-config/store";

import { selectSiteData } from "./createProject.selectors";
import { ProjectStakeholderStructure } from "./project.types";

export type AvailableProjectStakeholder = {
  name: string;
  role: "site_owner" | "site_tenant" | "user_structure" | "project_stakeholder";
  structureType: ProjectStakeholderStructure;
};

export const hasStakeholder = (
  stakeholder: { name: string; structureType: string },
  stakeholders: AvailableProjectStakeholder[],
) => {
  return stakeholders.find(
    (element) =>
      stakeholder.name === element.name && stakeholder.structureType === element.structureType,
  );
};

export const getProjectAvailableStakeholders = createSelector(
  [selectSiteData, (state: RootState) => state.currentUser.currentUser],
  (siteData, currentUser) => {
    const stakeholders: AvailableProjectStakeholder[] = currentUser?.structureName
      ? [
          {
            structureType:
              currentUser.structureType === "local_authority"
                ? (currentUser.structureActivity as LocalAuthority)
                : currentUser.structureType,
            role: "user_structure",
            name: currentUser.structureName,
          },
        ]
      : [];

    const siteOwner = siteData?.owner;
    if (siteOwner && !hasStakeholder(siteOwner, stakeholders)) {
      stakeholders.push({
        name: siteOwner.name,
        role: "site_owner",
        structureType: siteOwner.structureType,
      });
    }

    const siteTenant = siteData?.tenant;
    if (siteTenant && !hasStakeholder(siteTenant, stakeholders)) {
      stakeholders.push({
        name: siteTenant.name,
        role: "site_tenant",
        structureType: siteTenant.structureType,
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
    (state: RootState) => state.projectCreation.siteRelatedLocalAuthorities,
    getProjectAvailableStakeholders,
  ],
  (siteRelatedLocalAuthorities, projectAvailableStakeholders) => {
    const projectLocalAuthorities = projectAvailableStakeholders.filter((element) =>
      ["municipality", "epci", "department", "region"].includes(element.structureType),
    );

    const currentLocalAuthorities = projectLocalAuthorities.map((element) => ({
      type: element.structureType,
      name: element.name,
    }));

    const { city, department, region, epci } = siteRelatedLocalAuthorities;

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
