import { ProjectSite } from "./project.types";

import { UserStructure } from "@/features/users/domain/user";
import { OwnerStructureType, TenantStructureType } from "@/shared/domain/stakeholder";
import { LOCAL_AUTHORITY_AVAILABLE_VALUES } from "@/shared/views/components/form/LocalAuthoritySelect/values";

export type SiteStakeholder = {
  name: string;
  role: "site_owner" | "site_tenant";
  structureType: OwnerStructureType | TenantStructureType;
};

export const getSiteStakeholders = (site: ProjectSite): SiteStakeholder[] => {
  const siteStakeholders: SiteStakeholder[] = [
    { name: site.owner.name, role: "site_owner", structureType: site.owner.structureType },
  ];

  if (site.tenant)
    return [
      ...siteStakeholders,
      { name: site.tenant.name, role: "site_tenant", structureType: site.tenant.structureType },
    ];
  return siteStakeholders;
};

export const isCurrentUserSameSiteStakeholderEntity = (
  currentUserStructure: UserStructure,
  stakeholder?: SiteStakeholder,
): boolean => {
  if (!stakeholder) {
    return false;
  }
  return (
    currentUserStructure.type === stakeholder.structureType &&
    currentUserStructure.name === stakeholder.name
  );
};

export const getLocalAuthoritiesExcludedValues = (
  currentUserStructure: UserStructure,
  siteStakeholderEntities: SiteStakeholder[],
) =>
  [
    currentUserStructure.type,
    ...siteStakeholderEntities.map(({ structureType }) => structureType),
  ].filter((value) => LOCAL_AUTHORITY_AVAILABLE_VALUES.includes(value));
