import { useCallback } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes, useRoute } from "@/shared/views/router";

import { fetchSiteView } from "../core/fetchSiteView.action";
import { selectSitePageViewModel } from "../core/siteView.reducer";
import SiteFeaturesPage, { SiteTab } from "./SiteFeaturesPage";

type SiteRoute =
  | Route<typeof routes.siteFeatures>
  | Route<typeof routes.siteEvaluatedProjects>
  | Route<typeof routes.siteActionsList>;

function getSiteTabFromRoute(routeName: string): SiteTab {
  switch (routeName) {
    case routes.siteEvaluatedProjects.name:
      return "evaluatedProjects";
    case routes.siteActionsList.name:
      return "siteActionsList";
    case routes.siteFeatures.name:
    default:
      return "features";
  }
}

export default function SitesRouter() {
  const dispatch = useAppDispatch();
  const route = useRoute() as SiteRoute;

  const siteId = route.params.siteId;
  const selectedTab = getSiteTabFromRoute(route.name);

  const sitePageViewModel = useAppSelector((state) => selectSitePageViewModel(state, siteId));

  const onPageLoad = useCallback(() => {
    void dispatch(fetchSiteView({ siteId }));
  }, [dispatch, siteId]);

  const handleTabChange = useCallback(
    (tabName: SiteTab) => {
      switch (tabName) {
        case "features":
          routes.siteFeatures({ ...route.params, siteId }).replace();
          break;
        case "evaluatedProjects":
          routes.siteEvaluatedProjects({ ...route.params, siteId }).replace();
          break;
        case "siteActionsList":
          routes.siteActionsList({ ...route.params, siteId }).replace();
          break;
      }
    },
    [siteId, route.params],
  );

  return (
    <SiteFeaturesPage
      onPageLoad={onPageLoad}
      viewModel={sitePageViewModel}
      selectedTab={selectedTab}
      fromCompatibilityEvaluation={route.params.fromCompatibilityEvaluation ?? false}
      onTabChange={handleTabChange}
    />
  );
}
