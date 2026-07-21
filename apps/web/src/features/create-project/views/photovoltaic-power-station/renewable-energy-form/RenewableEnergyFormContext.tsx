import { createContext } from "react";

import { StepCompletionPayload } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { createRenewableEnergyFormSelectors } from "@/features/create-project/core/renewable-energy/renewableEnergyForm.selectors";
import { RenewableEnergyCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergySteps";

export type RenewableEnergyFormContextValue = ReturnType<
  typeof createRenewableEnergyFormSelectors
> & {
  onNext: () => void;
  onBack: () => void;
  onRequestStepCompletion: (payload: StepCompletionPayload) => void;
  onNavigateToStep: (stepId: RenewableEnergyCreationStep) => void;
  onFetchExpectedAnnualPowerPerformance: () => void;
  onFetchSoilsCarbonStorage: () => void;
  onSave: () => void;
};

export const RenewableEnergyFormContext = createContext<RenewableEnergyFormContextValue | null>(
  null,
);
