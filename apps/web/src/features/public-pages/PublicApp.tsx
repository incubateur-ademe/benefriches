import { lazy, Suspense } from "react";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";

import NotFoundScreen from "../../shared/views/components/NotFound/NotFound";
import { routes, useRoute } from "../../shared/views/router";

/* Lazy-loaded pages */
const AccessibilitePage = lazy(
  () => import("@/features/public-pages/accesibilite/AccessibilitePage"),
);
const BudgetPage = lazy(() => import("@/features/public-pages/budget/BudgetPage"));
const HomePage = lazy(() => import("@/features/public-pages/home/HomePage"));
const NewHomePage = lazy(() => import("@/features/public-pages/home/NewHomePage"));
const MentionsLegalesPage = lazy(
  () => import("@/features/public-pages/mentions-legales/MentionsLegalesPage"),
);
const PolitiqueConfidentialitePage = lazy(
  () => import("@/features/public-pages/politique-confidentialite/PolitiqueConfidentialitePage"),
);
const StatsPage = lazy(() => import("@/features/public-pages/stats/StatsPage"));

function PublicApp() {
  const route = useRoute();
  return (
    <HeaderFooterLayout>
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (route.name) {
            case routes.home.name:
              return <HomePage />;
            case routes.newHome.name:
              return <NewHomePage />;
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
