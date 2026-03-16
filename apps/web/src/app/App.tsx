import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { useEffect } from "react";
import { createGroup } from "type-route";

import FeaturesApp from "@/features/FeaturesApp";
import { pageViewed } from "@/features/analytics/core/pageViewed.action";
import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action";
import PublicApp from "@/features/public-pages/PublicApp";
import classNames from "@/shared/views/clsx";

import { useAppDispatch } from "./hooks/store.hooks";
import { routes, useRoute } from "./router";

const groups = {
  public: createGroup([
    routes.home,
    routes.landingBenefriches,
    routes.landingMutabilite,
    routes.budget,
    routes.stats,
    routes.mentionsLegales,
    routes.accessibilite,
    routes.politiqueConfidentialite,
    routes.accessBenefriches,
    routes.authWithToken,
    routes.onBoardingIdentity,
  ]),
};

function App() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const pathWithQueryParams = window.location.pathname + window.location.search;
    void dispatch(pageViewed({ url: pathWithQueryParams }));
  }, [route, dispatch]);

  useEffect(() => {
    void dispatch(initCurrentUser());
  }, [dispatch]);

  const { isDark } = useIsDark();

  return (
    <div
      className={classNames(
        "flex",
        "flex-col",
        "h-screen",
        // Force highchart à suivre la config dsfr pour le dark mode,
        // sinon la lib suit la config du navigateur "prefers-color-scheme"
        isDark ? "highcharts-dark" : "highcharts-light",
      )}
    >
      {(() => {
        if (groups.public.has(route)) {
          return <PublicApp />;
        }
        return <FeaturesApp />;
      })()}
    </div>
  );
}

export default App;
