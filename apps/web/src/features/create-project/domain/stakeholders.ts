import { ProjectSite } from "./project.types";

export type SiteStakeholder = { name: string; role: "site_owner" | "site_tenant" };

export const getSiteStakeholders = (site: ProjectSite): SiteStakeholder[] => {
  const siteStakeholders: SiteStakeholder[] = [{ name: site.owner.name, role: "site_owner" }];

  if (site.tenant) return [...siteStakeholders, { name: site.tenant.name, role: "site_tenant" }];
  return siteStakeholders;
};
