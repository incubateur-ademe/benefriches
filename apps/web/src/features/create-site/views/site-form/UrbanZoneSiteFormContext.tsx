import { createContext } from "react";

import type { StepCompletionPayload } from "@/features/create-site/core/urban-zone/urban-zone.actions";
import type { creationUrbanZoneFormSelectors } from "@/features/create-site/core/urban-zone/urbanZoneForm.selectors";
import type { UrbanZoneSiteCreationStep } from "@/features/create-site/core/urban-zone/urbanZoneSteps";

export type UrbanZoneSiteFormContextValue = typeof creationUrbanZoneFormSelectors & {
  onNext: () => void;
  onBack: () => void;
  onRequestStepCompletion: (payload: StepCompletionPayload) => void;
  onNavigateToStep: (stepId: UrbanZoneSiteCreationStep) => void;
  onConfirmStepCompletion: () => void;
  onCancelStepCompletion: () => void;
  onSave: () => void;
  onFetchSiteMunicipalityData: () => Promise<unknown>;
  onFetchSiteSoilsCarbonStorage: () => Promise<unknown>;
};

export const UrbanZoneSiteFormContext = createContext<UrbanZoneSiteFormContextValue | null>(null);
