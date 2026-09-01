import { useEffect, useMemo } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";
import { customStepToComponent } from "@/features/create-site/views/custom/stepToComponent";
import { getRouteFromCreationStep } from "@/features/create-site/views/routes";
import { renderStepView } from "@/features/create-site/views/site-form/stepView.types";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { SidebarLayoutProps } from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import SiteUpdateStepper from "./SiteUpdateStepper";
import { useSyncSiteUpdateStepWithRouteQuery } from "./useSyncSiteUpdateStepWithRouteQuery";

const HTML_SITE_UPDATE_MAIN_TITLE = "Site foncier - Modification";

type Props = {
  siteId: string;
};

function SiteUpdateView({ siteId }: Props) {
  const currentRoute = useRoute();
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);
  const { selectCurrentStep, selectDerivedSiteData } = useCustomSiteForm();
  const currentStep = useAppSelector(selectCurrentStep);
  const siteName = useAppSelector(selectDerivedSiteData).name ?? "";

  useSyncSiteUpdateStepWithRouteQuery(getRouteFromCreationStep(currentStep));
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const goBackProps = useMemo(() => {
    if (
      currentRoute.name === routes.updateSite.name &&
      currentRoute.params.from === "evaluations"
    ) {
      return { linkProps: routes.myEvaluations().link, text: "Retour à mes évaluations" };
    }
    return {
      linkProps: routes.siteFeatures({ siteId }).link,
      text: "Retour aux détails du site",
    };
  }, [currentRoute, siteId]);

  const actions: SidebarLayoutProps["actions"] = [
    {
      ...goBackProps,
      iconId: "ri-arrow-left-line",
      priority: "secondary",
    },
  ];

  return (
    <SidebarLayout
      title={`Modification du site « ${siteName} »`}
      header="sticky"
      currentUserEmail={currentUserEmail}
      actions={actions}
      sidebarChildren={<SiteUpdateStepper />}
      mainChildren={renderStepView(customStepToComponent, currentStep, HTML_SITE_UPDATE_MAIN_TITLE)}
    />
  );
}

export default SiteUpdateView;
