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
  fetchSiteUpdateMunicipalityData,
  fetchSiteUpdateSoilsCarbonStorage,
  siteUpdateSaved,
  updateUrbanZoneFormActions,
  updateUrbanZoneFormSelectors,
} from "@/features/update-site/core/updateSite.actions";

import {
  UrbanZoneSiteFormContext,
  UrbanZoneSiteFormContextValue,
} from "./UrbanZoneSiteFormContext";

type Props = {
  children: ReactNode;
  mode: "create" | "update";
};

export const UrbanZoneSiteFormProvider: React.FC<Props> = ({ children, mode }) => {
  const dispatch = useAppDispatch();

  const actions = useMemo(
    () => (mode === "create" ? urbanZoneFormActions : updateUrbanZoneFormActions),
    [mode],
  );

  const selectors = useMemo(
    () => (mode === "create" ? creationUrbanZoneFormSelectors : updateUrbanZoneFormSelectors),
    [mode],
  );

  const saveAction = useMemo(
    () => (mode === "create" ? urbanZoneSiteSaved : siteUpdateSaved),
    [mode],
  );

  const fetchMunicipalityDataAction = useMemo(
    () => (mode === "create" ? fetchSiteMunicipalityData : fetchSiteUpdateMunicipalityData),
    [mode],
  );

  const fetchSoilsCarbonStorageAction = useMemo(
    () => (mode === "create" ? fetchSiteSoilsCarbonStorage : fetchSiteUpdateSoilsCarbonStorage),
    [mode],
  );

  const onNext = useCallback(() => dispatch(actions.nextStepRequested()), [dispatch, actions]);

  const onBack = useCallback(() => dispatch(actions.previousStepRequested()), [dispatch, actions]);

  const onRequestStepCompletion = useCallback(
    (payload: StepCompletionPayload) => dispatch(actions.stepCompletionRequested(payload)),
    [dispatch, actions],
  );

  const onNavigateToStep = useCallback(
    (stepId: UrbanZoneSiteCreationStep) => dispatch(actions.stepNavigationRequested({ stepId })),
    [dispatch, actions],
  );

  const onConfirmStepCompletion = useCallback(
    () => dispatch(actions.stepCompletionConfirmed()),
    [dispatch, actions],
  );

  const onCancelStepCompletion = useCallback(
    () => dispatch(actions.stepCompletionCancelled()),
    [dispatch, actions],
  );

  const onSave = useCallback(() => {
    void dispatch(saveAction());
  }, [dispatch, saveAction]);

  // Return the dispatched promise (not void) — some callers `await` it to gate a loading state.
  const onFetchSiteMunicipalityData = useCallback(
    () => dispatch(fetchMunicipalityDataAction()),
    [dispatch, fetchMunicipalityDataAction],
  );

  const onFetchSiteSoilsCarbonStorage = useCallback(
    () => dispatch(fetchSoilsCarbonStorageAction()),
    [dispatch, fetchSoilsCarbonStorageAction],
  );

  const value: UrbanZoneSiteFormContextValue = useMemo(
    () => ({
      ...selectors,
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
      selectors,
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
