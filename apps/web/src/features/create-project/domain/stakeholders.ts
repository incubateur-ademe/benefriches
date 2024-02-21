import { ProjectSite } from "./project.types";

import { User } from "@/features/users/domain/user";
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
  currentUserOrganization: Exclude<User["organization"], undefined>,
  stakeholderEntity?: SiteStakeholder,
): boolean => {
  if (!stakeholderEntity) {
    return false;
  }
  return (
    currentUserOrganization.type === stakeholderEntity.structureType &&
    currentUserOrganization.name === stakeholderEntity.name
  );
};

export const getLocalAuthoritiesExcludedValues = (
  currentUserOrganization: Exclude<User["organization"], undefined>,
  siteStakeholderEntities: SiteStakeholder[],
) =>
  [
    currentUserOrganization.type,
    ...siteStakeholderEntities.map(({ structureType }) => structureType),
  ].filter((value) => LOCAL_AUTHORITY_AVAILABLE_VALUES.includes(value));
