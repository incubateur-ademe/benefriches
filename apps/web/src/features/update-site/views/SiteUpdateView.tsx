import { useEffect, useMemo } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";
import { isUrbanZoneStepHandlerStep } from "@/features/create-site/core/urban-zone/urbanZoneSteps";
import { customStepToComponent } from "@/features/create-site/views/custom/stepToComponent";
import { getRouteFromCreationStep } from "@/features/create-site/views/routes";
import { UrbanZoneSiteFormProvider } from "@/features/create-site/views/site-form/UrbanZoneSiteFormProvider";
import { renderStepView } from "@/features/create-site/views/site-form/stepView.types";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import { urbanZoneStepToComponent } from "@/features/create-site/views/urban-zone/stepToComponent";
import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { SidebarLayoutProps } from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { updateUrbanZoneFormSelectors } from "../core/updateSite.actions";
import { selectSiteUpdateCurrentStep } from "../core/updateSite.reducer";
import SiteUpdateStepper from "./SiteUpdateStepper";
import SiteUpdateUrbanZoneStepper from "./SiteUpdateUrbanZoneStepper";
import { useSyncSiteUpdateStepWithRouteQuery } from "./useSyncSiteUpdateStepWithRouteQuery";

const HTML_SITE_UPDATE_MAIN_TITLE = "Site foncier - Modification";

type Props = {
  siteId: string;
};

function SiteUpdateView({ siteId }: Props) {
  const currentRoute = useRoute();
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);
  const { selectDerivedSiteData } = useCustomSiteForm();
  const currentStep = useAppSelector(selectSiteUpdateCurrentStep);
  const siteData = useAppSelector(selectDerivedSiteData);
  // For an urban-zone site the custom flow's own derived site data never carries a name (its
  // NAMING step lives on the urban-zone sub-flow instead, see convertSiteToCustomSteps.ts) — so
  // for that nature, read the name (falling back to an address-derived generated name) off the
  // urban-zone sub-flow's own NAMING selector instead, the same one URBAN_ZONE_NAMING's own step
  // view reads.
  const urbanZoneNaming = useAppSelector(
    updateUrbanZoneFormSelectors.selectUrbanZoneNamingViewData,
  );
  const siteName =
    siteData.nature === "URBAN_ZONE" ? urbanZoneNaming.initialValues.name : (siteData.name ?? "");

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

  // Two-engine flow (ticket 11): ADDRESS/SURFACE_AREA/URBAN_ZONE_TYPE stay on the custom
  // provider/stepper (already an ancestor, see views/index.tsx); every other urban-zone step
  // needs its own provider (a second, independent context) and its own clickable stepper.
  const isUrbanZoneStep = isUrbanZoneStepHandlerStep(currentStep);

  const mainChildren = isUrbanZoneStep ? (
    <UrbanZoneSiteFormProvider mode="update">
      {renderStepView(urbanZoneStepToComponent, currentStep, HTML_SITE_UPDATE_MAIN_TITLE)}
    </UrbanZoneSiteFormProvider>
  ) : (
    renderStepView(customStepToComponent, currentStep, HTML_SITE_UPDATE_MAIN_TITLE)
  );

  const sidebarChildren = isUrbanZoneStep ? (
    <UrbanZoneSiteFormProvider mode="update">
      <SiteUpdateUrbanZoneStepper />
    </UrbanZoneSiteFormProvider>
  ) : (
    <SiteUpdateStepper />
  );

  return (
    <SidebarLayout
      title={`Modification du site « ${siteName} »`}
      header="sticky"
      currentUserEmail={currentUserEmail}
      actions={actions}
      sidebarChildren={sidebarChildren}
      mainChildren={mainChildren}
    />
  );
}

export default SiteUpdateView;
