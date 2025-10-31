import React, { useMemo, useCallback, ReactNode } from "react";

import {
  creationProjectFormActions,
  creationProjectFormUrbanActions,
} from "@/features/create-project/core/urban-project/urbanProject.actions";
import { creationProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { customUrbanProjectSaved } from "@/features/create-project/core/urban-project/urbanProjectCustomSaved.action";
import {
  reconversionProjectUpdateSaved,
  updateProjectFormActions,
  updateProjectFormUrbanActions,
} from "@/features/update-project/core/updateProject.actions";
import { updateUrbanProjectFormSelectors } from "@/features/update-project/core/updateProject.selectors";
import { StepCompletionPayload } from "@/shared/core/reducers/project-form/urban-project/urbanProject.actions";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { useAppDispatch } from "../hooks/store.hooks";
import { ProjectFormContext, ProjectFormContextValue } from "./ProjectFormContext";

type ProjectFormProviderProps = {
  children: ReactNode;
  mode: "create" | "update";
};

export const ProjectFormProvider: React.FC<ProjectFormProviderProps> = ({ children, mode }) => {
  const dispatch = useAppDispatch();

  const actions = useMemo(
    () =>
      mode === "create"
        ? { ...creationProjectFormActions, ...creationProjectFormUrbanActions }
        : { ...updateProjectFormActions, ...updateProjectFormUrbanActions },
    [mode],
  );

  const selectors = useMemo(
    () => (mode === "create" ? creationProjectFormSelectors : updateUrbanProjectFormSelectors),
    [mode],
  );

  const saveAction = useMemo(
    () => (mode === "create" ? customUrbanProjectSaved : reconversionProjectUpdateSaved),
    [mode],
  );

  const onNext = useCallback(() => dispatch(actions.navigateToNext()), [dispatch, actions]);

  const onSave = useCallback(async () => {
    await dispatch(saveAction());
    if (mode === "create") {
      onNext();
    }
  }, [dispatch, mode, onNext, saveAction]);

  const onBack = useCallback(() => {
    dispatch(actions.navigateToPrevious());
  }, [dispatch, actions]);

  const onRequestStepCompletion = useCallback(
    (payload: StepCompletionPayload) => dispatch(actions.requestStepCompletion(payload)),
    [dispatch, actions],
  );

  const onNavigateToStep = useCallback(
    (stepId: UrbanProjectCreationStep) => dispatch(actions.navigateToStep({ stepId })),
    [dispatch, actions],
  );

  const onFetchSoilsCarbonStorageDifference = useCallback(
    () => dispatch(actions.fetchSoilsCarbonStorageDifference()),
    [dispatch, actions],
  );

  const onFetchSiteLocalAuthorities = useCallback(
    () => dispatch(actions.fetchSiteRelatedLocalAuthorities()),
    [dispatch, actions],
  );

  const onCancelStepCompletion = useCallback(
    () => dispatch(actions.cancelStepCompletion()),
    [dispatch, actions],
  );

  const onConfirmStepCompletion = useCallback(
    () => dispatch(actions.confirmStepCompletion()),
    [dispatch, actions],
  );

  const value: ProjectFormContextValue = useMemo(
    () => ({
      ...selectors,

      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onFetchSoilsCarbonStorageDifference,
      onFetchSiteLocalAuthorities,
      onCancelStepCompletion,
      onConfirmStepCompletion,
      onSave,
    }),
    [
      selectors,

      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onFetchSoilsCarbonStorageDifference,
      onFetchSiteLocalAuthorities,
      onCancelStepCompletion,
      onConfirmStepCompletion,
      onSave,
    ],
  );

  return <ProjectFormContext.Provider value={value}>{children}</ProjectFormContext.Provider>;
};
