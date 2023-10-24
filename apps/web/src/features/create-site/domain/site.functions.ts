import { SiteFoncier, SoilType } from "./siteFoncier.types";

export const hasBuildings = (site: SiteFoncier) => {
  return site.soils.includes(SoilType.BUILDINGS);
};

export const hasImpermeableSoils = (site: SiteFoncier) => {
  return site.soils.includes(SoilType.IMPERMEABLE_SOILS);
};

export const hasContaminatedSoils = (site: SiteFoncier) => {
  return (site.contaminatedSoilSurface ?? -1) > 0;
};

export const hasTenant = (site: SiteFoncier) => {
  return Boolean(site.tenantBusinessName);
};
