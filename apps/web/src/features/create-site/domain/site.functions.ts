import { SiteDraft } from "./siteFoncier.types";

export const hasBuildings = (site: SiteDraft) => {
  return site.soils.includes("BUILDINGS");
};

export const hasImpermeableSoils = (site: SiteDraft) => {
  return site.soils.includes("IMPERMEABLE_SOILS");
};

export const hasOperator = (site: SiteDraft) => {
  return Boolean(site.operator);
};
