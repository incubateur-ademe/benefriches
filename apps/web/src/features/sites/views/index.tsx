import { useCallback } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes, useRoute } from "@/shared/views/router";

import { fetchSiteView } from "../core/fetchSiteView.action";
import { selectSitePageViewModel } from "../core/siteView.reducer";
import SitePage, { SiteTab } from "./SitePage";

export type SiteRoute =
  | Route<typeof routes.siteFeatures>
  | Route<typeof routes.siteEvaluatedProjects>
  | Route<typeof routes.siteActionsList>
  | Route<typeof routes.siteCompatibilityEvaluation>;

function getSiteTabFromRoute(routeName: string): SiteTab {
  switch (routeName) {
    case routes.siteEvaluatedProjects.name:
      return "evaluatedProjects";
    case routes.siteActionsList.name:
      return "actionsList";
    case routes.siteCompatibilityEvaluation.name:
      return "compatibilityEvaluation";
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

  return (
    <SitePage
      onPageLoad={onPageLoad}
      viewModel={sitePageViewModel}
      selectedTab={selectedTab}
      fromCompatibilityEvaluation={route.params.fromCompatibilityEvaluation ?? false}
    />
  );
}
