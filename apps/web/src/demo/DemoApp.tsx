import Badge from "@codegouvfr/react-dsfr/Badge";
import { Suspense, useEffect } from "react";

import { routes, useRoute } from "@/app/views/router";
import OnBoardingIntroductionHow from "@/features/onboarding/how-it-works/HowItWorksPage";
import OnBoardingIntroductionWhyBenefriches from "@/features/onboarding/why-benefriches/WhyBenefrichesPage";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";
import { initCurrentUser } from "@/users/application/initCurrentUser.action";

import { isCurrentUserLoaded, selectCurrentUserId } from "../users/application/user.reducer";
import { DEMO_PROJECT, DEMO_SITE, IMPACTS_DATA } from "./demoData";
import AppDemoIdentity from "./identity/DemoIdentity";
import DemoMyProjects from "./my-projects/DemoMyProjects";
import DemoProjectImpacts from "./project-impacts/DemoProjectImpacts";
import DemoProjectImpactsOnboarding from "./project-impacts/DemoProjectImpactsOnboarding";
import DemoSiteFeatures from "./site-features/DemoSiteFeatures";

function DemoApp() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initCurrentUser());
  }, [dispatch]);

  const currentUserLoaded = useAppSelector(isCurrentUserLoaded);
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (currentUserLoaded && !currentUserId) {
      routes.demoIdentity().replace();
    }
  }, [currentUserLoaded, currentUserId]);

  useEffect(() => {
    if (route.name === routes.demo().name) {
      routes.demoOnBoardingIntroductionWhy().replace();
    }
  }, [route.name]);

  return (
    <HeaderFooterLayout
      headerProps={{
        homeLinkPropsHref: routes.demo().href,
        myProjectsLink: routes.demoMyProjects().link,
        serviceTitle: (
          <Badge className="tw-text" severity="new">
            DÉMO
          </Badge>
        ),
      }}
    >
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (route.name) {
            case routes.demoIdentity.name:
              return <AppDemoIdentity />;
            case routes.demoOnBoardingIntroductionHow.name:
              return (
                <OnBoardingIntroductionHow
                  nextLinkProps={routes.demoMyProjects().link}
                  backLinkProps={routes.demoOnBoardingIntroductionWhy().link}
                />
              );
            case routes.demoOnBoardingIntroductionWhy.name:
              return (
                <OnBoardingIntroductionWhyBenefriches
                  nextLinkProps={routes.demoOnBoardingIntroductionHow().link}
                />
              );
            case routes.demoMyProjects.name:
              return <DemoMyProjects siteData={DEMO_SITE} projectData={DEMO_PROJECT} />;

            case routes.demoSiteFeatures.name:
              return <DemoSiteFeatures siteData={DEMO_SITE} />;
            case routes.demoProjectImpacts.name:
              return (
                <DemoProjectImpacts
                  siteData={{
                    name: IMPACTS_DATA.relatedSiteName,
                    id: IMPACTS_DATA.relatedSiteId,
                    ...IMPACTS_DATA.siteData,
                  }}
                  projectData={DEMO_PROJECT}
                  impactsData={IMPACTS_DATA["impacts"]}
                />
              );
            case routes.demoProjectImpactsOnboarding.name:
              return (
                <DemoProjectImpactsOnboarding
                  siteData={{
                    name: IMPACTS_DATA.relatedSiteName,
                    id: IMPACTS_DATA.relatedSiteId,
                    ...IMPACTS_DATA.siteData,
                  }}
                  impactsData={IMPACTS_DATA["impacts"]}
                  projectId={DEMO_PROJECT.id}
                />
              );

            default:
              return (
                <OnBoardingIntroductionWhyBenefriches
                  nextLinkProps={routes.demoOnBoardingIntroductionHow().link}
                />
              );
          }
        })()}
      </Suspense>
    </HeaderFooterLayout>
  );
}

export default DemoApp;
