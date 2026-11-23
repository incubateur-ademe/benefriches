import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { lazy, Suspense, useEffect } from "react";

import { pageViewed } from "@/features/analytics/core/pageViewed.action";
import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action";
import PublicApp from "@/features/public-pages/PublicApp";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { ScrollManager } from "./ScrollManager";
import { useAppDispatch } from "./hooks/store.hooks";
import { routesGroups, useRoute } from "./router";

const FeaturesApp = lazy(() => import("@/features/FeaturesApp"));

function App() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const pathWithQueryParams = window.location.pathname + window.location.search;
    void dispatch(pageViewed({ url: pathWithQueryParams }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <ScrollManager />
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          if (routesGroups.public.has(route) || route.name === false) {
            return <PublicApp route={route} />;
          }
          return (
            <>
              <meta name="robots" content="noindex" />
              <FeaturesApp />
            </>
          );
        })()}
      </Suspense>
    </div>
  );
}

export default App;
