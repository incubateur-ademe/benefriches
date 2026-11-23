import { lazy, Suspense } from "react";

import { type PublicRoute, routes, seoByRoute } from "@/app/router";
import UnsubscribePageContainer from "@/features/lifecycle-emails/views/unsubscribe";
import { Seo } from "@/shared/views/components/Seo/Seo";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import PublicPageLayout from "@/shared/views/layout/PublicPageLayout/HeaderFooterLayout";

import NotFoundScreen from "../../shared/views/components/NotFound/NotFound";
import AccessBenefrichesPage from "../onboarding/views/pages/access-benefriches";
import AuthWithToken from "../onboarding/views/pages/auth-with-token/AuthWithToken";
import OnBoardingIdentityPage from "../onboarding/views/pages/identity/OnBoardingIdentityPage";

/* Lazy-loaded pages */
const AccessibilitePage = lazy(
  () => import("@/features/public-pages/accesibilite/AccessibilitePage"),
);
const BudgetPage = lazy(() => import("@/features/public-pages/budget/BudgetPage"));
const HomePage = lazy(() => import("@/features/public-pages/landings/HomePage"));
const MentionsLegalesPage = lazy(
  () => import("@/features/public-pages/mentions-legales/MentionsLegalesPage"),
);
const PolitiqueConfidentialitePage = lazy(
  () => import("@/features/public-pages/politique-confidentialite/PolitiqueConfidentialitePage"),
);
const StatsPage = lazy(() => import("@/features/public-pages/stats/StatsPage"));

function PublicApp({ route }: { route: PublicRoute }) {
  const seo = route.name ? seoByRoute[route.name] : undefined;

  return (
    <PublicPageLayout>
      {seo ? (
        <Seo
          title={seo.title}
          description={seo.description}
          path={seo.path}
          noindex={!seo.indexable}
        />
      ) : (
        <Seo title={`Page introuvable - ${seoByRoute.home.title}`} noindex />
      )}
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
            case routes.accessBenefriches.name:
              return <AccessBenefrichesPage />;
            case routes.authWithToken.name:
              return <AuthWithToken />;
            case routes.onBoardingIdentity.name:
              return <OnBoardingIdentityPage />;
            case routes.lifecycleEmailsUnsubscribe.name:
              return <UnsubscribePageContainer />;
            // 404
            default:
              return <NotFoundScreen />;
          }
        })()}
      </Suspense>
    </PublicPageLayout>
  );
}

export default PublicApp;
