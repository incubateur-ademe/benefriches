import { createContext } from "react";

import type { SiteCreationCustomStep } from "@/features/create-site/core/custom/customSteps";
import type { StepCompletionPayload } from "@/features/create-site/core/urban-zone/urban-zone.actions";
import type { creationUrbanZoneFormSelectors } from "@/features/create-site/core/urban-zone/urbanZoneForm.selectors";
import type { UrbanZoneSiteCreationStep } from "@/features/create-site/core/urban-zone/urbanZoneSteps";

export type UrbanZoneSiteFormContextValue = typeof creationUrbanZoneFormSelectors & {
  onNext: () => void;
  onBack: () => void;
  onRequestStepCompletion: (payload: StepCompletionPayload) => void;
  onNavigateToStep: (stepId: UrbanZoneSiteCreationStep) => void;
  // Navigates to a step owned by the *custom* engine (e.g. ADDRESS, URBAN_ZONE_TYPE) — needed
  // for the final summary's 📍 Localisation section, whose data lives on state.custom, not
  // state.urbanZone. See UrbanZoneSiteFormProvider.tsx and customForm.reducer.ts's
  // `stepNavigationRequested` case (which clears `customHandedOffToUrbanZone` on this trigger).
  onNavigateToCustomStep: (stepId: SiteCreationCustomStep) => void;
  onConfirmStepCompletion: () => void;
  onCancelStepCompletion: () => void;
  onSave: () => void;
  onFetchSiteMunicipalityData: () => Promise<unknown>;
  onFetchSiteSoilsCarbonStorage: () => Promise<unknown>;
};

export const UrbanZoneSiteFormContext = createContext<UrbanZoneSiteFormContextValue | null>(null);
