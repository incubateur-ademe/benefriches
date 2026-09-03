import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { isUrbanZoneStepHandlerStep } from "@/features/create-site/core/urban-zone/urbanZoneSteps";
import { customStepToComponent } from "@/features/create-site/views/custom/stepToComponent";
import { getRouteFromCreationStep } from "@/features/create-site/views/routes";
import { UrbanZoneSiteFormProvider } from "@/features/create-site/views/site-form/UrbanZoneSiteFormProvider";
import { renderStepView } from "@/features/create-site/views/site-form/stepView.types";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";
import { urbanZoneStepToComponent } from "@/features/create-site/views/urban-zone/stepToComponent";
import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { updateUrbanZoneFormSelectors } from "../core/updateSite.actions";
import {
  selectSiteUpdateCurrentStep,
  selectSiteUpdateIsFormValid,
  selectSiteUpdateSaveState,
} from "../core/updateSite.reducer";
import SiteUpdateNavigationBlockerDialog from "./SiteUpdateNavigationBlockerDialog";
import SiteUpdateStepper from "./SiteUpdateStepper";
import SiteUpdateUrbanZoneStepper from "./SiteUpdateUrbanZoneStepper";
import { useSiteUpdateSidebarActions } from "./useSiteUpdateSidebarActions";
import { useSyncSiteUpdateStepWithRouteQuery } from "./useSyncSiteUpdateStepWithRouteQuery";

// The two final-summary steps (SiteDataSummary / UrbanZoneFinalSummary, both shared with
// creation) already render their own "La sauvegarde a échoué" alert — this set is used to skip
// the wizard-level alert below on those two steps only, so the error never shows twice.
const STEPS_WITH_OWN_SAVE_ERROR_ALERT = new Set(["FINAL_SUMMARY", "URBAN_ZONE_FINAL_SUMMARY"]);

const HTML_SITE_UPDATE_MAIN_TITLE = "Site foncier - Modification";

type Props = {
  siteId: string;
};

function SiteUpdateView({ siteId }: Props) {
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);
  const { selectDerivedSiteData, onSave } = useCustomSiteForm();
  const currentStep = useAppSelector(selectSiteUpdateCurrentStep);
  const siteData = useAppSelector(selectDerivedSiteData);
  // Read from the store (not from `useCustomSiteForm()`, whose selectors only see the `custom`
  // sub-state) so the combined save state/validity are correct for urban-zone-only edits too —
  // see `selectSiteUpdateSaveState`'s doc comment in updateSite.reducer.ts.
  const saveState = useAppSelector(selectSiteUpdateSaveState);
  const isFormValid = useAppSelector(selectSiteUpdateIsFormValid);
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

  const actions = useSiteUpdateSidebarActions({ siteId, onSave, saveState, isFormValid });

  // Two-engine flow (ticket 11): ADDRESS/SURFACE_AREA/URBAN_ZONE_TYPE stay on the custom
  // provider/stepper (already an ancestor, see views/index.tsx); every other urban-zone step
  // needs its own provider (a second, independent context) and its own clickable stepper.
  const isUrbanZoneStep = isUrbanZoneStepHandlerStep(currentStep);

  const showSaveErrorAlert =
    saveState === "error" && !STEPS_WITH_OWN_SAVE_ERROR_ALERT.has(currentStep);

  const stepContent = isUrbanZoneStep ? (
    <UrbanZoneSiteFormProvider mode="update">
      {renderStepView(urbanZoneStepToComponent, currentStep, HTML_SITE_UPDATE_MAIN_TITLE)}
    </UrbanZoneSiteFormProvider>
  ) : (
    renderStepView(customStepToComponent, currentStep, HTML_SITE_UPDATE_MAIN_TITLE)
  );

  const mainChildren =
    saveState === "loading" ? (
      <LoadingSpinner />
    ) : (
      <>
        {showSaveErrorAlert && (
          <Alert
            className="mb-4"
            severity="error"
            title="La sauvegarde a échoué"
            description="Une erreur s'est produite lors de l'enregistrement des modifications. Veuillez réessayer."
          />
        )}
        {stepContent}
      </>
    );

  const sidebarChildren = isUrbanZoneStep ? (
    <UrbanZoneSiteFormProvider mode="update">
      <SiteUpdateUrbanZoneStepper />
    </UrbanZoneSiteFormProvider>
  ) : (
    <SiteUpdateStepper />
  );

  return (
    <>
      {/* Mounted as a sibling of SidebarLayout, not inside mainChildren: mainChildren is swapped
          for a LoadingSpinner while saveState === "loading", which would otherwise unmount and
          remount the dialog (and its session.block subscription) on every save. */}
      <SiteUpdateNavigationBlockerDialog shouldBlock={saveState === "dirty"} />
      <SidebarLayout
        title={`Modification du site « ${siteName} »`}
        header="sticky"
        currentUserEmail={currentUserEmail}
        actions={actions}
        sidebarChildren={sidebarChildren}
        mainChildren={mainChildren}
      />
    </>
  );
}

export default SiteUpdateView;
