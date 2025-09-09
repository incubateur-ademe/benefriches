import { useEffect } from "react";
import { createGroup } from "type-route";

import FeaturesApp from "@/features/FeaturesApp";
import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action";

import PublicApp from "../../features/public-pages/PublicApp";
import MatomoContainer from "./MatomoContainer";
import { trackPageView } from "./analytics";
import { BENEFRICHES_ENV } from "./envVars";
import { useAppDispatch } from "./hooks/store.hooks";
import { routes, useRoute } from "./router";

const groups = {
  public: createGroup([
    routes.home,
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
    const pathWillQueryParams = window.location.pathname + window.location.search;
    trackPageView(pathWillQueryParams);
  }, [route]);

  useEffect(() => {
    void dispatch(initCurrentUser());
  }, [dispatch]);

  return (
    <>
      {(() => {
        if (groups.public.has(route)) {
          return <PublicApp />;
        }

        return <FeaturesApp />;
      })()}
      {BENEFRICHES_ENV.matomoTrackingEnabled && (
        <MatomoContainer
          siteId={BENEFRICHES_ENV.matomoSiteId}
          matomoUrl={BENEFRICHES_ENV.matomoUrl}
        />
      )}
    </>
  );
}

export default App;
