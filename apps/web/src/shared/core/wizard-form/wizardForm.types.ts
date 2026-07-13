import { Address, SiteNature, SoilsDistribution } from "shared";

import { Owner, Tenant } from "@/features/create-site/core/siteFoncier.types";

export type LocalAuthorities = {
  city?: {
    code: string;
    name: string;
  };
  epci?: {
    code: string;
    name: string;
  };
  department?: {
    code: string;
    name: string;
  };
  region?: {
    code: string;
    name: string;
  };
};

export type ProjectSiteView = {
  id: string;
  name: string;
  nature: SiteNature;
  isExpressSite: boolean;
  owner: Owner;
  tenant?: Tenant;
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: SoilsDistribution;
  surfaceArea: number;
  address: Address;
};
