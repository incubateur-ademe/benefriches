import React, { ReactNode, useCallback, useMemo } from "react";

import { useAppDispatch } from "@/app/hooks/store.hooks";
import { saveReconversionProject } from "@/features/create-project/core/renewable-energy/actions/customProjectSaved.action";
import {
  creationRenewableEnergyFormActions,
  StepCompletionPayload,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { creationRenewableEnergyFormSelectors } from "@/features/create-project/core/renewable-energy/renewableEnergyProject.selectors";
import { RenewableEnergyCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergySteps";
import {
  reconversionProjectUpdateSaved,
  updateProjectFormRenewableEnergyActions,
} from "@/features/update-project/core/updateProject.actions";
import { updateRenewableEnergyFormSelectors } from "@/features/update-project/core/updateProject.selectors";

import {
  RenewableEnergyFormContext,
  RenewableEnergyFormContextValue,
} from "./RenewableEnergyFormContext";

type RenewableEnergyFormProviderProps = {
  children: ReactNode;
  mode: "create" | "update";
};

export const RenewableEnergyFormProvider: React.FC<RenewableEnergyFormProviderProps> = ({
  children,
  mode,
}) => {
  const dispatch = useAppDispatch();

  const actions = useMemo(
    () =>
      mode === "create"
        ? creationRenewableEnergyFormActions
        : updateProjectFormRenewableEnergyActions,
    [mode],
  );

  const selectors = useMemo(
    () =>
      mode === "create" ? creationRenewableEnergyFormSelectors : updateRenewableEnergyFormSelectors,
    [mode],
  );

  const saveAction = useMemo(
    () => (mode === "create" ? saveReconversionProject : reconversionProjectUpdateSaved),
    [mode],
  );

  const onNext = useCallback(() => dispatch(actions.nextStepRequested()), [dispatch, actions]);

  const onBack = useCallback(() => dispatch(actions.previousStepRequested()), [dispatch, actions]);

  const onRequestStepCompletion = useCallback(
    (payload: StepCompletionPayload) => dispatch(actions.stepCompletionRequested(payload)),
    [dispatch, actions],
  );

  const onNavigateToStep = useCallback(
    (stepId: RenewableEnergyCreationStep) => dispatch(actions.stepNavigationRequested({ stepId })),
    [dispatch, actions],
  );

  const onFetchExpectedAnnualPowerPerformance = useCallback(
    () => void dispatch(actions.fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation()),
    [dispatch, actions],
  );

  const onFetchSoilsCarbonStorage = useCallback(
    () => void dispatch(actions.fetchCurrentAndProjectedSoilsCarbonStorage()),
    [dispatch, actions],
  );

  const onSave = useCallback(() => {
    void dispatch(saveAction());
  }, [dispatch, saveAction]);

  const value: RenewableEnergyFormContextValue = useMemo(
    () => ({
      ...selectors,

      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onFetchExpectedAnnualPowerPerformance,
      onFetchSoilsCarbonStorage,
      onSave,
    }),
    [
      selectors,

      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onFetchExpectedAnnualPowerPerformance,
      onFetchSoilsCarbonStorage,
      onSave,
    ],
  );

  return (
    <RenewableEnergyFormContext.Provider value={value}>
      {children}
    </RenewableEnergyFormContext.Provider>
  );
};
