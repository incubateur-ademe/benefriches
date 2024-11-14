import { useEffect } from "react";
import { createGroup } from "type-route";

import FeaturesApp from "@/features/FeaturesApp";

import { trackPageView } from "../application/analytics";
import { BENEFRICHES_ENV } from "../application/envVars";
import MatomoContainer from "./MatomoContainer";
import PublicApp from "./PublicApp";
import { routes, useRoute } from "./router";

const groups = {
  public: createGroup([
    routes.home,
    routes.budget,
    routes.stats,
    routes.mentionsLegales,
    routes.accessibilite,
    routes.politiqueConfidentialite,
  ]),
};

function App() {
  const route = useRoute();

  useEffect(() => {
    trackPageView(route.href);
  }, [route]);

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
