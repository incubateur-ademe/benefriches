import { createContext } from "react";

import type { StepCompletionPayload } from "@/features/create-site/core/custom/custom.actions";
import type { creationCustomFormSelectors } from "@/features/create-site/core/custom/customForm.selectors";
import type { SiteCreationCustomStep } from "@/features/create-site/core/custom/customSteps";

export type CustomSiteFormContextValue = typeof creationCustomFormSelectors & {
  onNext: () => void;
  onBack: () => void;
  onRequestStepCompletion: (payload: StepCompletionPayload) => void;
  onNavigateToStep: (stepId: SiteCreationCustomStep) => void;
  onConfirmStepCompletion: () => void;
  onCancelStepCompletion: () => void;
  onSave: () => void;
  onFetchSiteMunicipalityData: () => Promise<unknown>;
  onFetchSiteSoilsCarbonStorage: () => Promise<unknown>;
};

export const CustomSiteFormContext = createContext<CustomSiteFormContextValue | null>(null);
