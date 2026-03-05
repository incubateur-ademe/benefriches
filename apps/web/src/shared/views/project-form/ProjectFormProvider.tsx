import React, { useMemo, useCallback, ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
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

import { ProjectFormContext, ProjectFormContextValue } from "./ProjectFormContext";
import { StepGroupId } from "./stepper/stepperConfig";

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

  const stepsSequenceGroupedBySections = useAppSelector(selectors.selectStepsGroupedBySections);

  const onNext = useCallback(() => dispatch(actions.nextStepRequested()), [dispatch, actions]);

  const onSave = useCallback(async () => {
    await dispatch(saveAction());
    if (mode === "create") {
      onNext();
    }
  }, [dispatch, saveAction, onNext, mode]);

  const onBack = useCallback(() => {
    dispatch(actions.previousStepRequested());
  }, [dispatch, actions]);

  const onRequestStepCompletion = useCallback(
    (payload: StepCompletionPayload) => dispatch(actions.stepCompletionRequested(payload)),
    [dispatch, actions],
  );

  const onNavigateToStep = useCallback(
    (stepId: UrbanProjectCreationStep) => dispatch(actions.stepNavigationRequested({ stepId })),
    [dispatch, actions],
  );

  const onNavigateToStepperGroup = useCallback(
    (stepGroupId: StepGroupId) => {
      const firstStepId = stepsSequenceGroupedBySections[stepGroupId][0]?.stepId;
      const nextStepToFill = stepsSequenceGroupedBySections[stepGroupId].find(
        ({ isStepCompleted }) => !isStepCompleted,
      )?.stepId;
      const nextStep = nextStepToFill ?? firstStepId;
      if (nextStep) {
        dispatch(actions.stepNavigationRequested({ stepId: nextStep }));
      } else {
        console.error(`Cannot find nextStepId for group section ${stepGroupId}`);
      }
    },
    [dispatch, actions, stepsSequenceGroupedBySections],
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
    () => dispatch(actions.stepCompletionCancelled()),
    [dispatch, actions],
  );

  const onConfirmStepCompletion = useCallback(
    () => dispatch(actions.stepCompletionConfirmed()),
    [dispatch, actions],
  );

  const value: ProjectFormContextValue = useMemo(
    () => ({
      ...selectors,

      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onNavigateToStepperGroup,
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
      onNavigateToStepperGroup,
      onFetchSoilsCarbonStorageDifference,
      onFetchSiteLocalAuthorities,
      onCancelStepCompletion,
      onConfirmStepCompletion,
      onSave,
    ],
  );

  return <ProjectFormContext.Provider value={value}>{children}</ProjectFormContext.Provider>;
};
