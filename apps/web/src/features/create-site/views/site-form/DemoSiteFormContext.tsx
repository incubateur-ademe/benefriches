import { createContext } from "react";

import type { StepCompletionPayload } from "@/features/create-site/core/demo/demo.actions";
import type { creationDemoFormSelectors } from "@/features/create-site/core/demo/demoForm.selectors";
import type { DemoSiteCreationStep } from "@/features/create-site/core/demo/demoSteps";

export type DemoSiteFormContextValue = typeof creationDemoFormSelectors & {
  onNext: () => void;
  onBack: () => void;
  onRequestStepCompletion: (payload: StepCompletionPayload) => void;
  onNavigateToStep: (stepId: DemoSiteCreationStep) => void;
  onSave: () => void;
};

export const DemoSiteFormContext = createContext<DemoSiteFormContextValue | null>(null);
