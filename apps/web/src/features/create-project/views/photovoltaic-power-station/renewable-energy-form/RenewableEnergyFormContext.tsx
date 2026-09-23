import { createContext } from "react";

import type { StepCompletionPayload } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import type { createRenewableEnergyFormSelectors } from "@/features/create-project/core/renewable-energy/renewableEnergyForm.selectors";
import type { RenewableEnergyCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergySteps";

export type RenewableEnergyFormContextValue = ReturnType<
  typeof createRenewableEnergyFormSelectors
> & {
  onNext: () => void;
  onBack: () => void;
  onRequestStepCompletion: (payload: StepCompletionPayload) => void;
  onNavigateToStep: (stepId: RenewableEnergyCreationStep) => void;
  onFetchExpectedAnnualPowerPerformance: () => void;
  onFetchSoilsCarbonStorage: () => void;
  onFetchSiteLocalAuthorities: () => void;
  onSave: () => void;
};

export const RenewableEnergyFormContext = createContext<RenewableEnergyFormContextValue | null>(
  null,
);
