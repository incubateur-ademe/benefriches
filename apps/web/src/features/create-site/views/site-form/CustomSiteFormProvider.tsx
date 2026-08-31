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

import { CustomSiteFormContext, CustomSiteFormContextValue } from "./CustomSiteFormContext";

type Props = {
  children: ReactNode;
  mode: "create";
};

export const CustomSiteFormProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();

  const onNext = useCallback(() => dispatch(customFormActions.nextStepRequested()), [dispatch]);

  const onBack = useCallback(() => dispatch(customFormActions.previousStepRequested()), [dispatch]);

  const onRequestStepCompletion = useCallback(
    (payload: StepCompletionPayload) =>
      dispatch(customFormActions.stepCompletionRequested(payload)),
    [dispatch],
  );

  const onNavigateToStep = useCallback(
    (stepId: SiteCreationCustomStep) =>
      dispatch(customFormActions.stepNavigationRequested({ stepId })),
    [dispatch],
  );

  const onConfirmStepCompletion = useCallback(
    () => dispatch(customFormActions.stepCompletionConfirmed()),
    [dispatch],
  );

  const onCancelStepCompletion = useCallback(
    () => dispatch(customFormActions.stepCompletionCancelled()),
    [dispatch],
  );

  const onSave = useCallback(() => {
    void dispatch(customSiteSaved());
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

  const value: CustomSiteFormContextValue = useMemo(
    () => ({
      ...creationCustomFormSelectors,
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

  return <CustomSiteFormContext.Provider value={value}>{children}</CustomSiteFormContext.Provider>;
};
