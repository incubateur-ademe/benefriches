import { SiteDraft, SoilType } from "./siteFoncier.types";

export const hasBuildings = (site: SiteDraft) => {
  return site.soils.includes(SoilType.BUILDINGS);
};

export const hasImpermeableSoils = (site: SiteDraft) => {
  return site.soils.includes(SoilType.IMPERMEABLE_SOILS);
};

export const hasContaminatedSoils = (site: SiteDraft) => {
  return (site.contaminatedSoilSurface ?? -1) > 0;
};

export const hasTenant = (site: SiteDraft) => {
  return Boolean(site.tenant);
};
