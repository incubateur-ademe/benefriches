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
