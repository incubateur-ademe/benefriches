import { SiteCreationData } from "./siteFoncier.types";

export const hasBuildings = (site: SiteCreationData) => {
  return site.soils.includes("BUILDINGS");
};

export const hasImpermeableSoils = (site: SiteCreationData) => {
  return site.soils.includes("IMPERMEABLE_SOILS");
};

export const hasTenant = (site: SiteCreationData) => {
  return Boolean(site.tenant);
};
