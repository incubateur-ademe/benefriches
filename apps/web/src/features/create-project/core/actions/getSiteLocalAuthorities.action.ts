import { createFetchLocalAuthoritiesThunk } from "@/shared/core/reducers/project-form/getSiteLocalAuthorities.action";
import { RootState } from "@/shared/core/store-config/store";

export const fetchSiteLocalAuthorities = createFetchLocalAuthoritiesThunk<RootState>({
  entityName: "project",
  selectSiteData: (state) => state.projectCreation.siteData,
  selectSiteLocalAuthorities: (state) => state.projectCreation.siteRelatedLocalAuthorities,
});
