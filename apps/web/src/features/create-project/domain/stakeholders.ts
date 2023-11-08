import { ProjectSite } from "./project.types";

export type SiteStakeholder = { name: string; role: "owner" | "tenant" };

export const getSiteStakeholders = (site: ProjectSite): SiteStakeholder[] => {
  const siteStakeholders: SiteStakeholder[] = [
    { name: site.owner.name, role: "owner" },
  ];

  if (site.tenant)
    return [...siteStakeholders, { name: site.tenant.name, role: "tenant" }];
  return siteStakeholders;
};
