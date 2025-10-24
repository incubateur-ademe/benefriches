import React, { useMemo, useCallback, ReactNode } from "react";

import { creationProjectFormActions } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { creationProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { updateProjectFormActions } from "@/features/update-project/core/updateProject.actions";
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

  const actions = mode === "create" ? creationProjectFormActions : updateProjectFormActions;
  const selectors =
    mode === "create" ? creationProjectFormSelectors : updateUrbanProjectFormSelectors;

  const onNext = useCallback(() => dispatch(actions.navigateToNext()), [dispatch, actions]);

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
      onCancelStepCompletion,
      onConfirmStepCompletion,
    }),
    [
      selectors,

      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onFetchSoilsCarbonStorageDifference,
      onCancelStepCompletion,
      onConfirmStepCompletion,
    ],
  );

  return <ProjectFormContext.Provider value={value}>{children}</ProjectFormContext.Provider>;
};
