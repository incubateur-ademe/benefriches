import { useEffect } from "react";
import { createGroup } from "type-route";

import DemoApp from "@/demo/DemoApp";
import FeaturesApp from "@/features/FeaturesApp";

import PublicApp from "../../features/public-pages/PublicApp";
import MatomoContainer from "./MatomoContainer";
import { trackPageView } from "./analytics";
import { BENEFRICHES_ENV } from "./envVars";
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
  demo: createGroup([
    routes.demo,
    routes.demoIdentity,
    routes.demoMyProjects,
    routes.demoProjectImpacts,
    routes.demoSiteFeatures,
    routes.demoProjectImpactsOnboarding,
    routes.demoOnBoardingIntroductionHow,
    routes.demoOnBoardingIntroductionWhy,
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

        if (groups.demo.has(route)) {
          return <DemoApp />;
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
