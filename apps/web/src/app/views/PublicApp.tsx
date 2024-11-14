import { lazy, Suspense } from "react";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";

import NotFoundScreen from "./not-found";
import { routes, useRoute } from "./router";

/* Lazy-loaded pages */
const AccessibilitePage = lazy(() => import("./pages/AccessibilitePage"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const MentionsLegalesPage = lazy(() => import("./pages/MentionsLegalesPage"));
const PolitiqueConfidentialitePage = lazy(() => import("./pages/PolitiqueConfidentialitePage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));

function PublicApp() {
  const route = useRoute();
  return (
    <HeaderFooterLayout>
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (route.name) {
            case routes.home.name:
              return <HomePage />;
            case routes.budget.name:
              return <BudgetPage />;
            case routes.stats.name:
              return <StatsPage />;
            case routes.mentionsLegales.name:
              return <MentionsLegalesPage />;
            case routes.accessibilite.name:
              return <AccessibilitePage />;
            case routes.politiqueConfidentialite.name:
              return <PolitiqueConfidentialitePage />;
            // 404
            default:
              return <NotFoundScreen />;
          }
        })()}
      </Suspense>
    </HeaderFooterLayout>
  );
}

export default PublicApp;
