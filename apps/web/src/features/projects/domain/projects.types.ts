export type ProjectsBySite = {
  siteId: string;
  siteName: string;
  projects: { id: string; name: string }[];
};
