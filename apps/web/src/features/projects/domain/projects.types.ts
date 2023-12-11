import { SoilType } from "@/shared/domain/soils";

export type ProjectsList = {
  id: string;
  name: string;
  site: {
    id: string;
    name: string;
  };
}[];

export type SitesList = {
  id: string;
  name: string;
}[];

export type ProjectsGroupedBySite = {
  siteId: string;
  siteName: string;
  projects: { id: string; name: string }[];
}[];

export type ProjectSite = {
  id: string;
  name: string;
  isFriche: boolean;
  soilsSurfaceAreas: Partial<Record<SoilType, number>>;
  surfaceArea: number;
  address: {
    id: string;
    value: string;
    city: string;
    cityCode: string;
    postCode: string;
    streetNumber?: string;
    streetName?: string;
    long: number;
    lat: number;
  };
};

export type Project = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsSurfaceAreas: Partial<Record<SoilType, number>>;
};
