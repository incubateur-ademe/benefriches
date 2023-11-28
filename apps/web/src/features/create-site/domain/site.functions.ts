import { SiteDraft } from "./siteFoncier.types";

import { SoilType } from "@/shared/domain/soils";

export const hasBuildings = (site: SiteDraft) => {
  return site.soils.includes(SoilType.BUILDINGS);
};

export const hasImpermeableSoils = (site: SiteDraft) => {
  return site.soils.includes(SoilType.IMPERMEABLE_SOILS);
};

export const hasTenant = (site: SiteDraft) => {
  return Boolean(site.tenant);
};
