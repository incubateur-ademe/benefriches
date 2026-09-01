import React, { ReactNode, useCallback, useMemo } from "react";

import { useAppDispatch } from "@/app/hooks/store.hooks";
import { fetchSiteMunicipalityData } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import { fetchSiteSoilsCarbonStorage } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import {
  customFormActions,
  type StepCompletionPayload,
} from "@/features/create-site/core/custom/custom.actions";
import { creationCustomFormSelectors } from "@/features/create-site/core/custom/customForm.selectors";
import type { SiteCreationCustomStep } from "@/features/create-site/core/custom/customSteps";
import { customSiteSaved } from "@/features/create-site/core/steps/final/final.actions";
import { surfaceAreaInputModeUpdated } from "@/features/create-site/core/steps/spaces/spaces.actions";
import {
  fetchSiteUpdateMunicipalityData,
  fetchSiteUpdateSoilsCarbonStorage,
  siteUpdateSaved,
  updateCustomFormActions,
  updateCustomFormSelectors,
} from "@/features/update-site/core/updateSite.actions";

import { CustomSiteFormContext, CustomSiteFormContextValue } from "./CustomSiteFormContext";

type Props = {
  children: ReactNode;
  mode: "create" | "update";
};

export const CustomSiteFormProvider: React.FC<Props> = ({ children, mode }) => {
  const dispatch = useAppDispatch();

  const actions = useMemo(
    () => (mode === "create" ? customFormActions : updateCustomFormActions),
    [mode],
  );

  const selectors = useMemo(
    () => (mode === "create" ? creationCustomFormSelectors : updateCustomFormSelectors),
    [mode],
  );

  const saveAction = useMemo(() => (mode === "create" ? customSiteSaved : siteUpdateSaved), [mode]);

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
    (stepId: SiteCreationCustomStep) => dispatch(actions.stepNavigationRequested({ stepId })),
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

  // Shared, mode-agnostic action (see spaces.actions.ts) — dispatching it only ever touches the
  // slice the surface-area distribution form is currently mounted against.
  const onSurfaceAreaInputModeChange = useCallback(
    (inputMode: "percentage" | "squareMeters") => dispatch(surfaceAreaInputModeUpdated(inputMode)),
    [dispatch],
  );

  const value: CustomSiteFormContextValue = useMemo(
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
      onSurfaceAreaInputModeChange,
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
      onSurfaceAreaInputModeChange,
    ],
  );

  return <CustomSiteFormContext.Provider value={value}>{children}</CustomSiteFormContext.Provider>;
};
