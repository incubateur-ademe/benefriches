import React, { ReactNode, useCallback, useMemo } from "react";

import { useAppDispatch } from "@/app/hooks/store.hooks";
import { fetchSiteMunicipalityData } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import { fetchSiteSoilsCarbonStorage } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import {
  urbanZoneFormActions,
  type StepCompletionPayload,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";
import { creationUrbanZoneFormSelectors } from "@/features/create-site/core/urban-zone/urbanZoneForm.selectors";
import { urbanZoneSiteSaved } from "@/features/create-site/core/urban-zone/urbanZoneSiteSaved.action";
import type { UrbanZoneSiteCreationStep } from "@/features/create-site/core/urban-zone/urbanZoneSteps";

import {
  UrbanZoneSiteFormContext,
  UrbanZoneSiteFormContextValue,
} from "./UrbanZoneSiteFormContext";

type Props = {
  children: ReactNode;
  mode: "create";
};

export const UrbanZoneSiteFormProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();

  const onNext = useCallback(() => dispatch(urbanZoneFormActions.nextStepRequested()), [dispatch]);

  const onBack = useCallback(
    () => dispatch(urbanZoneFormActions.previousStepRequested()),
    [dispatch],
  );

  const onRequestStepCompletion = useCallback(
    (payload: StepCompletionPayload) =>
      dispatch(urbanZoneFormActions.stepCompletionRequested(payload)),
    [dispatch],
  );

  const onNavigateToStep = useCallback(
    (stepId: UrbanZoneSiteCreationStep) =>
      dispatch(urbanZoneFormActions.stepNavigationRequested({ stepId })),
    [dispatch],
  );

  const onConfirmStepCompletion = useCallback(
    () => dispatch(urbanZoneFormActions.stepCompletionConfirmed()),
    [dispatch],
  );

  const onCancelStepCompletion = useCallback(
    () => dispatch(urbanZoneFormActions.stepCompletionCancelled()),
    [dispatch],
  );

  const onSave = useCallback(() => {
    void dispatch(urbanZoneSiteSaved());
  }, [dispatch]);

  // Return the dispatched promise (not void) — some callers `await` it to gate a loading state.
  const onFetchSiteMunicipalityData = useCallback(
    () => dispatch(fetchSiteMunicipalityData()),
    [dispatch],
  );

  const onFetchSiteSoilsCarbonStorage = useCallback(
    () => dispatch(fetchSiteSoilsCarbonStorage()),
    [dispatch],
  );

  const value: UrbanZoneSiteFormContextValue = useMemo(
    () => ({
      ...creationUrbanZoneFormSelectors,
      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onConfirmStepCompletion,
      onCancelStepCompletion,
      onSave,
      onFetchSiteMunicipalityData,
      onFetchSiteSoilsCarbonStorage,
    }),
    [
      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onConfirmStepCompletion,
      onCancelStepCompletion,
      onSave,
      onFetchSiteMunicipalityData,
      onFetchSiteSoilsCarbonStorage,
    ],
  );

  return (
    <UrbanZoneSiteFormContext.Provider value={value}>{children}</UrbanZoneSiteFormContext.Provider>
  );
};
